const mongoose = require('mongoose');
require('./Customer');
require('./Product');


const saleItemSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    unit_price: { type: Number, required: true },
    subtotal: { type: Number, required: true }
});

const saleOrderSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    total_amount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    final_amount: { type: Number, default: 0 },
    paid_amount: { type: Number, default: 0 },
    change_amount: { type: Number, default: 0 },
    payment_method: { type: String, enum: ['cash', 'transfer', 'credit'], default: 'cash' },
    items: [saleItemSchema],
    status: { type: String, enum: ['completed', 'pending', 'delivering', 'cancelled', 'expired'], default: 'completed' },
    note: { type: String }
}, { timestamps: true });

const SaleModel = mongoose.model('SaleOrder', saleOrderSchema);

class Sale {
    static async create(orderData, items) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

            // 1. Create Sales Order
            const sale = new SaleModel({
                customer_id: isValidId(orderData.customer_id) ? orderData.customer_id : null,
                user_id: isValidId(orderData.user_id) ? orderData.user_id : null,
                total_amount: orderData.total_amount || 0,
                discount: orderData.discount || 0,
                final_amount: orderData.final_amount || 0,
                paid_amount: orderData.paid_amount || 0,
                change_amount: orderData.change_amount || 0,
                payment_method: orderData.payment_method || 'cash',
                status: orderData.status || 'completed',
                items: items.map(item => {
                    const price = item.selling_price !== undefined ? item.selling_price : (item.price || 0);
                    return {
                        product_id: isValidId(item.id) ? item.id : null,
                        quantity: item.quantity,
                        unit_price: price,
                        subtotal: price * item.quantity
                    };
                }),
                note: orderData.note
            });

            const savedSale = await sale.save({ session });

            // 2. Update Stock & Logs
            const ProductModel = mongoose.model('Product');
            const InventoryLog = require('./InventoryLog');

            for (const item of items) {
                if (!isValidId(item.id)) continue;

                const product = await ProductModel.findById(item.id).session(session);
                if (!product) throw new Error(`Sản phẩm không tồn tại`);
                if (product.stock_quantity < item.quantity) {
                    throw new Error(`Sản phẩm "${product.name}" không đủ tồn kho (chỉ còn ${product.stock_quantity})`);
                }

                // Update product stock
                product.stock_quantity -= item.quantity;
                await product.save({ session });

                // Add log
                const log = new InventoryLog({
                    product_id: item.id,
                    type: 'out',
                    quantity: -item.quantity,

                    reference_id: savedSale._id,
                    note: `Bán hàng - Hóa đơn #${savedSale._id}`
                });
                await log.save({ session });
            }

            // 3. Update Customer Debt if the order is completed and there is a balance
            const balance = orderData.final_amount - orderData.paid_amount;
            if (orderData.status === 'completed' && balance > 0 && orderData.customer_id) {
                const CustomerModel = mongoose.model('Customer');
                await CustomerModel.findByIdAndUpdate(
                    orderData.customer_id,
                    { $inc: { debt: balance } },
                    { session }
                );
            }

