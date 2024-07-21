const db = require("../models");
const { Room } = require('../models');
const Notification = db.Notification;
const Reservation = db.Reservation;

require('dotenv').config();
const { Op } = require('sequelize');

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

exports.runAllAnalytics = async () => {
    try {
        const currentDate = new Date();

        // number of guests
        const number_of_guests = await db.Reservation.count({
            where: {
                check_in_date: { [Op.lte] : currentDate },
                check_out_date: { [Op.lte] : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1) },
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

        // Calculate occupancy rate (rooms occupied / total rooms)
        const totalRooms = await db.Room.count();
        const occupancyRate = number_of_guests / totalRooms;

        // average_daily_rate (average rental income per paid occupied room per day)
        // const averageDailyRateResult = await db.Reservation.findAll({
        //     attributes: [
        //         [db.Sequelize.literal('AVG("Payments"."amount" / DATEDIFF("check_out_date", "check_in_date"))'), 'average_daily_rate']
        //     ],
        //     include: [
        //         {
        //             model: Payment,
        //             required: true,
        //             where: {
        //                 createdAt: {
        //                     [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        //                     [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        //                 }
        //             }
        //         }
        //     ]
        // });

        // const averageDailyRate = averageDailyRateResult[0].dataValues.average_daily_rate || 0;

        // revenue_per_available_room
        // const revenuePerAvailableRoomResult = await db.Analytics.findOne({
        //     where: {
        //         metric_type: 'occupancy_rate',
        //         metric_date: currentDate
        //     }
        // });

        // const occupancyRateByRoom = revenuePerAvailableRoomResult ? revenuePerAvailableRoomResult.metric_value : 0;
        // const revenuePerAvailableRoom = occupancyRateByRoom * averageDailyRate;

        // average_length_of_stay
        const averageLengthOfStayResult = await db.Reservation.findAll({
            attributes: [
                [db.Sequelize.fn('AVG', db.Sequelize.fn('DATEDIFF', db.Sequelize.col('check_out_date'), db.Sequelize.col('check_in_date'))), 'average_length_of_stay']
            ],
            where: {
                status: 'completed'
            }
        });

        const averageLengthOfStay = parseFloat(averageLengthOfStayResult[0].dataValues.average_length_of_stay) || 0;

        // booking_lead_time
        const bookingLeadTimeResult = await db.Reservation.findAll({
            attributes: [
                [db.Sequelize.fn('AVG', db.Sequelize.fn('DATEDIFF', db.Sequelize.col('check_in_date'), db.Sequelize.col('createdAt'))), 'booking_lead_time']
            ],
            where: {
                createdAt: {
                    [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                    [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
                }
            }
        });

        const bookingLeadTime = parseFloat(bookingLeadTimeResult[0].dataValues.booking_lead_time) || 0;

        // cancellation_rate
        const totalReservations = await db.Reservation.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                    [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
                }
            }
        });

        const cancelledReservations = await db.Reservation.count({
            where: {
                updatedAt: {
                    [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
                    [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
                },
                status: 'canceled'
            }
        });

        const cancellationRate = cancelledReservations / totalReservations || 0;

        await db.Analytics.bulkCreate([
            {
                metric_type: 'number_of_guests',
                metric_value: number_of_guests,
                metric_date: currentDate
            },
            {
                metric_type: 'number_of_reservations',
                metric_value: numberOfReservations,
                metric_date: currentDate
            },
            {
                metric_type: 'occupancy_rate',
                metric_value: occupancyRate || 0,
                metric_date: currentDate
            },
            // {
            //     metric_type: 'total_revenue',
            //     metric_value: totalRevenueResult || 0,
            //     metric_date: currentDate
            // },
            // {
            //     metric_type: 'average_daily_rate',
            //     metric_value: averageDailyRate || 0,
            //     metric_date: currentDate
            // },
            // {
            //     metric_type: 'revenue_per_available_room',
            //     metric_value: revenuePerAvailableRoom || 0,
            //     metric_date: currentDate
            // },
            {
                metric_type: 'average_length_of_stay',
                metric_value: averageLengthOfStay || 0,
                metric_date: currentDate
            },
            {
                metric_type: 'booking_lead_time',
                metric_value: bookingLeadTime || 0,
                metric_date: currentDate
            },
            {
                metric_type: 'cancellation_rate',
                metric_value: cancellationRate || 0,
                metric_date: currentDate
            },
        ])
        // .then(data => {
        //     res.status(200).json(data)
        // }).catch(err => {
        //     res.status(500).json(err)
        // })

        console.log('Analytics updated successfully for the current day.');
    } catch (error) {
        console.error('Error updating analytics:', error);
        throw error; // Optional: Rethrow the error for handling in the caller function
    }
};

exports.getAllAnalytics = async (req, res) => {
    try {

        const data = await db.Analytics.findAll();

        res.status(200).json({
            data: data
        });
    } catch (error) {
        console.error('Error retrieving analytics:', error);
        res.status(500).json({ error: 'Failed to retrieve analytics data' });
    }
};