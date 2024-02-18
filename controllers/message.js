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