            await session.commitTransaction();
            return savedSale._id.toString();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    static async updateStatus(id, newStatus) {
        if (!mongoose.Types.ObjectId.isValid(id)) return false;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const sale = await SaleModel.findById(id).session(session);
            if (!sale) throw new Error('Sale not found');
            
            if ((sale.status === 'cancelled' || sale.status === 'expired') && newStatus !== sale.status) {
                throw new Error('Đơn hàng đã bị hủy hoặc hết hạn, không thể thay đổi trạng thái');
            }
            
            // If restoring stock from expired or cancelled
            if ((sale.status === 'pending' || sale.status === 'delivering') && (newStatus === 'expired' || newStatus === 'cancelled')) {
                const ProductModel = mongoose.model('Product');
                const InventoryLog = require('./InventoryLog');
                
                for (const item of sale.items) {
                    if (!item.product_id) continue;
                    // Restore product stock
                    await ProductModel.findByIdAndUpdate(
                        item.product_id,
                        { $inc: { stock_quantity: item.quantity } },
                        { session }
                    );

                    // Add log
                    const log = new InventoryLog({
                        product_id: item.product_id,
                        type: 'in',
                        quantity: item.quantity,
                        reference_id: sale._id,
                        note: `Hoàn trả kho - Đơn hàng #${sale._id} (${newStatus})`
                    });
                    await log.save({ session });
                }
                
                // Note: Pending online orders did not increase customer debt on creation,
                // so we do not decrement debt when they expire or are cancelled.
            } else if ((sale.status === 'pending' || sale.status === 'delivering') && newStatus === 'completed') {
                // Customer paid online / completed their order.
                sale.paid_amount = sale.final_amount;
                
                // Any remaining unpaid balance (should be 0 for online) is added to debt.
                const balance = sale.final_amount - sale.paid_amount;
                if (balance > 0 && sale.customer_id) {
                    const CustomerModel = mongoose.model('Customer');
                    await CustomerModel.findByIdAndUpdate(
                        sale.customer_id,
                        { $inc: { debt: balance } },
                        { session }
                    );
                }
            } else if (sale.status === 'completed' && newStatus === 'completed') {
                // Paying off credit balance for completed order (Thu nợ)
                const balance = sale.final_amount - sale.paid_amount;
                if (balance > 0) {
                    sale.paid_amount = sale.final_amount;
                    if (sale.customer_id) {
                        const CustomerModel = mongoose.model('Customer');
                        await CustomerModel.findByIdAndUpdate(
                            sale.customer_id,
                            { $inc: { debt: -balance } },
                            { session }
                        );
                    }
                }
            }

            sale.status = newStatus;
            await sale.save({ session });
            await session.commitTransaction();
            return true;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    static async checkExpired(saleDoc) {
        // Hóa đơn chuyển khoản chưa thanh toán và ở trạng thái pending sẽ hết hạn sau 10 phút
        if (saleDoc.payment_method === 'transfer' && saleDoc.status === 'pending' && saleDoc.paid_amount < saleDoc.final_amount) {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            if (saleDoc.createdAt < tenMinutesAgo) {
                return true;
            }
        }
        return false;
    }

    static async getAll() {
        const sales = await SaleModel.find()
            .populate('customer_id', 'name')
            .populate('user_id', 'full_name')
            .sort({ createdAt: -1 });
            
        // Filter out unpaid bank transfer orders
        const visibleSales = sales.filter(s => !(s.payment_method === 'transfer' && s.paid_amount < s.final_amount));
            
        return visibleSales.map(s => ({
            id: s._id.toString(),
            customer_name: s.customer_id?.name || 'Khách lẻ',
            user_name: s.user_id?.full_name,
            total_amount: s.total_amount,
            final_amount: s.final_amount,
            paid_amount: s.paid_amount,
            payment_method: s.payment_method,
            order_date: s.createdAt,
            status: s.status,
            note: s.note
        }));
    }

    static async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        const sale = await SaleModel.findById(id)
            .populate('customer_id')
            .populate('user_id', 'full_name')
            .populate('items.product_id');
            
        if (!sale) return null;
        
        const isExpired = await Sale.checkExpired(sale);
        if (isExpired) sale.status = 'expired';

        return {
            id: sale._id.toString(),
            customer_name: sale.customer_id?.name || 'Khách lẻ',
            customer_phone: sale.customer_id?.phone,
            user_name: sale.user_id?.full_name,
            total_amount: sale.total_amount,
            discount: sale.discount,
            final_amount: sale.final_amount,
            paid_amount: sale.paid_amount,
            change_amount: sale.change_amount,
            payment_method: sale.payment_method,
            status: sale.status,
            note: sale.note,
            order_date: sale.createdAt,
            items: sale.items.map(item => ({
                product_id: item.product_id?._id?.toString(),
                product_name: item.product_id?.name || 'Sản phẩm đã xóa',
                product_image: item.product_id?.image || null,
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.subtotal
            }))
        };
    }

    static async getByCustomerId(customerId) {
        if (!mongoose.Types.ObjectId.isValid(customerId)) return [];
        const sales = await SaleModel.find({ customer_id: customerId })
            .populate('items.product_id')
            .sort({ createdAt: -1 });
            
        // Check expiration on read
        for (let s of sales) {
            const isExpired = await Sale.checkExpired(s);
            if (isExpired) s.status = 'expired';
        }

        return sales.map(s => ({
            id: s._id.toString(),
            total_amount: s.total_amount,
            discount: s.discount,
            final_amount: s.final_amount,
            paid_amount: s.paid_amount,
            payment_method: s.payment_method,
            order_date: s.createdAt,
            status: s.status,
            note: s.note,
            items: s.items.map(item => ({
                product_id: item.product_id?._id?.toString(),
                product_name: item.product_id?.name || 'Sản phẩm đã xóa',
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.subtotal
            }))
        }));
    }
}

module.exports = Sale;
