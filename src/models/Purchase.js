const mongoose = require('mongoose');
const Product = require('./Product'); // We'll need Product model for stock updates

const purchaseItemSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    unit_price: { type: Number, required: true },
    subtotal: { type: Number, required: true }
});

const purchaseOrderSchema = new mongoose.Schema({
    supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    total_amount: { type: Number, default: 0 },
    paid_amount: { type: Number, default: 0 },
    balance_amount: { type: Number, default: 0 },
    items: [purchaseItemSchema],
    status: { type: String, enum: ['completed', 'draft', 'cancelled'], default: 'completed' },
    note: { type: String }
}, { timestamps: true });

const PurchaseModel = mongoose.model('PurchaseOrder', purchaseOrderSchema);
const InventoryLog = require('./InventoryLog');


class Purchase {
    static async create(purchaseData, items) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
            const { supplier_id, user_id, total_amount, note } = purchaseData;
            const paid_amount = Number(purchaseData.paid_amount) || 0;
            const balance_amount = Math.max(0, total_amount - paid_amount);

            // 1. Create Purchase Order
            const po = new PurchaseModel({
                supplier_id: isValidId(supplier_id) ? supplier_id : null,
                user_id: isValidId(user_id) ? user_id : null,
                total_amount,
                paid_amount,
                balance_amount,
                items: items.map(item => ({
                    product_id: isValidId(item.product_id) ? item.product_id : null,
                    quantity: item.quantity,
                    unit_price: item.cost_price,
                    subtotal: item.cost_price * item.quantity
                })),
                note
            });
            const savedPO = await po.save({ session });

            // 2. Update Products & Logs
            for (let item of items) {
                if (!isValidId(item.product_id)) continue;

                // Update Product
                const ProductModel = mongoose.model('Product');
                await ProductModel.findByIdAndUpdate(
                    item.product_id,
                    { 
                        $inc: { stock_quantity: item.quantity },
                        $set: { cost_price: item.cost_price }
                    },
                    { session }
                );

                // Add Inventory Log
                const log = new InventoryLog({
                    product_id: item.product_id,
                    type: 'in',
                    quantity: item.quantity,
                    reference_id: savedPO._id,
                    note: `Nhập hàng - Phiếu #${savedPO._id}`
                });
                await log.save({ session });
            }

            // 3. Update Supplier Debt
            if (balance_amount > 0 && supplier_id) {
                const SupplierModel = mongoose.model('Supplier');
                await SupplierModel.findByIdAndUpdate(
                    supplier_id,
                    { $inc: { debt: balance_amount } },
                    { session }
                );
            }

            await session.commitTransaction();
            return savedPO._id.toString();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    static async getAll() {
        const orders = await PurchaseModel.find()
            .populate('supplier_id', 'name')
            .populate('user_id', 'full_name')
            .sort({ createdAt: -1 });
            
        return orders.map(po => ({
            id: po._id.toString(),
            supplier_id: po.supplier_id?._id,
            supplier_name: po.supplier_id?.name,
            user_name: po.user_id?.full_name,
            total_amount: po.total_amount,
            paid_amount: po.paid_amount,
            balance_amount: po.balance_amount,
            status: po.status,
            note: po.note,
            order_date: po.createdAt
        }));
    }

    static async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        const po = await PurchaseModel.findById(id)
            .populate('supplier_id')
            .populate('user_id', 'full_name')
            .populate('items.product_id');
            
        if (!po) return null;
        return {
            id: po._id.toString(),
            supplier_name: po.supplier_id?.name,
            supplier_phone: po.supplier_id?.phone,
            user_name: po.user_id?.full_name || 'Admin',
            total_amount: po.total_amount,
            paid_amount: po.paid_amount,
            balance_amount: po.balance_amount,
            note: po.note,
            order_date: po.createdAt,
            items: po.items.map(item => ({
                product_name: item.product_id?.name || 'Sản phẩm đã xóa',
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.subtotal
            }))
        };
    }
}

module.exports = Purchase;
