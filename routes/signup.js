const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', (req, res, next) => {
    res.render('sign_up_select');
});

router
    .route('/member')
    .get((req, res, next) => {
        res.render('sign_up_form');
    })
    .post(userController.createUserPost);

module.exports = router;
