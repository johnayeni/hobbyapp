const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

const app = express();

const mongodb = process.env.MONGODB_URI;

mongoose.connect(mongodb, { config: { autoIndex: false } })
    .then(() => console.log('connection successful, we\'re ready to fetch your stuff'))
    .catch((err) => console.error(err));

const api = require('./api');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.options('*', cors());

app.use(passport.initialize());


// Serve only the static files from the dist directory
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', api);

app.use((req, res, next) => {
    // let err = new Error('Not Found');
    // err.status = 404;
    // next(err);
    res.redirect('/#/404');
});


const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Application now live at port ${port}...`);
});