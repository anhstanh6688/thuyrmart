const express = require('express');
const router = express.Router({ mergeParams: true }); // Important to access productId from parent router
const Review = require('../models/Review');
const Product = require('../models/Product');

// GET all reviews for a product
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ product_id: req.params.productId }).sort({ created_at: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new review for a product
router.post('/', async (req, res) => {
    try {
        if (!req.body.customer_id) {
            return res.status(401).json({ error: 'Bạn phải đăng nhập để gửi đánh giá.' });
        }
        const productId = req.params.productId;
        const newReview = new Review({
            product_id: productId,
            customer_id: req.body.customer_id,
            customer_name: req.body.customer_name || 'Khách hàng',
            rating: req.body.rating || 5,
            comment: req.body.comment || ''
        });
        
        await newReview.save();

        // Calculate new average rating
        const allReviews = await Review.find({ product_id: productId });
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const avg = totalRating / allReviews.length;

        await Product.update(productId, {
            average_rating: parseFloat(avg.toFixed(1)),
            review_count: allReviews.length
        });

        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT (Update) a review for a product
router.put('/:reviewId', async (req, res) => {
    try {
        if (!req.body.customer_id) {
            return res.status(401).json({ error: 'Bạn phải đăng nhập để sửa đánh giá.' });
        }
        const { reviewId, productId } = req.params;
        const updatedReview = await Review.findOneAndUpdate(
            { _id: reviewId, customer_id: req.body.customer_id }, // Ensure user owns review
            {
                rating: req.body.rating || 5,
                comment: req.body.comment || '',
                created_at: new Date()
            },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ error: 'Không tìm thấy đánh giá.' });
        }

        // Recalculate average rating
        const allReviews = await Review.find({ product_id: productId });
        if (allReviews.length > 0) {
            const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
            const avg = totalRating / allReviews.length;
            await Product.update(productId, {
                average_rating: parseFloat(avg.toFixed(1)),
                review_count: allReviews.length
            });
        } else {
            await Product.update(productId, {
                average_rating: 0,
                review_count: 0
            });
        }

        res.json(updatedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a review for a product
router.delete('/:reviewId', async (req, res) => {
    try {
        const { reviewId, productId } = req.params;
        const customerId = req.headers['customer-id']; // Send via header for DELETE
        
        let deletedReview;
        if (customerId) {
            deletedReview = await Review.findOneAndDelete({ _id: reviewId, customer_id: customerId });
        } else {
             // Admin might not have customer_id but could delete it (omitted for now since only logged in user deletes their own review)
            return res.status(401).json({ error: 'Bạn phải đăng nhập để xóa đánh giá.' });
        }

        if (!deletedReview) {
            return res.status(404).json({ error: 'Không tìm thấy đánh giá.' });
        }

        // Recalculate average rating
        const allReviews = await Review.find({ product_id: productId });
        if (allReviews.length > 0) {
            const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
            const avg = totalRating / allReviews.length;
            await Product.update(productId, {
                average_rating: parseFloat(avg.toFixed(1)),
                review_count: allReviews.length
            });
        } else {
            await Product.update(productId, {
                average_rating: 0,
                review_count: 0
            });
        }

        res.json({ message: 'Xóa đánh giá thành công!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
