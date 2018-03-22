var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Hobby = require("../models/hobby");
var numverify = require("../config/numverify");
var client = require("../config/twilo");

// register a user
router.post('/register', function(req, res) {
    if (!req.body.fullname || !req.body.email || !req.body.password || !req.body.phone_number) {
        res.json({ success: false, msg: 'Fullname, email, phone number and password reqiured !' });
    } else {
        // verify user phone number
        numverify.validate({ number: req.body.phone_number }, function(err, result) {
            if (err) {
                return res.json({ success: false, msg: err.message || 'Error creating user.' });
            }
            if (result.valid == true) {
                // send client sms
                client.messages.create({
                        body: 'Welcome to Hobby square app',
                        to: '+' + req.body.phone_number.replace(/\s\D/g, ""),
                        from: '	(203) 693-8207'
                    },
                    function(message) {
                        var newUser = new User({
                            fullname: req.body.fullname,
                            email: req.body.email,
                            phone_number: req.body.phone_number,
                            password: req.body.password
                        });
                        // save the user
                        newUser.save(function(err) {
                            if (err) {
                                return res.json({ success: false, msg: err.message || 'Error creating user.' });
                            }
                            res.json({ success: true, msg: 'Successful created new user.' });
                        });

                    });
            } else {
                res.json({ success: false, msg: 'Invalid Phone Number.' });
            }
        });
    }
});


// login a user
router.post('/login', function(req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({ name: false, msg: 'email and password reqiured !' });
    } else {
        User.findOne({
            email: req.body.email
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, msg: 'Authentication failed. Invalid user.' });
            } else {
                // check if password matches
                user.comparePassword(req.body.password, function(err, isMatch) {
                    if (isMatch && !err) {
                        // if user is found and password is right create a token
                        var token = jwt.sign(user.toObject(), config.secret);
                        // return the information including token as JSON
                        User.findOneAndUpdate({ email: user.email }, { access_token: `JWT ${token}` }, function(err, verifiedUser) {
                            if (err) {
                                res.json({ success: false, msg: 'Authentication failed.' });
                            }
                            verifiedUser.password = null;
                            verifiedUser.access_token = null;
                            res.json({ success: true, user: verifiedUser, token: 'JWT ' + token });
                        });
                    } else {
                        res.json({ success: false, msg: 'Authentication failed. Wrong email or password.' });
                    }
                });
            }
        });
    }
});


// get user details
router.get('/user', passport.authenticate('jwt', { session: false }), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        User.findOne({ access_token: token }, function(err, user) {
            if (err) return next(err);

            if (!user) {
                return res.status(401).send({ success: false, msg: 'Unauthorized User.' });
            }
            user.password = null;
            user.access_token = null;
            res.json(user);
        });
    }
});

// create new hobby
router.post('/hobby', passport.authenticate('jwt', { session: false }), function(req, res) {
    if (!req.body.name || !req.body.description) {
        res.json({ name: false, msg: 'Hobby name and description reqiured !' });
    } else {
        var token = getToken(req.headers);
        if (token) {
            User.findOne({ access_token: token }, function(err, user) {
                if (err) return next(err);

                if (!user) {
                    return res.status(401).send({ success: false, msg: 'Unauthorized User.' });
                }

                Hobby.findOne({ user_id: user._id, name: req.body.name }, function (err, hobby){
                    if (err) {
                        return res.json({ success: false, msg: err.message || 'Save Hobby failed.' });
                    }
                    if (hobby){
                        return res.json({ success: false, msg: 'Hobby already exists.' });
                    }
                    var newHobby = new Hobby({
                        name: req.body.name,
                        description: req.body.description,
                        user_id: user._id
                    });

                    newHobby.save(function(err) {
                        if (err) {
                            return res.json({ success: false, msg: err.message || 'Save Hobby failed.' });
                        }
                        client.messages.create({
                            body: 'You just added ' + req.body.name + ' to your hobbies',
                            to: '+' + user.phone_number.replace(/\s\D/g, ""),
                            from: '	(203) 693-8207'
                        },
                        function(message) {
                          res.json({ success: true, msg: 'Successful added new hobby.' });
                        });
                    });                    
                });
            });
        } else {
            return res.status(401).send({ success: false, msg: 'Unauthorized.' });
        }

    }
});


