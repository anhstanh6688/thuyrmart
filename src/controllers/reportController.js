const mongoose = require('mongoose');
const SaleModel = mongoose.model('SaleOrder');
const ProductModel = mongoose.model('Product');
const CustomerModel = mongoose.model('Customer');

exports.getDashboardStats = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // 1. Today's Revenue and Orders
        const todayStats = await SaleModel.aggregate([
            { $match: { 
                createdAt: { $gte: startOfDay, $lte: endOfDay },
                status: { $ne: 'cancelled' }
            } },
            { $group: { 
                _id: null, 
                revenue: { $sum: "$final_amount" }, 
                orders: { $sum: 1 } 
            } }
        ]);

        // 2. Low Stock Count
        const lowStockCount = await ProductModel.countDocuments({
            $expr: { $lte: ["$stock_quantity", "$min_stock"] }
        });

        // 3. New Customers Count (from today)
        const newCustomersCount = await CustomerModel.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // 4. Recent Orders
        const recentOrders = await SaleModel.find()
            .populate('customer_id', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // 5. Best Sellers (for the report page)
        const bestSellers = await SaleModel.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: "$items" },
            { $group: { 
                _id: "$items.product_id", 
                totalQty: { $sum: "$items.quantity" } 
            } },
            { $sort: { totalQty: -1 } },
            { $limit: 5 },
            { $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productInfo"
            } },
            { $unwind: "$productInfo" }
        ]);

        // 6. High Stock Products
        const highStock = await ProductModel.find()
            .sort({ stock_quantity: -1 })
            .limit(5);

        // 6b. All Products (for Excel Export)
        const allProducts = await ProductModel.find({}, 'name stock_quantity cost_price selling_price');


        // 7. Last 7 Days or Custom Range Revenue & Profit for Chart
        let startDate = new Date();
        let dateFormat = "%Y-%m-%d";
        
        const range = req.query.range || '7days';
        if (range === '7days') {
            startDate.setDate(startDate.getDate() - 6);
        } else if (range === 'day') { // Theo ngày (Tháng này)
            startDate.setDate(1); // Đầu tháng
        } else if (range === 'month') { // Theo tháng (Năm này)
            startDate.setMonth(0); // Đầu năm
            startDate.setDate(1);
            dateFormat = "%Y-%m"; // Định dạng nhóm theo tháng
        }
        startDate.setHours(0,0,0,0);

        const dailyStats = await SaleModel.aggregate([
            { $match: { 
                createdAt: { $gte: startDate },
                status: { $ne: 'cancelled' }
            } },
            { $unwind: "$items" },
            { $lookup: {
                from: "products",
                localField: "items.product_id",
                foreignField: "_id",
                as: "productInfo"
            } },
            { $unwind: "$productInfo" },
            { $project: {
                date: { $dateToString: { format: dateFormat, date: "$createdAt" } },
                revenue: "$items.subtotal",
                profit: { $multiply: [
                    { $subtract: ["$items.unit_price", "$productInfo.cost_price"] },
                    "$items.quantity"
                ]}
            }},
            { $group: {
                _id: "$date",
                revenue: { $sum: "$revenue" },
                profit: { $sum: "$profit" }
            }},
            { $sort: { _id: 1 } }
        ]);

        res.json({
            revenue: todayStats[0]?.revenue || 0,
            orders: todayStats[0]?.orders || 0,
            lowStock: lowStockCount,
            today_revenue: todayStats[0]?.revenue || 0,
            today_orders: todayStats[0]?.orders || 0,
            low_stock_count: lowStockCount,
            new_customers_count: newCustomersCount,
            recentOrders: recentOrders.map(o => ({
                id: o._id,
                customer_name: o.customer_id?.name || 'Khách lẻ',
                final_amount: o.final_amount,
                createdAt: o.createdAt
            })),
            bestSellers: bestSellers.map(b => ({
                name: b.productInfo.name,
                totalQty: b.totalQty
            })),
            highStock: highStock.map(h => h.toObject()),
            allProducts,
            dailyStats
        });


    } catch (error) {
        console.error('Report error:', error);
        res.status(500).json({ error: error.message });
    }
};
