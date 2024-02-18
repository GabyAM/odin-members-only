const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: String,
    text: String,
    created_at: Date
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
