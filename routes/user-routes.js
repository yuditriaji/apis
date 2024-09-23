const express = require('express');
const { createUser, userLogin, userAuthState } = require('../controller/userController');

const router = express.Router();

router.post('/register', createUser);
router.post('/login', userLogin);
router.get('/userState', userAuthState);

module.exports = {
    router: router
}