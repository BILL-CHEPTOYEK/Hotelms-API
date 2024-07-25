const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotel.controller");

// Room routes
router.get("/fetchRooms", hotelController.getAllRooms);
// Route to get a room by ID
router.get('/getRoom/:room_id', hotelController.getRoomById);
//Add Room
router.post('/add', hotelController.addRoom);
//Edit room
router.put('/updateRoom/:room_id', hotelController.updateRoom);
router.delete('/deleteRoom/:room_id', hotelController.deleteRoom);
router.post("/rooms", hotelController.createRoom);
router.get("/rooms", hotelController.getAllRooms);
router.get("/rooms/:id", hotelController.getRoomById);
router.put("/rooms/:id", hotelController.updateRoom);
router.delete("/rooms/:id", hotelController.deleteRoom);


router.get("/availability", hotelController.checkRoomAvailability);
// User routes
router.get("/users", hotelController.getAllUsers);
router.post("/addUser", hotelController.addUser);
router.get("/users/:id", hotelController.getUserById);
router.put("/users/:id", hotelController.updateUser);
router.delete("/deleteUsers/:id", hotelController.deleteUser);

// Notification routes
router.post("/notifications", hotelController.create);
router.get("/notifications", hotelController.findAllNotifications);
router.put("/notifications/:notification_id", hotelController.updateNotification);
router.delete("/notifications/:notification_id", hotelController.deleteNotification);

// Reservation routes
router.post("/creareReservations", hotelController.createReservation);
router.get("/getReservations", hotelController.getAllReservations);
router.get("/getReservations/:id", hotelController.getReservationById);
router.put("/updateReservations/:id", hotelController.updateReservation);
router.delete("/deleteReservations/:id", hotelController.deleteReservation);
router.get("/checkAvailability", hotelController.checkRoomAvailability);

// Register Admin Route
router.post('/register', hotelController.registerAdmin);

// Login Admin Route
router.post('/login', hotelController.loginAdmin);
// Analytics routes
router.get("/analytics", hotelController.getAnalytics);

module.exports = router;


//http://localhost:5000/api/hotelms/