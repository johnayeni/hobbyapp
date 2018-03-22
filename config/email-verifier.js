const EmailVerifier = require("email-verifier");

const email_verifier = new Verifier("your_whoisapi_username", "your_whoisapi_password");

module.exports = email_verifier;