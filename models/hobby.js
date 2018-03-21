var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HobbySchema = new Schema({
    name: {
        type: String,
        maxlength: [20, 'Title must have no more than 20 characters'],
        unique: [true, 'Cannot register a hobby more than once'],
        required: true
    },
    description: {
        type: String,
        maxlength: [140, 'Description should be no more than 140 characters'],
        required: true
    },
    favourite: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'ID of user is required'],
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hobby', HobbySchema);