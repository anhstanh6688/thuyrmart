const mongoose = require('mongoose');
const InventoryLog = require('../models/InventoryLog');

exports.returnSaleItems = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const saleId = req.params.id;
        const { items } = req.body; // Array of { product_id, quantity, reason }

        if (!mongoose.Types.ObjectId.isValid(saleId)) {
            return res.status(400).json({ error: 'Mã đơn hàng không hợp lệ' });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Vui lòng chọn ít nhất một sản phẩm để trả' });
        }

        const SaleModel = mongoose.model('SaleOrder');
        const ProductModel = mongoose.model('Product');
        const CustomerModel = mongoose.model('Customer');

        const sale = await SaleModel.findById(saleId).session(session);
        if (!sale) {
            throw new Error('Không tìm thấy đơn hàng');
        }

        if (sale.status === 'cancelled' || sale.status === 'expired') {
            throw new Error('Đơn hàng đã bị hủy hoặc hết hạn, không thể thực hiện đổi trả');
        }

        let totalRefundThisTime = 0;

        for (const returnReq of items) {
            const { product_id, quantity, reason } = returnReq;
            const qtyToReturn = parseInt(quantity, 10);

            if (!product_id || isNaN(qtyToReturn) || qtyToReturn <= 0) {
                throw new Error('Số lượng sản phẩm đổi trả không hợp lệ');
            }

            // Find original purchased item in sale order
            const originalItem = sale.items.find(i => i.product_id && i.product_id.toString() === product_id.toString());
            if (!originalItem) {
                throw new Error(`Sản phẩm (ID: ${product_id}) không có trong đơn hàng này`);
            }

            // Calculate already returned quantity for this product
            const alreadyReturnedQty = (sale.returned_items || [])
                .filter(r => r.product_id && r.product_id.toString() === product_id.toString())
                .reduce((sum, r) => sum + r.quantity, 0);

            const maxCanReturn = originalItem.quantity - alreadyReturnedQty;
            if (qtyToReturn > maxCanReturn) {
                throw new Error(`Số lượng trả (${qtyToReturn}) vượt quá số lượng còn lại có thể trả (${maxCanReturn})`);
            }

            const returnUnitPrice = originalItem.unit_price;
            const refundValue = qtyToReturn * returnUnitPrice;
            totalRefundThisTime += refundValue;

            // 1. Add return record to sale
            sale.returned_items.push({
                product_id,
                quantity: qtyToReturn,
                return_price: returnUnitPrice,
                reason: reason || 'Khách đổi trả hàng',
                returned_at: new Date()
            });

            // 2. Increase stock in product
            const product = await ProductModel.findById(product_id).session(session);
            if (product) {
                product.stock_quantity += qtyToReturn;
                await product.save({ session });
            }

            // 3. Log to InventoryLog
            const log = new InventoryLog({
                product_id,
                type: 'in',
                quantity: qtyToReturn,
                reference_id: sale._id,
                note: `Khách trả hàng - Đơn #${sale._id} (${reason || 'Trả hàng'})`
            });
            await log.save({ session });
        }

        // Update refund amount
        sale.refunded_amount = (sale.refunded_amount || 0) + totalRefundThisTime;

        // Calculate if all items are fully returned
        let allItemsReturned = true;
        for (const item of sale.items) {
            const returnedCount = sale.returned_items
                .filter(r => r.product_id && r.product_id.toString() === item.product_id.toString())
                .reduce((sum, r) => sum + r.quantity, 0);
            if (returnedCount < item.quantity) {
                allItemsReturned = false;
                break;
            }
        }

        sale.status = allItemsReturned ? 'returned' : 'partially_returned';

        // 4. Update Customer debt if applicable (if credit purchase or debt was added)
        if (sale.customer_id && sale.payment_method === 'credit') {
            await CustomerModel.findByIdAndUpdate(
                sale.customer_id,
                { $inc: { debt: -totalRefundThisTime } },
                { session }
            );
        }

        await sale.save({ session });
        await session.commitTransaction();

        res.json({
            success: true,
            message: 'Đổi/trả hàng và cập nhật tồn kho thành công!',
            refunded_amount: totalRefundThisTime,
            status: sale.status
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Return items error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        session.endSession();
    }
};
