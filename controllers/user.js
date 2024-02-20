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
        .equals(process.env.MEMBER_PASSWORD)
        .escape(),
    body('admin-password', 'Admin password is incorrect, nice try!')
        .if((value, { req }) => req.body.status === 'admin')
        .equals(process.env.ADMIN_PASSWORD)
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
                            is_member:
                                req.body.status === 'member' ||
                                req.body.status === 'admin',
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
    body('username', 'username cannot be empty').notEmpty().escape(),
    body('password', 'password must contain at least 8 characters')
        .isLength({ min: 8 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('login', {
                password: req.body.password,
                errors: mapErrors(errors)
            });
        }
        passport.authenticate('local', function (error, user, info) {
            if (error) {
                return next(error);
            }
            if (info) {
                res.render('login', {
                    errors: info
                });
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
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

exports.upgradeUserGet = (req, res, next) => {
    if (!req.user) {
        res.redirect('/login');
    }
    if (!req.user.is_member) {
        res.render('upgrade');
    } else {
        res.render('upgrade', {
            upgrade_error: 'You already are a member, no need to upgrade!'
        });
    }
};

exports.upgradeUserPost = [
    body('member-password', 'Member password is incorrect, nice try!')
        .equals(process.env.MEMBER_PASSWORD)
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('upgrade', { password_error: errors.array()[0].msg });
        }
        const user = new User({
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            username: req.user.username,
            password: req.user.password,
            is_member: true,
            is_admin: false
        });
        await User.findByIdAndUpdate(user._id, user, {});
        res.redirect('/');
    })
];
