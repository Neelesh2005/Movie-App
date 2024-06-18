const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');
var bodyParser=require("body-parser"); 
// Load environment variables from .env file
const app = express();
app.set('view engine', 'ejs');
app.set('views' , path.join( __dirname + '/views'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));


dotenv.config();


app.use(express.json());
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
mongoose.connect('mongodb://localhost:27017/MovieApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    })

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
