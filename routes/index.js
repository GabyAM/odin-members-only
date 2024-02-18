const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const messageController = require('../controllers/message');

/* GET home page. */
router.get('/', messageController.index);

router.get('/signup', (req, res, next) => {
    res.render('sign_up_form');
});

router.post('/signup', userController.createUserPost);

router.get('/login', userController.loginUserGet);
router.post('/login', userController.loginUserPost);

router.get('/logout', userController.logoutUserGet);
module.exports = router;
