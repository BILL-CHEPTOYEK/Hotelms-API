const db = require("../models");
const { Room } = require('../models');

const Notification = db.Notification;
const Reservation = db.Reservation;

require('dotenv').config();

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//notification functions

// Create a new notification
exports.create = (req, res) => {
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

    Notification.create(notification)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Notification."
            });
        });
};

// Retrieve all notifications
exports.findAll = (req, res) => {
    Notification.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notifications."
            });
        });
};

// Update a notification by id
exports.update = (req, res) => {
    const id = req.params.notification_id;

    Notification.update(req.body, {
        where: { notification_id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Notification was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Notification with id=${id}. Maybe Notification was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Notification with id=" + id
            });
        });
};

// Delete a notification by id
exports.delete = (req, res) => {
    const id = req.params.notification_id;

    Notification.destroy({
        where: { notification_id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Notification was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Notification with id=${id}. Maybe Notification was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Notification with id=" + id
            });
        });
};

/*
APIs for the reservation model
*/
//Creating a reservation 
exports.createReservation = async (req, res) => {
    try {
        const reservation = await Reservation.create(req.body);
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Retrieving all the available reservations in the database
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//How to get a specific reservation by id
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

//Editing the data for a reservation
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
// Deleting an  existing reservation
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

//Checking for an availablle reservation
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



