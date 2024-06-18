const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
 title: { type: String, required: true },
 seatsAvailable: { type: Number, required: true },
 time: { type: String, required: true },
 image: { type: String, required: true }
});

module.exports = mongoose.model('Movie', MovieSchema);
