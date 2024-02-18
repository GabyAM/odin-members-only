const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/signup', (req, res, next) => {
    res.render('sign_up_form');
});

router.post('/signup', userController.createUserPost);

module.exports = router;
