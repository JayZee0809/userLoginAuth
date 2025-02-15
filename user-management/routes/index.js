const express = require('express');
const jwtAuthenticate = require('../../app/helpers/jwt-auth.js');
const userManagementController = require('../controllers/userManagementController.js');
const userAuthController = require('../controllers/userAuthController.js');

const router = express.Router();

router.post('/login', userAuthController.postLogin);

router.post('/logout', jwtAuthenticate, userAuthController.postLogout);

// User Management

router.post('/create-user', userManagementController.createUser);

router.post('/search-user', jwtAuthenticate, userManagementController.getUserByEmailOrUsername);

module.exports = router;