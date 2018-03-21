const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const passport = require('passport');
var cors = require('cors');
const config = require('./config/database');
require('dotenv').config();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

const app = express();

mongoose.connect(config.database);

const api = require('./api');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.options('*', cors());

app.use(passport.initialize());


// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api', api);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(process.env.PORT || 3000);
console.log(`App live ...`);