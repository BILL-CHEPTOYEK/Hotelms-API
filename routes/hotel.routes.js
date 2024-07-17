const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');


// Routes
router.get('/rooms', hotelController.getAllRooms);

module.exports = router;
