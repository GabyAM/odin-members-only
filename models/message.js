const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const messageSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: String,
        text: String
    },
    { timestamps: true }
);

messageSchema.virtual('createdAt_formatted').get(function () {
    return DateTime.fromJSDate(this.createdAt).toLocaleString(
        DateTime.DATETIME_FULL
    );
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
