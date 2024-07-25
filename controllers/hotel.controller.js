const db = require("../models");
const { Room, User, Notification, Reservation } = db;
const { Op, fn, col, literal, QueryTypes } = db.Sequelize;
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Room functions
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//get a room
exports.getRoomById = async (req, res) => {
    try {
      const roomId = req.params.room_id; // Access the room_id from the route parameter
      const room = await Room.findByPk(roomId);
  
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      res.json(room);
    } catch (error) {
      console.error('Error fetching room:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
//Add Room
exports.addRoom = async (req, res) => {
    const { number, type, price, status } = req.body;

    try {
        const newRoom = await Room.create({
            number,
            type,
            price,
            status
        });

        res.status(201).json({ message: 'Room added successfully', room: newRoom });
    } catch (error) {
        res.status(500).json({ message: 'Error adding room', error: error.message });
    }
};

//Edit Room
exports.updateRoom = async (req, res) => {
    const roomId = req.params.room_id;
    const { number, type, price, status } = req.body;

    try {
        const room = await Room.findByPk(roomId);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        room.number = number !== undefined ? number : room.number;
        room.type = type !== undefined ? type : room.type;
        room.price = price !== undefined ? price : room.price;
        room.status = status !== undefined ? status : room.status;

        await room.save();

        res.status(200).json({ message: 'Room updated successfully', room });
    } catch (error) {
        res.status(500).json({ message: 'Error updating room', error: error.message });
    }
};
//Delete Room
exports.deleteRoom = async (req, res) => {
    const roomId = req.params.room_id;

    try {
        const room = await Room.findByPk(roomId);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        await room.destroy();

        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting room', error: error.message });
    }
};


// User functions
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const [updated] = await User.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedUser = await User.findByPk(req.params.id);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { user_id: req.params.id }
        });
        if (deleted) {
            // Send a success message
            res.status(200).json({ message: 'User successfully deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Notification functions
exports.create = async (req, res) => {
    if (!req.body.user_id || !req.body.message) {
        return res.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    const notification = {
        user_id: req.body.user_id,
        message: req.body.message,
        read_status: req.body.read_status || 'unread'
    };

    try {
        const data = await Notification.create(notification);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Notification."
        });
    }
};

exports.findAllNotifications = async (req, res) => {
    try {
        const data = await Notification.findAll();
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notifications."
        });
    }
};

exports.updateNotification = async (req, res) => {
    const id = req.params.notification_id;

    try {
        const num = await Notification.update(req.body, {
            where: { notification_id: id }
        });

        if (num == 1) {
            res.send({
                message: "Notification was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Notification with id=${id}. Maybe Notification was not found or req.body is empty!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error updating Notification with id=" + id
        });
    }
};

exports.deleteNotification = async (req, res) => {
    const id = req.params.notification_id;

    try {
        const num = await Notification.destroy({
            where: { notification_id: id }
        });

        if (num == 1) {
            res.send({
                message: "Notification was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Notification with id=${id}. Maybe Notification was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete Notification with id=" + id
        });
    }
};

// Reservation functions
exports.createReservation = async (req, res) => {
    const { user_id, room_id, check_in_date, check_out_date } = req.body;

    try {
        // Validate input
        if (!user_id || !room_id || !check_in_date || !check_out_date) {
            return res.status(400).json({ error: "All fields are required: user_id, room_id, check_in_date, check_out_date" });
        }

        // Check if user exists
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if room exists
        const room = await Room.findByPk(room_id);
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        // Check if room is available for the given dates
        const existingReservations = await Reservation.findAll({
            where: {
                room_id: room_id,
                check_in_date: {
                    [Op.lte]: check_out_date
                },
                check_out_date: {
                    [Op.gte]: check_in_date
                }
            }
        });

        if (existingReservations.length > 0) {
            return res.status(400).json({ error: "Room is not available for the given dates" });
        }

        // Create the reservation
        const reservation = await Reservation.create({
            user_id,
            room_id,
            check_in_date,
            check_out_date
        });

        res.status(201).json(reservation);
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ error: "An error occurred while creating the reservation" });
    }
};

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (reservation) {
            res.status(200).json(reservation);
        } else {
            res.status(404).json({ error: 'Reservation not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateReservation = async (req, res) => {
    try {
        const [updated] = await Reservation.update(req.body, {
            where: { reservation_id: req.params.id }
        });
        if (updated) {
            const updatedReservation = await Reservation.findByPk(req.params.id);
            res.status(200).json(updatedReservation);
        } else {
            res.status(404).json({ error: 'Reservation not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteReservation = async (req, res) => {
    const reservationId = req.params.id;

    // Validate reservation ID
    if (!reservationId || isNaN(reservationId)) {
        return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    try {
        // Find the reservation by primary key
        const reservation = await Reservation.findByPk(reservationId);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Delete the reservation
        await reservation.destroy();

        // Send a 200 OK status with a success message
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        // Log the error for debugging purposes
        console.error(`Error deleting reservation: ${error.message}`);

        // Send a 500 Internal Server Error status if an exception occurred
        res.status(500).json({ message: 'Error deleting reservation', error: error.message });
    }
};

exports.checkRoomAvailability = async (req, res) => {
    const { check_in_date, check_out_date } = req.query;
    try {
        const availableRooms = await db.sequelize.query(`
            SELECT *
            FROM Rooms
            WHERE room_id NOT IN (
                SELECT room_id
                FROM Reservations
                WHERE (check_in_date BETWEEN :check_in_date AND :check_out_date)
                OR (check_out_date BETWEEN :check_in_date AND :check_out_date)
                OR (:check_in_date BETWEEN check_in_date AND check_out_date)
                OR (:check_out_date BETWEEN check_in_date AND check_out_date)
            )
        `, {
            replacements: { check_in_date, check_out_date },
            type: db.sequelize.QueryTypes.SELECT
        });
        res.status(200).json({ available_rooms: availableRooms });
    } catch (error) {
        res.status(400).json({ error: 'Invalid date range' });
    }
};

exports.runAllAnalytics = async () => {
    try {
        const currentDate = new Date();

        // Number of guests
        const number_of_guests = await db.Reservation.count({
            where: {
                check_in_date: { [Op.lte]: currentDate },
                check_out_date: { [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) },
                status: 'confirmed'
            }
        });

        // Total revenue based on room prices
        const totalRevenueResult = await db.Reservation.findAll({
            where: {
                status: 'confirmed'
            },
            include: [{
                model: db.Room,
                attributes: [[fn('SUM', col('Room.price')), 'total_price']]
            }],
            attributes: []
        });

        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].get('total_price') : 0;

        // Number of reservations for the day
        const numberOfReservations = await db.Reservation.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                    [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
                }
            }
        });

        // Find most reserved room type
        const mostReservedRoomType = await db.Reservation.findOne({
            attributes: ['room_id', [fn('COUNT', col('room_id')), 'count']],
            group: ['room_id'],
            order: [[literal('count'), 'DESC']]
        });

        // Get last 5 days occupancy rate
        const occupancyRates = await db.sequelize.query(`
            SELECT
                DATE(check_in_date) AS day,
                COUNT(*) AS occupancy_rate
            FROM Reservations
            WHERE
                check_in_date >= :startDate AND
                check_in_date < :endDate
            GROUP BY day
            ORDER BY day
        `, {
            replacements: {
                startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 5),
                endDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
            },
            type: QueryTypes.SELECT
        });

        // Total booked, available, and cancelled rooms
        const totalRooms = await db.Room.count();
        const totalBookedRooms = await db.Reservation.count({ where: { status: 'confirmed' } });
        const totalCancelledRooms = await db.Reservation.count({ where: { status: 'cancelled' } });
        const totalAvailableRooms = totalRooms - totalBookedRooms;

        // Total reservations with each status
        const totalReservationsByStatus = await db.Reservation.findAll({
            attributes: ['status', [fn('COUNT', col('status')), 'count']],
            group: ['status']
        });

        // Total single and double rooms
        const totalSingleRooms = await db.Room.count({ where: { type: 'Single' } });
        const totalDoubleRooms = await db.Room.count({ where: { type: 'Double' } });

        const analyticsData = {
            number_of_guests,
            total_revenue: totalRevenue || 0,
            number_of_reservations: numberOfReservations || 0,
            most_reserved_room_type: mostReservedRoomType ? mostReservedRoomType.room_id : null,
            occupancy_rates: occupancyRates || [],
            total_rooms: totalRooms,
            total_booked_rooms: totalBookedRooms,
            total_cancelled_rooms: totalCancelledRooms,
            total_available_rooms: totalAvailableRooms,
            total_reservations_by_status: totalReservationsByStatus,
            total_single_rooms: totalSingleRooms,
            total_double_rooms: totalDoubleRooms
        };

        return analyticsData;
    } catch (error) {
        console.error('Error running analytics:', error);
        throw error;
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const analyticsData = await exports.runAllAnalytics();
        res.status(200).json(analyticsData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.registerAdmin = async (req, res) => {
    try {
        const { firstName, lastName, password, confirmPassword } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if user with same first_name and last_name already exists
        const existingUser = await User.findOne({
            where: {
                [Op.and]: [
                    { first_name: firstName },
                    { last_name: lastName }
                ]
            }
        });

        if (existingUser) {
            // Check if the existing user has the same password
            const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
            if (isPasswordMatch) {
                return res.status(400).json({ message: 'Admin with these credentials already exists' });
            }
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin user
        const newUser = await User.create({
            first_name: firstName,
            last_name: lastName,
            password: hashedPassword,
            role: 'admin' // Set role as 'admin'
        });

        res.status(201).json({ message: 'Admin registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.loginAdmin = async (req, res) => {
    try {
        const { first_name, password } = req.body;

        if (!first_name || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find the admin by first_name
        const user = await User.findOne({ where: { first_name, role: 'admin' } });

        if (!user) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};