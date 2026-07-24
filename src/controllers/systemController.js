const mongoose = require('mongoose');

exports.resetTestData = async (req, res) => {
    const { mode } = req.body; // 'transactions' hoặc 'full'
    try {
        if (mode === 'transactions') {
            // Xóa lịch sử giao dịch, giữ sản phẩm, danh mục, NCC
            const Sale = mongoose.model('Sale');
            const PurchaseOrder = mongoose.model('PurchaseOrder');
            const InventoryLog = mongoose.model('InventoryLog');
            const SupplierPayment = mongoose.model('SupplierPayment');
            const Supplier = mongoose.model('Supplier');
            
            await Sale.deleteMany({});
            await PurchaseOrder.deleteMany({});
            await InventoryLog.deleteMany({});
            await SupplierPayment.deleteMany({});
            
            // Reset nợ NCC về 0
            await Supplier.updateMany({}, { $set: { debt: 0 } });
            
            // Reset tồn kho sản phẩm về 0
            const Product = mongoose.model('Product');
            await Product.updateMany({}, { $set: { stock_quantity: 0 } });
            
            res.json({ success: true, message: 'Đã xóa lịch sử giao dịch. Sản phẩm và danh mục được giữ nguyên.' });
        } else if (mode === 'full') {
            // Xóa toàn bộ dữ liệu
            const collections = ['sales', 'purchaseorders', 'inventorylogs', 'supplierpayments', 'suppliers', 'customers', 'categories', 'products'];
            for (const col of collections) {
                await mongoose.connection.db.collection(col).deleteMany({});
            }
            res.json({ success: true, message: 'Đã xóa toàn bộ dữ liệu hệ thống.' });
        } else {
            res.status(400).json({ error: 'mode phải là transactions hoặc full' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.exportBackup = async (req, res) => {
    try {
        const collectionsToBackup = [
            'categories',
            'products',
            'customers',
            'suppliers',
            'sales',
            'purchaseorders',
            'inventorylogs',
            'supplierpayments',
            'users'
        ];

        const db = mongoose.connection.db;
        const backupData = {
            appName: 'ThuyR Mart',
            version: '1.0',
            exportedAt: new Date().toISOString(),
            data: {}
        };

        for (const colName of collectionsToBackup) {
            try {
                const docs = await db.collection(colName).find({}).toArray();
                backupData.data[colName] = docs;
            } catch (err) {
                console.warn(`Backup warning for ${colName}:`, err.message);
                backupData.data[colName] = [];
            }
        }

        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `ThuyRMart_Backup_${dateStr}.json`;

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.status(200).send(JSON.stringify(backupData, null, 2));
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.importBackup = async (req, res) => {
    try {
        const { backupData } = req.body;

        if (!backupData || !backupData.data || typeof backupData.data !== 'object') {
            return res.status(400).json({ error: 'File sao lưu không hợp lệ hoặc thiếu dữ liệu!' });
        }

        const db = mongoose.connection.db;
        const collectionsToRestore = [
            'categories',
            'products',
            'customers',
            'suppliers',
            'sales',
            'purchaseorders',
            'inventorylogs',
            'supplierpayments',
            'users'
        ];

        let restoredCount = 0;

        for (const colName of collectionsToRestore) {
            const docs = backupData.data[colName];
            if (Array.isArray(docs)) {
                await db.collection(colName).deleteMany({});
                if (docs.length > 0) {
                    // Convert date strings back to Date objects if needed or insert directly
                    const mappedDocs = docs.map(doc => {
                        if (doc._id && typeof doc._id === 'string' && doc._id.length === 24) {
                            doc._id = new mongoose.Types.ObjectId(doc._id);
                        }
                        return doc;
                    });
                    await db.collection(colName).insertMany(mappedDocs);
                }
                restoredCount += docs.length;
            }
        }

        res.json({
            success: true,
            message: `Khôi phục dữ liệu thành công! Đã phục hồi ${restoredCount} bản ghi.`,
            restoredRecords: restoredCount
        });
    } catch (error) {
        console.error('Restore error:', error);
        res.status(500).json({ error: error.message });
    }
};

