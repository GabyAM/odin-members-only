const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    username: String,
    password: String,
    is_member: Boolean,
    is_admin: Boolean
});

userSchema.virtual('full_name').get(function () {
    return this.first_name + ' ' + this.last_name;
});

const User = mongoose.model('User', userSchema);
module.exports = User;
