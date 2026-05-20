const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// GET all reviews for a specific movie
// Example: GET /api/v1/reviews?movie_id=123
router.get('/', async (req, res) => {
    const { movie_id } = req.query;

    try {
        if (!movie_id) {
            return res.status(400).json({ message: 'movie_id query parameter is required' });
        }

        const reviews = await Review.find({ movie_id });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new review
// Example: POST /api/v1/reviews
// Body: { movie_id, reviewer, review, rating }
router.post('/', async (req, res) => {
    const { movie_id, reviewer, review, rating } = req.body;

    try {
        if (!movie_id || !reviewer || !review || !rating) {
            return res.status(400).json({ message: 'All fields are required: movie_id, reviewer, review, rating' });
        }

        const newReview = new Review({ movie_id, reviewer, review, rating });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a review by ID
// Example: DELETE /api/v1/reviews/:id
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Review.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;