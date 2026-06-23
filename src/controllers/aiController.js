const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

exports.queryAI = async (req, res) => {
    try {
        const { query, history = [], draftCart: clientDraftCart = [] } = req.body;
        const q = query.toLowerCase();
        let response = "";
        let draftCart = JSON.parse(JSON.stringify(clientDraftCart)); // Deep copy to avoid mutating original request payload directly

        const SaleModel = mongoose.model('SaleOrder');
        const ProductModel = mongoose.model('Product');

        const isAdminOrStaff = req.user && (req.user.role === 'admin' || req.user.role === 'staff');

        // Local overrides for Quick Reports (Admin & Staff)
        if (q.includes('doanh thu')) {
            if (!isAdminOrStaff) {
                return res.json({ 
                    response: "Xin lỗi, thông tin doanh thu và tài chính chi tiết là bảo mật nội bộ của ThuyR Mart. Em không thể cung cấp cho quý khách được ạ! Quý khách có thể hỏi em các thông tin khác về mua sắm nhé! 😊",
                    draftCart 
                });
            }
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const stats = await SaleModel.aggregate([
                { $match: { 
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                    status: { $ne: 'cancelled' }
                } },
                { $group: { _id: null, total: { $sum: "$final_amount" } } }
            ]);
            
            const total = stats[0]?.total || 0;
            response = `Doanh thu hôm nay của cửa hàng là ${total.toLocaleString()}đ.`;
            return res.json({ response, draftCart });
        } else if (q.includes('sắp hết') || q.includes('tồn kho')) {
            if (!isAdminOrStaff) {
                return res.json({ 
                    response: "Xin lỗi, thông tin chi tiết về số lượng tồn kho nội bộ là bảo mật của cửa hàng. Quý khách có thể xem tình trạng còn hàng trực tiếp trên trang chi tiết của mỗi sản phẩm nhé! 😊",
                    draftCart 
                });
            }
            const lowStockProducts = await ProductModel.find({
                $expr: { $lte: ["$stock_quantity", "$min_stock"] }
            }).limit(5);

            if (lowStockProducts.length > 0) {
                const names = lowStockProducts.map(p => p.name).join(', ');
                response = `Có ${lowStockProducts.length} mặt hàng sắp hết: ${names}...`;
            } else {
                response = "Hiện tại không có mặt hàng nào sắp hết kho.";
            }
            return res.json({ response, draftCart });
        } else if (q.includes('bán chạy')) {
            const bestSellers = await SaleModel.aggregate([
                { $match: { status: { $ne: 'cancelled' } } },
                { $unwind: "$items" },
                { $group: { _id: "$items.product_id", sold: { $sum: "$items.quantity" } } },
                { $sort: { sold: -1 } },
                { $limit: 3 },
                { $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo"
                } },
                { $unwind: "$productInfo" }
            ]);

            if (bestSellers.length > 0) {
                if (isAdminOrStaff) {
                    const best = bestSellers.map(b => `${b.productInfo.name} (${b.sold} sp)`).join(', ');
                    response = `Top 3 sản phẩm bán chạy nhất là: ${best}.`;
                } else {
                    const best = bestSellers.map(b => `🌟 **${b.productInfo.name}**`).join(', ');
                    response = `Các sản phẩm đang bán cực kỳ chạy tại ThuyR Mart tuần này bao gồm: ${best}. Quý khách hãy tham khảo và chọn mua ngay nhé! Cửa hàng đang có ưu đãi giảm giá 10% khi nhập mã **THUYRMART2026** đấy ạ! 🛍️`;
                }
            } else {
                response = "Chưa có dữ liệu bán hàng để thống kê sản phẩm bán chạy.";
            }
            return res.json({ response, draftCart });
        }

        // Delegate to Gemini API with Tools (Function Calling)
        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            return res.json({ 
                response: "Tôi là trợ lý ảo ThuyR Mart. Tôi có thể giúp bạn kiểm tra doanh thu, tồn kho và hàng bán chạy. Hãy cấu hình GEMINI_API_KEY trong tệp .env để trò chuyện AI thông minh tự do nhé!",
                draftCart 
            });
        }

        // Build system instruction and user context
        // Build system instruction and user context (Only treat as logged-in if their role is customer)
        const userContextText = (req.user && req.user.role === 'customer')
            ? `Khách hàng hiện tại ĐÃ ĐĂNG NHẬP: Họ tên "${req.user.full_name}", Số điện thoại "${req.user.phone}", ID "${req.user.id}". Không cần hỏi lại tên và SĐT của họ.`
            : `Khách hàng hiện tại CHƯA ĐĂNG NHẬP (Khách vãng lai). Nếu họ muốn checkoutOrder, bắt buộc bạn phải hỏi xin Họ tên, Số điện thoại và Địa chỉ giao hàng trước.`;

        const systemPrompt = `Bạn là Trợ lý ảo AI thông minh, thân thiện và chuyên nghiệp của hệ thống bán lẻ ThuyR Mart (https://thuyrmart.onrender.com).
Nhiệm vụ của bạn là trò chuyện bằng tiếng Việt cực kỳ tự nhiên, tư vấn mua sắm, giới thiệu sản phẩm và hỗ trợ khách đặt hàng trực tiếp ngay trong khung chat này.

Quy tắc hoạt động:
1. Trò chuyện lễ phép, thân thiện và ngắn gọn. Dùng kính ngữ "dạ", "thưa", "ạ", "quý khách".
2. Bối cảnh người dùng: ${userContextText}
3. Khi khách tìm kiếm hoặc muốn mua một sản phẩm bất kỳ (ví dụ: "tôi muốn mua nước mắm", "có mì hảo hảo không"), bạn PHẢI gọi công cụ "searchProducts" với từ khóa tương ứng. Tuyệt đối không tự bịa ra thông tin sản phẩm và giá cả nếu DB không trả về.
4. Trình bày danh sách sản phẩm tìm thấy đẹp mắt (gồm Tên, Giá, ID sản phẩm), sau đó hỏi khách muốn chọn loại nào và số lượng bao nhiêu.
5. Khi khách xác định sản phẩm và số lượng muốn mua, hãy gọi "addToCart" để thêm vào giỏ nháp. Xác nhận lại giỏ hàng cho khách.
6. Bạn có thể sử dụng "viewCart" để xem lại giỏ hàng nháp hiện tại.
7. Khi khách muốn đặt hàng (nói "đặt hàng", "thanh toán", "chốt đơn"):
   - Nếu khách chưa đăng nhập, hãy kiểm tra xem bạn đã thu thập đủ Tên, Số điện thoại và Địa chỉ nhận hàng chưa. Nếu chưa đủ, hãy hỏi lịch sự để lấy thông tin. Khi đã đủ, gọi "checkoutOrder".
   - Nếu khách đã đăng nhập, hãy xác nhận xem họ muốn giao đến địa chỉ nào (hỏi địa chỉ giao hàng cụ thể nếu họ chưa cung cấp). Sau đó gọi "checkoutOrder".
8. Sau khi đặt hàng thành công thông qua "checkoutOrder", bạn sẽ nhận được Order ID. Hãy thông báo rõ mã đơn hàng này cho khách hàng và chúc mừng họ đã đặt đơn thành công!
9. Nếu khách hàng muốn gặp nhân viên, liên hệ nhân viên trực tiếp hoặc cần hỗ trợ từ con người, bạn hãy lịch sự cung cấp số Hotline: 0399.501.846 và link chat Zalo trực tiếp: https://zalo.me/0399501846 để họ có thể liên hệ ngay.`;

        // Format Chat History to Gemini API Structure
        const contents = [];
        for (const msg of history) {
            if (msg.sender === 'user' && msg.text && String(msg.text).trim()) {
                contents.push({ role: 'user', parts: [{ text: String(msg.text).trim() }] });
            } else if (msg.sender === 'bot' && msg.text && String(msg.text).trim()) {
                contents.push({ role: 'model', parts: [{ text: String(msg.text).trim() }] });
            }
        }

        // Add current query if not already the last user message
        if (query && String(query).trim()) {
            const trimmedQuery = String(query).trim();
            if (contents.length === 0 || contents[contents.length - 1].role !== 'user' || contents[contents.length - 1].parts[0].text !== trimmedQuery) {
                contents.push({ role: 'user', parts: [{ text: trimmedQuery }] });
            }
        }

        // Define Tools / Functions
        const tools = [
            {
                functionDeclarations: [
                    {
                        name: "searchProducts",
                        description: "Tìm kiếm sản phẩm theo từ khóa tên sản phẩm (ví dụ: 'nước mắm', 'mì', 'tẩy rửa') trong kho hàng. Trả về danh sách sản phẩm khớp tên kèm ID, đơn giá và số lượng tồn kho.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                keyword: {
                                    type: "STRING",
                                    description: "Từ khóa tìm kiếm tên sản phẩm"
                                }
                            },
                            required: ["keyword"]
                        }
                    },
                    {
                        name: "addToCart",
                        description: "Thêm một sản phẩm vào giỏ hàng nháp/đơn hàng nháp của khách với số lượng cụ thể.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                productId: {
                                    type: "STRING",
                                    description: "ID sản phẩm (chuỗi MongoDB ObjectId)"
                                },
                                quantity: {
                                    type: "INTEGER",
                                    description: "Số lượng muốn mua"
                                }
                            },
                            required: ["productId", "quantity"]
                        }
                    },
                    {
                        name: "removeFromCart",
                        description: "Xóa sản phẩm khỏi giỏ hàng nháp.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                productId: {
                                    type: "STRING",
                                    description: "ID sản phẩm cần xóa"
                                }
                            },
                            required: ["productId"]
                        }
                    },
                    {
                        name: "viewCart",
                        description: "Hiển thị và kiểm tra toàn bộ sản phẩm đang có trong giỏ hàng nháp hiện tại.",
                        parameters: {
                            type: "OBJECT",
                            properties: {}
                        }
                    },
                    {
                        name: "checkoutOrder",
                        description: "Tạo đơn hàng chính thức từ giỏ hàng nháp hiện tại. Nếu khách chưa đăng nhập (role=guest), bắt buộc phải truyền tên, số điện thoại và địa chỉ nhận hàng.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                customerName: {
                                    type: "STRING",
                                    description: "Họ tên người nhận (Bắt buộc nếu khách chưa đăng nhập)"
                                },
                                customerPhone: {
                                    type: "STRING",
                                    description: "Số điện thoại nhận hàng (Bắt buộc nếu khách chưa đăng nhập)"
                                },
                                customerAddress: {
                                    type: "STRING",
                                    description: "Địa chỉ giao hàng cụ thể (Bắt buộc)"
                                },
                                paymentMethod: {
                                    type: "STRING",
                                    description: "Phương thức thanh toán: 'cash' (tiền mặt khi giao hàng) hoặc 'transfer' (chuyển khoản ngân hàng). Mặc định là 'cash'.",
                                    enum: ["cash", "transfer"]
                                },
                                note: {
                                    type: "STRING",
                                    description: "Ghi chú đơn hàng nếu có"
                                }
                            },
                            required: ["customerAddress"]
                        }
                    }
                ]
            }
        ];

        // Loop to execute tools (Function Calling)
        let loopCount = 0;
        const maxLoops = 5;
        let currentContents = [...contents];

        const makeApiRequest = async (modelName, contentsPayload) => {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;
            const body = {
                contents: contentsPayload,
                systemInstruction: { parts: [{ text: systemPrompt }] },
                tools: tools,
                generationConfig: { maxOutputTokens: 500, temperature: 0.1 }
            };
            const apiRes = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!apiRes.ok) {
                const errorText = await apiRes.text();
                throw new Error(`Gemini API Error: ${apiRes.status} - ${errorText}`);
            }
            return await apiRes.json();
        };

        while (loopCount < maxLoops) {
            let apiData;
            try {
                // Try 1: gemini-3.5-flash (as requested by user "như cũ")
                apiData = await makeApiRequest('gemini-3.5-flash', currentContents);
            } catch (err35) {
                console.warn("gemini-3.5-flash failed, retrying with gemini-3.1-flash-lite...", err35.message);
                try {
                    // Try 2: gemini-3.1-flash-lite (high quota fallback)
                    apiData = await makeApiRequest('gemini-3.1-flash-lite', currentContents);
                } catch (err31) {
                    console.warn("gemini-3.1-flash-lite failed, retrying with gemini-2.5-flash-lite...", err31.message);
                    // Try 3: gemini-2.5-flash-lite (final backup fallback)
                    apiData = await makeApiRequest('gemini-2.5-flash-lite', currentContents);
                }
            }

            const candidate = apiData.candidates?.[0];
            if (!candidate) {
                throw new Error("No candidate returned from Gemini API");
            }

            const modelMessage = candidate.content;
            currentContents.push(modelMessage);

            const parts = modelMessage.parts || [];
            const functionCalls = parts.filter(p => p.functionCall);

            if (functionCalls.length === 0) {
                // Return final text message
                response = parts.map(p => p.text).filter(Boolean).join('\n');
                break;
            }

            // Process function calls
            const functionResponsesParts = [];
            for (const fc of functionCalls) {
                const { name, args } = fc.functionCall;
                let functionResult = {};

                try {
                    if (name === "searchProducts") {
                        const keyword = args.keyword || '';
                        const products = await ProductModel.find({
                            name: { $regex: keyword, $options: 'i' },
                            status: true
                        }).limit(8);

                        functionResult = {
                            products: products.map(p => ({
                                id: p._id.toString(),
                                name: p.name,
                                selling_price: p.selling_price,
                                stock_quantity: p.stock_quantity
                            }))
                        };
                    } else if (name === "addToCart") {
                        const productId = args.productId;
                        const quantity = parseInt(args.quantity) || 1;

                        const product = await ProductModel.findById(productId);
                        if (!product) {
                            functionResult = { success: false, message: "Sản phẩm không tồn tại trong hệ thống." };
                        } else if (product.stock_quantity < quantity) {
                            functionResult = { success: false, message: `Sản phẩm "${product.name}" chỉ còn tồn kho ${product.stock_quantity} sp, không đủ số lượng ${quantity} yêu cầu.` };
                        } else {
                            const existingItem = draftCart.find(item => item.productId === productId);
                            if (existingItem) {
                                existingItem.quantity += quantity;
                            } else {
                                draftCart.push({
                                    productId: product._id.toString(),
                                    name: product.name,
                                    selling_price: product.selling_price,
                                    quantity: quantity
                                });
                            }
                            functionResult = { 
                                success: true, 
                                message: `Đã thêm thành công ${quantity} x ${product.name} vào giỏ hàng nháp.`,
                                cart: draftCart
                            };
                        }
                    } else if (name === "removeFromCart") {
                        const productId = args.productId;
                        const idx = draftCart.findIndex(item => item.productId === productId);
                        if (idx > -1) {
                            const name = draftCart[idx].name;
                            draftCart.splice(idx, 1);
                            functionResult = { success: true, message: `Đã xóa sản phẩm "${name}" khỏi giỏ nháp.`, cart: draftCart };
                        } else {
                            functionResult = { success: false, message: "Sản phẩm không có trong giỏ hàng." };
                        }
                    } else if (name === "viewCart") {
                        functionResult = { cart: draftCart };
                    } else if (name === "checkoutOrder") {
                        if (draftCart.length === 0) {
                            functionResult = { success: false, message: "Giỏ hàng nháp đang trống. Hãy thêm sản phẩm trước." };
                        } else {
                            let customerId = null;
                            let customerAddress = args.customerAddress || '';

                            if (req.user && req.user.role === 'customer') {
                                customerId = req.user.id;
                                if (!customerAddress) {
                                    const CustomerModel = mongoose.model('Customer');
                                    const profile = await CustomerModel.findById(customerId);
                                    customerAddress = profile?.address || '';
                                }
                            } else {
                                const customerName = args.customerName;
                                const customerPhone = args.customerPhone;

                                if (!customerName || !customerPhone || !customerAddress) {
                                    functionResult = { 
                                        success: false, 
                                        message: "Thiếu thông tin đặt hàng của khách hàng (Họ tên, SĐT hoặc Địa chỉ giao hàng)." 
                                    };
                                } else {
                                    const customerObj = await Customer.findOrCreate({
                                        name: customerName,
                                        phone: customerPhone,
                                        address: customerAddress
                                    });
                                    customerId = customerObj.id;
                                }
                            }

                            if (customerId && customerAddress) {
                                const orderItems = draftCart.map(item => ({
                                    id: item.productId,
                                    quantity: item.quantity,
                                    selling_price: item.selling_price
                                }));

                                const total_amount = draftCart.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0);
                                const final_amount = total_amount;
                                
                                const orderData = {
                                    customer_id: customerId,
                                    user_id: null,
                                    total_amount,
                                    discount: 0,
                                    final_amount,
                                    paid_amount: 0,
                                    change_amount: 0,
                                    payment_method: args.paymentMethod || 'cash',
                                    status: 'pending', // Online order defaults to pending delivery
                                    note: args.note || 'Đặt hàng trực tiếp qua AI Chatbot'
                                };

                                const orderId = await Sale.create(orderData, orderItems);
                                
                                // Successful checkout, clear cart
                                draftCart = [];
                                
                                functionResult = { 
                                    success: true, 
                                    message: `Đặt hàng thành công! Mã đơn hàng: ${orderId}.`,
                                    orderId: orderId
                                };
                            } else {
                                functionResult = { success: false, message: "Không thể tạo tài khoản khách hàng hoặc thiếu địa chỉ giao hàng." };
                            }
                        }
                    }
                } catch (err) {
                    console.error(`Tool ${name} execution error:`, err);
                    functionResult = { success: false, error: err.message };
                }

                functionResponsesParts.push({
                    functionResponse: {
                        name: name,
                        response: functionResult
                    }
                });
            }

            currentContents.push({
                role: "function",
                parts: functionResponsesParts
            });

            loopCount++;
        }

        res.json({ response, draftCart });
    } catch (error) {
        console.error('AI Query error:', error);
        res.status(500).json({ error: error.message });
    }
};
