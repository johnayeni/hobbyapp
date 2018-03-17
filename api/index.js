var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Hobby = require("../models/hobby");

router.post('/signup', function(req, res) {
    if (!req.body.fullname || !req.body.email || !req.body.password || !req.body.phone_number) {
        res.json({ success: false, msg: 'Fullname, email, phone number and password reqiured !' });
    } else {
        var newUser = new User({
            fullname: req.body.fullname,
            email: req.body.email,
            phoneNumber: req.body.phone_number,
            password: req.body.password
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({ success: false, msg: 'Error creating user.' });
            }
            res.json({ success: true, msg: 'Successful created new user.' });
        });
    }
});

router.post('/signin', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toObject(), config.secret);
                    // return the information including token as JSON
                    res.json({ success: true, user: user, token: 'JWT ' + token });
                } else {
                    res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    });
});

router.post('/hobby', passport.authenticate('jwt', { session: false }), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var newHobby = new Hobby({
            name: req.body.name,
            description: req.body.description,
        });

        newHobby.save(function(err) {
            if (err) {
                return res.json({ success: false, msg: 'Save Hobby failed.' });
            }
            res.json({ success: true, msg: 'Successful added new hobby.' });
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});

router.get('/hobby', passport.authenticate('jwt', { session: false }), function(req, res) {
    var token = getToken(req.headers);
    if (!req.query.email) {
        res.json({ success: false, msg: 'Email required' });
    }
    if (token) {
        Hobby.find({ email: req.query.email }, function(err, hobbies) {
            if (err) return next(err);
            res.json(hobbies);
        });
    } else {
        return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
});

getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;