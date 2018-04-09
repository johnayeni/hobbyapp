const mongoose = require('mongoose');
const passport = require('passport');
const config = require('../config/database');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/user");
const Hobby = require("../models/hobby");
const numverify = require("../config/numverify");
const client = require("../config/twilo");
const mailgun = require("../config/mailgun");
require('../config/passport')(passport);

// register a user
router.post('/register', function(req, res) {
    if (!req.body.fullname || !req.body.email || !req.body.password || !req.body.phone_number) {
        res.json({ success: false, msg: 'Fullname, email, phone number and password reqiured !' });
    } else {
        // verify user phone number
        numverify.validate({ number: req.body.phone_number }, function(err, result) {
            if (err) return next(err);
            if (result.valid == true) {
              // check if email is in use
                User.findOne({email: req.body.email} , function(err, user){
                if (err) return next(err);
                  if (user) {
                      return res.json({ success: false, msg: 'Email already exists'});
                  }
                  // check if phone number is already in use
                  User.findOne({phone_number: req.body.phone_number}, function (err, user){
                  if (err) return next(err);
                    if (user) {
                        return res.json({ success: false, msg: 'Phone number already exists'});
                    }
                    let message = 'Welcome to Hobby square app';
                    let number = formatPhoneNumber(req.body.phone_number);
                    // send client sms
                    sendsms(number, message);
                    let title = "Welcome to Hobbysquare app ";
                    let text = "Thank you for opening your account with us";
                    // send client mail
                    sendmail(req.body.email, title, text);
                    let newUser = new User({
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
            if (err) return next(err);

            if (!user) {
                res.json({ success: false, msg: 'Authentication failed. Invalid user.' });
            } else {
                // check if password matches
                user.comparePassword(req.body.password, function(err, isMatch) {
                    if (isMatch && !err) {
                        // if user is found and password is right create a token
                        let token = jwt.sign(user.toObject(), config.secret);
                        // return the information including token as JSON
                        User.findOneAndUpdate({ email: user.email }, { access_token: `JWT ${token}` }, function(err, verifiedUser) {
                            if (err || !verifiedUser) {
                                res.json({ success: false, msg: 'Authentication failed.' });
                            }
                            res.json({ success: true, token: `JWT ${token }` });
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
    let token = getToken(req.headers);
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
        let token = getToken(req.headers);
        if (token) {
            User.findOne({ access_token: token }, function(err, user) {
                if (err) return next(err);

                if (!user) {
                    return res.status(401).send({ success: false, msg: 'Unauthorized User.' });
                }

                Hobby.findOne({ user_id: user._id, name: req.body.name }, function(err, hobby) {
                    if (err) return next(err);
                    if (hobby) {
                        return res.json({ success: false, msg: 'Hobby already exists.' });
                    }
                    let newHobby = new Hobby({
                        name: req.body.name,
                        description: req.body.description,
                        user_id: user._id
                    });

                    newHobby.save(function(err) {
                      if (err) return next(err);
                      let message = `You just added ${req.body.name} to your hobbies`;
                      let number = formatPhoneNumber(user.phone_number);
                      // send client sms
                      sendsms(number, message);
                      let title = "Hobby app notification";
                      let text = `You just added ${req.body.name} to your hobbies`;
                      // send client mail
                      sendmail(user.email, title, text);
                      res.json({ success: true, msg: 'Successful added new hobby.' });
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
        let token = getToken(req.headers);
        if (token) {
            User.findOne({ access_token: token }, function(err, user) {
                if (err) return next(err);
                if (!user) {
                    return res.status(401).send({ success: false, msg: 'Unauthorized User.' });
                }
                Hobby.findOneAndUpdate({  user_id: user._id, name: req.body.name }, { favourite: true }, function(err, hobby) {
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
        let token = getToken(req.headers);
        if (token) {
            User.findOne({ access_token: token }, function(err, user) {
                if (err) return next(err);
                if (!user) {
                    return res.status(401).send({ success: false, msg: 'Unauthorized User.' });
                }
                Hobby.findOneAndUpdate({ user_id: user._id,  name: req.body.name }, { favourite: false }, function(err, hobby) {
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
        let token = getToken(req.headers);
        if (token) {
            User.findOne({ access_token: token }, function(err, user) {
                if (err) return next(err);
                if (!user) {
                    return res.status(401).send({ success: false, msg: 'Unauthorized User.' });
                }
                Hobby.findOneAndRemove({ user_id: user._id, name: req.params.name }, function(err, hobby) {
                    if (err) return next(err);

                    if (!hobby) {
                        res.json({ success: false, msg: `Failed to remove hobby ${req.params.name}` });
                    } else {
                        let message = `You just removed ${req.params.name} from your hobbies`;
                        let number = formatPhoneNumber(user.phone_number);
                        // send client sms
                        sendsms(number, message);
                        let title = "Hobby app notification";
                        let text = `You just removed ${req.params.name} from your hobbies`;
                        // send client mail
                        sendmail(user.email, title, text);
                        res.json({ success: true, msg: 'Successful removed hobby.' });
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
    let token = getToken(req.headers);
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

const getToken = (headers) => {
    if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return headers.authorization;
        } else {
            return null;
        }
    } else {
        true
        return null;
    }
}

const sendmail = async (email, title, text) => {
   try {
    var response = await mailgun.sendText('noreply@hobbysquareapp.com', [`Recipient 1 <${email}>`],
        title,
        text,
        'noreply@hobbysquareapp.com'
    );
   } catch (e){
     console.log(e);
   }
}


const sendsms = async(number, message) => {
    try {
        var response = await client.messages.create({
          body: message,
          to: number,
          from: process.env.TWILLO_PHONE_NUMBER
      });

    } catch (e){
      console.log(e);
     }
}

const formatPhoneNumber = (number) => {
  return `+${number.replace(/\s\D/g, "")}`;
}

module.exports = router;