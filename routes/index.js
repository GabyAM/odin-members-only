const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const messageController = require('../controllers/message');

/* GET home page. */
router.get('/', messageController.index);
router.post('/', (req, res, next) => {
    if (req.body.action === 'send') {
        messageController.indexMessageSendPost(req, res, next);
    } else {
        messageController.indexMessageDeletePost(req, res, next);
    }
});

router.get('/login', userController.loginUserGet);
router.post('/login', userController.loginUserPost);

router.get('/logout', userController.logoutUserGet);

router
    .route('/upgrade')
    .get(userController.upgradeUserGet)
    .post(userController.upgradeUserPost);
module.exports = router;
