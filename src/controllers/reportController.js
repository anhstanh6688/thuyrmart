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

        // 1. Today's Net Revenue and Orders (subtracting refunded_amount)
        const todayStats = await SaleModel.aggregate([
            { $match: { 
                createdAt: { $gte: startOfDay, $lte: endOfDay },
                status: { $nin: ['cancelled', 'expired'] }
            } },
            { $group: { 
                _id: null, 
                revenue: { $sum: { $subtract: ["$final_amount", { $ifNull: ["$refunded_amount", 0] }] } }, 
                orders: { $sum: 1 } 
            } }
        ]);

        // 1b. Total refunded amount across all orders in system
        const refundAgg = await SaleModel.aggregate([
            { $match: { status: { $nin: ['cancelled', 'expired'] } } },
            { $group: { _id: null, totalRefunded: { $sum: { $ifNull: ["$refunded_amount", 0] } } } }
        ]);
        const totalRefundedAmount = refundAgg[0]?.totalRefunded || 0;

        // 2. Low Stock Count
        const lowStockCount = await ProductModel.countDocuments({
            $expr: { $lte: ["$stock_quantity", "$min_stock"] }
        });

        // 3. New Customers Count (from today)
        const newCustomersCount = await CustomerModel.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // 3b. Order status counts (total)
        const ordersCompleted = await SaleModel.countDocuments({ status: 'completed' });
        const ordersPending = await SaleModel.countDocuments({ status: 'pending' });
        const ordersCancelled = await SaleModel.countDocuments({ status: 'cancelled' });

        // 3c. Total Customers Count
        const totalCustomersCount = await CustomerModel.countDocuments();

        // 4. Recent Orders (Full 100 recent transactions for report Excel)
        const recentOrders = await SaleModel.find()
            .populate('customer_id', 'name phone')
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        // 6b. All Products (Include full barcode, sku, category, cost_price, etc. for Excel Export)
        const allProductsRaw = await ProductModel.find()
            .populate('category_id', 'name')
            .lean();

        const allProducts = allProductsRaw.map(p => ({
            ...p,
            id: p._id.toString(),
            category_name: p.category_id?.name || 'Khác'
        }));

        // 5. Best Sellers (Net sold quantity = Sold - Returned)
        const allCompletedSales = await SaleModel.find({ status: { $nin: ['cancelled', 'expired'] } }).lean();
        const bestSellerMap = new Map();

        allCompletedSales.forEach(s => {
            (s.items || []).forEach(it => {
                if (!it.product_id) return;
                const pId = it.product_id.toString();
                const retQty = (s.returned_items || [])
                    .filter(r => r.product_id && r.product_id.toString() === pId)
                    .reduce((sum, r) => sum + r.quantity, 0);
                const netQty = Math.max(0, it.quantity - retQty);
                const netSubtotal = Math.max(0, (it.subtotal || 0) - (retQty * (it.unit_price || 0)));

                const curr = bestSellerMap.get(pId) || { product_id: pId, totalQty: 0, totalAmount: 0 };
                curr.totalQty += netQty;
                curr.totalAmount += netSubtotal;
                bestSellerMap.set(pId, curr);
            });
        });

        const topProductIds = Array.from(bestSellerMap.values())
            .filter(b => b.totalQty > 0)
            .sort((a, b) => b.totalQty - a.totalQty)
            .slice(0, 20);

        const bestSellers = [];
        for (const item of topProductIds) {
            const p = allProducts.find(prod => prod.id === item.product_id);
            if (p) {
                bestSellers.push({
                    name: p.name,
                    sku: p.sku || '',
                    barcode: p.barcode || '',
                    category_name: p.category_name || 'Khác',
                    unit: p.unit || 'Cái',
                    totalQty: item.totalQty,
                    totalAmount: item.totalAmount
                });
            }
        }

        // 6. High Stock Products
        const highStock = await ProductModel.find()
            .sort({ stock_quantity: -1 })
            .limit(5);

        // 6c. All Customers with dynamic debt (subtracted refund amount)
        const allCustomersRaw = await CustomerModel.find().lean();
        const debtStats = await SaleModel.aggregate([
            { $match: { status: { $nin: ['cancelled', 'expired'] } } },
            { $group: {
                _id: "$customer_id",
                totalFinal: { $sum: { $subtract: ["$final_amount", { $ifNull: ["$refunded_amount", 0] }] } },
                totalPaid: { $sum: "$paid_amount" }
            }}
        ]);
        const debtMap = new Map();
        debtStats.forEach(d => {
            if (d._id) {
                debtMap.set(d._id.toString(), Math.max(0, d.totalFinal - d.totalPaid));
            }
        });
        const customerDebts = allCustomersRaw.map(c => ({
            ...c,
            id: c._id.toString(),
            debt: debtMap.has(c._id.toString()) ? debtMap.get(c._id.toString()) : 0
        }));

        // 7. Period Net Revenue & Net Profit for Chart
        let startDate = new Date();
        let dateFormat = "%Y-%m-%d";
        
        const range = req.query.range || '7days';
        if (range === '7days') {
            startDate.setDate(startDate.getDate() - 6);
        } else if (range === 'day') {
            startDate.setDate(1);
        } else if (range === 'month') {
            startDate.setMonth(0);
            startDate.setDate(1);
            dateFormat = "%Y-%m";
        }
        startDate.setHours(0,0,0,0);

        const salesForPeriod = await SaleModel.find({
            createdAt: { $gte: startDate },
            status: { $nin: ['cancelled', 'expired'] }
        }).lean();

        const costMap = new Map(allProductsRaw.map(p => [p._id.toString(), p.cost_price || 0]));
        const statsByDateMap = new Map();

        salesForPeriod.forEach(s => {
            let dateKey = '';
            const d = new Date(s.createdAt);
            if (dateFormat === "%Y-%m") {
                dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            } else {
                dateKey = d.toISOString().split('T')[0];
            }

            const netRevenue = Math.max(0, (s.final_amount || 0) - (s.refunded_amount || 0));

            let totalCost = 0;
            (s.items || []).forEach(it => {
                const pId = it.product_id ? it.product_id.toString() : '';
                const cPrice = costMap.get(pId) || 0;
                const retQty = (s.returned_items || [])
                    .filter(r => r.product_id && r.product_id.toString() === pId)
                    .reduce((sum, r) => sum + r.quantity, 0);
                const netQty = Math.max(0, it.quantity - retQty);
                totalCost += netQty * cPrice;
            });

            const netProfit = Math.max(0, netRevenue - totalCost);

            const existing = statsByDateMap.get(dateKey) || { _id: dateKey, revenue: 0, profit: 0 };
            existing.revenue += netRevenue;
            existing.profit += netProfit;
            statsByDateMap.set(dateKey, existing);
        });

        const dailyStats = Array.from(statsByDateMap.values()).sort((a, b) => a._id.localeCompare(b._id));

        // 8. Category Revenue Breakdown
        const categoryStatsMap = new Map();
        allCompletedSales.forEach(s => {
            (s.items || []).forEach(it => {
                const p = allProducts.find(prod => prod.id === (it.product_id ? it.product_id.toString() : ''));
                const catName = p ? p.category_name : 'Khác';
                const pId = it.product_id ? it.product_id.toString() : '';
                const retQty = (s.returned_items || [])
                    .filter(r => r.product_id && r.product_id.toString() === pId)
                    .reduce((sum, r) => sum + r.quantity, 0);
                const netQty = Math.max(0, it.quantity - retQty);
                const netSubtotal = Math.max(0, (it.subtotal || 0) - (retQty * (it.unit_price || 0)));

                const curr = categoryStatsMap.get(catName) || { _id: catName, totalRevenue: 0, totalQty: 0 };
                curr.totalRevenue += netSubtotal;
                curr.totalQty += netQty;
                categoryStatsMap.set(catName, curr);
            });
        });

        const categoryStats = Array.from(categoryStatsMap.values())
            .filter(c => c.totalRevenue > 0)
            .sort((a, b) => b.totalRevenue - a.totalRevenue);

        // Ensure continuous date timeline for 7days range
        let formattedDailyStats = dailyStats;
        if (range === '7days') {
            formattedDailyStats = [];
            const statsMap = new Map(dailyStats.map(s => [s._id, s]));
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const stat = statsMap.get(dateStr) || { _id: dateStr, revenue: 0, profit: 0 };
                formattedDailyStats.push(stat);
            }
        }

        res.json({
            revenue: todayStats[0]?.revenue || 0,
            orders: todayStats[0]?.orders || 0,
            lowStock: lowStockCount,
            today_revenue: todayStats[0]?.revenue || 0,
            today_orders: todayStats[0]?.orders || 0,
            total_refunded_amount: totalRefundedAmount,
            low_stock_count: lowStockCount,
            new_customers_count: newCustomersCount,
            orders_completed: ordersCompleted,
            orders_pending: ordersPending,
            orders_cancelled: ordersCancelled,
            total_customers_count: totalCustomersCount,
            recentOrders: recentOrders.map(o => ({
                id: o._id.toString(),
                customer_name: o.customer_id?.name || 'Khách lẻ',
                customer_phone: o.customer_id?.phone || '---',
                item_count: o.items ? o.items.length : 0,
                total_amount: o.total_amount || 0,
                discount: o.discount || 0,
                final_amount: o.final_amount || 0,
                refunded_amount: o.refunded_amount || 0,
                paid_amount: o.paid_amount || 0,
                payment_method: o.payment_method || 'cash',
                user_name: o.user_name || 'Thu ngân',
                status: o.status || 'completed',
                createdAt: o.createdAt
            })),
            bestSellers,
            highStock: highStock.map(h => h.toObject()),
            allProducts,
            customerDebts,
            dailyStats: formattedDailyStats,
            categoryStats
        });

    } catch (error) {
        console.error('Report error:', error);
        res.status(500).json({ error: error.message });
    }
};
