const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');

// Routes
router.get('/rooms', hotelController.getAllRooms);

  //http://localhost:5000/api/hotelms//createNotification
 // Create a new Notification
 router.post("/createNotification", hotelController.create);

 // Retrieve all Notifications
 router.get("/getAllNotification", hotelController.findAll);

 // Update a Notification with id
 router.put("/updateNotification/:notification_id", hotelController.update);

 // Delete a Notification with id
 router.delete("/deleteNotification/:notification_id", hotelController.delete);

// anaylytical stats
router.get('/analytics', hotelController.getAllAnalytics);

module.exports = router;