// favorite hobby
router.put('/fav-hobby', passport.authenticate('jwt', { session: false }), function(req, res) {
    if (!req.body.name) {
        res.json({ name: false, msg: 'Could like hobby' });
    } else {
        var token = getToken(req.headers);
        if (token) {
            User.findOne({ access_token: token }, function(err, user) {
                if (err) return next(err);
                if (!user) {
                    return res.status(401).send({ success: false, msg: 'Unauthorized User.' });
                }
                Hobby.findOneAndUpdate({ name: req.body.name }, { favourite: true }, function(err, hobby) {
                    if (err) return next(err);

                    if (!hobby) {
                        res.json({ success: false, msg: 'Failed to like hobby ' });
                    } else {
                        res.json({ success: true, msg: 'Hobby liked.' });
                    }
                });
            });
        } else {
            return res.status(401).send({ success: false, msg: 'Unauthorized.' });
        }
    }
});


// unfavorite hobby
router.put('/unfav-hobby', passport.authenticate('jwt', { session: false }), function(req, res) {
    if (!req.body.name) {
        res.json({ name: false, msg: 'Could unlike hobby' });
    } else {
        var token = getToken(req.headers);
        if (token) {
            User.findOne({ access_token: token }, function(err, user) {
                if (err) return next(err);
                if (!user) {
                    return res.status(401).send({ success: false, msg: 'Unauthorized User.' });
                }
                Hobby.findOneAndUpdate({ name: req.body.name }, { favourite: false }, function(err, hobby) {
                    if (err) return next(err);

                    if (!hobby) {
                        res.json({ success: false, msg: 'Failed to unlike hobby ' });
                    } else {
                        res.json({ success: true, msg: 'Hobby unliked.' });
                    }
                });
            });
        } else {
            return res.status(401).send({ success: false, msg: 'Unauthorized.' });
        }
    }
});


// delete hobby
router.delete('/hobby/:name', passport.authenticate('jwt', { session: false }), function(req, res) {
    if (!req.params.name) {
        res.json({ name: false, msg: 'Could not remove hobby' });
    } else {
        var token = getToken(req.headers);
        if (token) {
            User.findOne({ access_token: token }, function(err, user) {
                if (err) return next(err);
                if (!user) {
                    return res.status(401).send({ success: false, msg: 'Unauthorized User.' });
                }
                Hobby.findOneAndRemove({ name: req.params.name }, function(err, hobby) {
                    if (err) return next(err);

                    if (!hobby) {
                        res.json({ success: false, msg: 'Failed to remove hobby ' + req.params.name });
                    } else {
                        client.messages.create({
                            body: 'You just removed ' + req.params.name + ' from your hobbies',
                            to: '+' + user.phone_number.replace(/\s\D/g, ""),
                            from: '	(203) 693-8207'
                        },
                        function(message) {
                          res.json({ success: true, msg: 'Successful removed hobby.' });
                        });

                    }
                });
            });
        } else {
            return res.status(401).send({ success: false, msg: 'Unauthorized.' });
        }
    }
});


// get list of user hobbies
router.get('/hobbies', passport.authenticate('jwt', { session: false }), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        User.findOne({ access_token: token }, function(err, user) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ success: false, msg: 'Unauthorized.' });
            }
            Hobby.find({ user_id: user._id }, function(err, hobbies) {
                if (err) return next(err);
                res.json(hobbies);
            });
        });
    } else {
        return res.status(401).send({ success: false, msg: 'Unauthorized.' });
    }
});

getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return headers.authorization;
        } else {
            return null;
        }
    } else {
        true
        return null;
    }
};

module.exports = router;