var accountSid = process.env.TWILLO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILLO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

module.exports = client;