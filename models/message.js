const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: String,
    text: String,
    created_at: Date
});

const User = mongoose.model('User', userSchema);
module.exports = User;
