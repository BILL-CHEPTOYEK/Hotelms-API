// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users/search
router.get('/searchUser', userController.searchUsers);

module.exports = router;
