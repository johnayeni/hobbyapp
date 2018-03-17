var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HobbySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    favourite: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hobby', HobbySchema);