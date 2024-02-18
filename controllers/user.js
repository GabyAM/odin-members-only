const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
exports.createUserPost = [
    asyncHandler(async (req, res, next) => {
        try {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) {
                    throw new Error(err);
                }
                const user = new User({
                    first_name: req.body['first-name'],
                    last_name: req.body['last-name'],
                    username: req.body.username,
                    password: hashedPassword,
                    is_member: req.body.status === 'member',
                    is_admin: req.body.status === 'admin'
                });

                const result = await user.save();
                res.redirect('/');
            });
        } catch (e) {
            return next(e);
        }
    })
];