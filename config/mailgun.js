var Mailgun = require('mailgun').Mailgun;

var mailgun = new Mailgun(process.env.MAILGUN_API_KEY);

module.exports = mailgun;