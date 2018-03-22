var NUMVERIFY = require('phone-number-validation');
var numverify = new NUMVERIFY({
    access_key: process.env.NUM_VERIFY_ACCESS_KEY
});

module.exports = numverify;