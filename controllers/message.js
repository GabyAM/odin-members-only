const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Message = require('../models/message');

exports.index = asyncHandler(async (req, res, next) => {
    const messages = await Message.find({})
        .populate('user')
        .sort({ createdAt: -1 })
        .exec();

    res.render('index', {
        messages
    });
});

exports.indexMessageSendPost = asyncHandler(async (req, res, next) => {
    await body('message', 'The message cannot be empty')
        .notEmpty()
        .escape()
        .run(req);
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const messages = await Message.find({})
            .populate('user')
            .sort({ createdAt: -1 })
            .exec();
        res.render('index', {
            messages,
            message_error: (error && error.msg) || ''
        });
    }
    const message = new Message({
        user: req.user._id,
        title: req.body.title,
        text: req.body.message
    });
    await message.save();
    res.redirect('/');
});

exports.indexMessageDeletePost = asyncHandler(async (req, res, next) => {
    const id = req.body.action;
    await Message.findByIdAndDelete(id);
    res.redirect('/');
});
