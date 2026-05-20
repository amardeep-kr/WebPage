const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    movie_id: {
        type: String,
        required: true,
    },
    reviewer: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;