const express = require('express');

const posts = require('./posts');
const auth = require('./auth');
const { middlewares } = require("../middlewares");
const router = express.Router();
//router.use('/', auth);

//router.use('/posts', posts);
//these are the implementations for using middlewares to check user identity and permssion
router.use('/',[middlewares.auth, middlewares.isAdmin], auth);
router.use('/',[middlewares.auth, middlewares.isAdmin], posts);
router.use('/',[middlewares.auth, middlewares.isUser], posts);

module.exports = router;
