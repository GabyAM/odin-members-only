const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('../passportConfig');

exports.createUserGet = (req, res, next) => {
    res.render('sign_up_form', { status: req.member_status });
};

const mapErrors = function (errors) {
    const mappedErrors = {};
    errors.array().forEach((error) => {
        if (!mappedErrors[error.path]) {
            mappedErrors[error.path] = [error.msg];
        } else {
            mappedErrors[error.path].push(error.msg);
        }
    });
    return mappedErrors;
};

exports.createUserPost = [
    body('first-name', 'First name cannot be empty').notEmpty().escape(),
    body('last-name', 'Last name cannot be empty').notEmpty().escape(),
    body('username')
        .notEmpty()
        .withMessage('Username cannot be empty')
        .isLength({ max: 20 })
        .withMessage("Username can't be longer than 20 characters")
        .custom(async (value) => {
            const user = await User.findOne({ username: value });
            if (user) {
                throw new Error(`The username "${value}" is already in use`);
            }
        })
        .escape(),
    body('password', 'Password must contain at least 8 characters')
        .isLength({
            min: 5
        })
        .escape(),
    body('confirm-password')
        .custom((value, { req }) => {
            return value === req.body.password;
        })
        .withMessage('Passwords do not match')
        .escape(),
    body('member-password', 'Member password is incorrect, nice try!')
        .if((value, { req }) => req.body.status === 'member')
        .equals('1234')
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('sign_up_form', {
                status: req.body.status,
                errors: mapErrors(errors)
            });
        } else {
            try {
                bcrypt.hash(
                    req.body.password,
                    10,
                    async (err, hashedPassword) => {
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
                    }
                );
            } catch (e) {
                return next(e);
            }
        }
    })
];

exports.loginUserGet = (req, res, next) => {
    res.render('login');
};

exports.loginUserPost = [
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/'
    })
];

exports.logoutUserGet = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};
