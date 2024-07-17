// routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// GET /api/rooms/search
router.get('/searchRoom', roomController.searchRooms);

module.exports = router;
