const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotel.controller");

// Room routes
router.post("/rooms", hotelController.createRoom);
router.get("/rooms", hotelController.getAllRooms);
router.get("/rooms/:id", hotelController.getRoomById);
router.put("/rooms/:id", hotelController.updateRoom);
router.delete("/rooms/:id", hotelController.deleteRoom);


router.get("/availability", hotelController.checkRoomAvailability);
// User routes
router.get("/users", hotelController.getAllUsers);
router.post("/users", hotelController.addUser);
router.get("/users/:id", hotelController.getUserById);
router.put("/users/:id", hotelController.updateUser);
router.delete("/users/:id", hotelController.deleteUser);

// Notification routes
router.post("/notifications", hotelController.create);
router.get("/notifications", hotelController.findAllNotifications);
router.put("/notifications/:notification_id", hotelController.updateNotification);
router.delete("/notifications/:notification_id", hotelController.deleteNotification);

// Reservation routes
router.post("/reservations", hotelController.createReservation);
router.get("/reservations", hotelController.getAllReservations);
router.get("/reservations/:id", hotelController.getReservationById);
router.put("/reservations/:id", hotelController.updateReservation);
router.delete("/reservations/:id", hotelController.deleteReservation);


// Analytics routes
router.get("/analytics", hotelController.getAnalytics);

module.exports = router;


//http://localhost:5000/api/hotelms/