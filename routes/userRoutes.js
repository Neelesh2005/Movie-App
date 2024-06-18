const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
var bodyParser=require("body-parser"); 
// Load environment variables from .env file
const app = express();
app.set('view engine', 'ejs');
app.set('views' , path.join( __dirname + '/views'));


// Signup
router.post('/signup', async (req, res) => {
 try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).send({ user });
 } catch (e) {
    res.status(500).send(e);
 }
});

// Login
router.post('/login', async (req, res) => {
 try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ error: 'Invalid username or password.' });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(400).send({ error: 'Invalid username or password.' });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.send({ token });
    });
 } catch (e) {
    res.status(500).send();
 }
});

// Protected routes
router.use(auth);

// Browse movies
// Browse movies
router.get('/movies', auth, async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render('movies', { movies });
    } catch (e) {
        res.status(500).send(e);
    }
});

// User Dashboard
router.get('/dashboard', (req, res) => {
    res.render('userDashboard');
});


// Book movie
router.post('/book', async (req, res) => {
 try {
    const { movieId } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).send({ error: 'Movie not found.' });
    }
    if (movie.seatsAvailable < 1) {
      return res.status(400).send({ error: 'No seats available.' });
    }
    movie.seatsAvailable -= 1;
    await movie.save();
    res.send(movie);
 } catch (e) {
    res.status(500).send();
 }
});

// Cancel booking
router.post('/cancel', async (req, res) => {
 try {
    const { movieId } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).send({ error: 'Movie not found.' });
    }
    movie.seatsAvailable += 1;
    await movie.save();
    res.send(movie);
 } catch (e) {
    res.status(500).send();
 }
});

module.exports = router;
