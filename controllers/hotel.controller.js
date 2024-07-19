const db = require("../models");
const { Room } = require('../models');

const Notification = db.Notification;

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
