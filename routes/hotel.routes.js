const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');

// Routes
router.get('/rooms', hotelController.getAllRooms);

  //http://localhost:5000/api/hotelms/createNotification
 // Create a new Notification
 router.post("/createNotification", hotelController.create);

 // Retrieve all Notifications
 router.get("/getAllNotification", hotelController.findAll);

 // Update a Notification with id
 router.put("/updateNotification/:notification_id", hotelController.update);

 // Delete a Notification with id
 router.delete("/deleteNotification/:notification_id", hotelController.delete);

router.post('/addreservations', hotelController.createReservation); //Done and working
router.get('/reservations', hotelController.getAllReservations);     //Done and working
router.get('/reservations/:id', hotelController.getReservationById); //Done and working
router.put('/reservations/:id', hotelController.updateReservation);   //Done and working
router.delete('/reservations/:id', hotelController.deleteReservation); //Done and working
router.get('/roomsavailability', hotelController.checkRoomAvailability); //Pending

// anaylytical stats
router.get('/analytics', hotelController.getAllAnalytics);

module.exports = router;
