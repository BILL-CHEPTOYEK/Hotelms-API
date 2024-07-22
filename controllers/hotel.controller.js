const db = require("../models");
const { Room, User, Notification, Reservation } = db;
const { Op } = require('sequelize');
require('dotenv').config();

// Room functions
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
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
    try {
        const reservation = await Reservation.create(req.body);
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
    try {
        const deleted = await Reservation.destroy({
            where: { reservation_id: req.params.id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Reservation not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// Analytics functions
exports.runAllAnalytics = async () => {
    try {
        const currentDate = new Date();

        // number of guests
        const number_of_guests = await db.Reservation.count({
            where: {
                check_in_date: { [Op.lte]: currentDate },
                check_out_date: { [Op.lte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1) },
                status: 'confirmed'
            }
        });

        // Calculate total revenue for the day
        // const totalRevenueResult = await Payment.sum('amount', {
        //     where: {
        //         createdAt: {
        //             [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        //             [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        //         }
        //     }
        // });

        // Calculate number of reservations for the day
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
            attributes: ['room_id', [db.Sequelize.fn('COUNT', db.Sequelize.col('room_id')), 'count']],
            group: ['room_id'],
            order: [[db.Sequelize.literal('count'), 'DESC']]
        });

        // Get last 5 days occupancy rate
        const occupancyRates = await db.sequelize.query(`
            SELECT
                DATE_TRUNC('day', check_in_date) AS day,
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
            type: db.sequelize.QueryTypes.SELECT
        });

        const analyticsData = {
            number_of_guests,
            // total_revenue: totalRevenueResult || 0,
            number_of_reservations: numberOfReservations || 0,
            most_reserved_room_type: mostReservedRoomType ? mostReservedRoomType.room_id : null,
            occupancy_rates: occupancyRates || []
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
