const express = require('express');

const posts = require('./posts');
const auth = require('./auth');
const { middlewares } = require("../middlewares");
const router = express.Router();

router.use('/',[middlewares.auth, middlewares.isAdmin], auth);
router.use('/',[middlewares.auth, middlewares.isAdmin], posts);
router.use('/',[middlewares.auth, middlewares.isUser], posts);

module.exports = router;
