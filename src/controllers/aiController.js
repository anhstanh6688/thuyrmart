const mongoose = require('mongoose');

exports.queryAI = async (req, res) => {
    try {
        const { query } = req.body;
        const q = query.toLowerCase();
        let response = "";

        const SaleModel = mongoose.model('SaleOrder');
        const ProductModel = mongoose.model('Product');

        const isAdminOrStaff = req.user && (req.user.role === 'admin' || req.user.role === 'staff');

        if (q.includes('doanh thu')) {
            if (!isAdminOrStaff) {
                return res.json({ response: "Xin lỗi, thông tin doanh thu và tài chính chi tiết là bảo mật nội bộ của ThuyR Mart. Em không thể cung cấp cho quý khách được ạ! Quý khách có thể hỏi em các thông tin khác về mua sắm nhé! 😊" });
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
        } else if (q.includes('sắp hết') || q.includes('tồn kho')) {
            if (!isAdminOrStaff) {
                return res.json({ response: "Xin lỗi, thông tin chi tiết về số lượng tồn kho nội bộ là bảo mật của cửa hàng. Quý khách có thể xem tình trạng còn hàng trực tiếp trên trang chi tiết của mỗi sản phẩm nhé! 😊" });
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
        } else {
            // Check if GEMINI_API_KEY is configured for real AI call
            const geminiApiKey = process.env.GEMINI_API_KEY;
            if (geminiApiKey) {
                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
                    const systemPrompt = "Bạn là Trợ lý ảo AI thông minh và lễ phép của hệ thống bán lẻ ThuyR Mart. Hãy trò chuyện cực kỳ thân thiện, ngắn gọn và hữu ích bằng tiếng Việt. Nếu người dùng hỏi các số liệu như doanh thu, hàng tồn kho sắp hết, hay sản phẩm bán chạy, hãy nhắc họ bấm vào các nút tiện ích nhanh trên màn hình chat để hệ thống trích xuất số liệu DB thời gian thực chính xác nhất.";

                    const body = {
                        contents: [{ parts: [{ text: query }] }],
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
                    };

                    const apiRes = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    const apiData = await apiRes.json();
                    
                    if (apiData.candidates && apiData.candidates[0]?.content?.parts[0]?.text) {
                        response = apiData.candidates[0].content.parts[0].text;
                    } else {
                        response = "Tôi là trợ lý ảo ThuyR Mart. Tôi có thể giúp bạn kiểm tra doanh thu, tồn kho và hàng bán chạy. Hãy thử hỏi hoặc bấm các nút tiện ích nhé!";
                    }
                } catch (apiError) {
                    console.error('Failed to call Gemini API:', apiError);
                    response = "Tôi là trợ lý ảo ThuyR Mart. Tôi có thể giúp bạn kiểm tra doanh thu, tồn kho và hàng bán chạy. Hãy thử hỏi hoặc bấm các nút tiện ích nhé!";
                }
            } else {
                response = "Tôi là trợ lý ảo ThuyR Mart. Tôi có thể giúp bạn kiểm tra doanh thu, tồn kho và hàng bán chạy. Hãy cấu hình GEMINI_API_KEY trong tệp .env để trò chuyện AI thông minh tự do nhé!";
            }
        }

        res.json({ response });
    } catch (error) {
        console.error('AI Query error:', error);
        res.status(500).json({ error: error.message });
    }
};
