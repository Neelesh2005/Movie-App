const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const jwt = require('jsonwebtoken');

// Admin login
router.post('/login', async (req, res) => {
 try {
    const { username, password } = req.body;
    if (username !== 'admin' || password !== '123456') {
      return res.status(400).send({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ _id: 'admin' }, process.env.JWT_SECRET);
    res.send({ token });
 } catch (e) {
    res.status(500).send();
 }
});

// Protected routes
router.use(auth, admin);

// Add movie
router.post('/add', async (req, res) => {
 try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).send(movie);
 } catch (e) {
    res.status(500).send();
 }
});

// Remove movie
router.delete('/remove/:id', async (req, res) => {
 try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send({ error: 'Movie not found.' });
    }
    if (movie.seatsAvailable < movie.totalSeats) {
      return res.status(400).send({ error: 'Cannot remove movie with occupied seats.' });
    }
    await movie.remove();
    res.send({ message: 'Movie removed successfully.' });
 } catch (e) {
    res.status(500).send();
 }
});

module.exports = router;
