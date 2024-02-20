const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', (req, res, next) => {
    res.render('sign_up_select', {
        section: req.query.section === 'more' ? 'more' : 'default'
    });
});

router.get('/:member_status', (req, res, next) => {
    const status = req.params.member_status;
    if (status === 'user' || status === 'member' || status === 'admin') {
        req.member_status = status;
        next();
    } else {
        res.status(404).send('Invalid route');
    }
});

router
    .route('/:member_status')
    .get(userController.createUserGet)
    .post(userController.createUserPost);

module.exports = router;
