const express = require('express');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

const MONGODB_URL = 'mongodb+srv://joconstantine:' + process.env.MONGO_DB_PASSWORD + '@cluster0.d1bhv.mongodb.net/messages?retryWrites=true&w=majority'

// app.use(express.urlencoded()); // x-www-form-urlencoded <form>
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/feed', feedRoutes);

mongoose.connect(MONGODB_URL)
    .then(result => {
        app.listen(8080);
    })
    .catch(err => console.log(err));
