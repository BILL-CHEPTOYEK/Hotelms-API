const { Room, sequelize, Sequelize } = require('../models');
require('dotenv').config();
const { Op } = require('sequelize');
const db = require('../models/index');

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.runAllAnalytics = async () => {
    try {
        const currentDate = new Date();

        // number of guests (rooms where status is booked)
        const bookedRoomsCount = await db.Room.count({
            where: { status: 'booked' }
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
        // const numberOfReservations = await db.Reservation.count({
        //     where: {
        //         createdAt: {
        //             [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        //             [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        //         }
        //     }
        // });

        // Calculate occupancy rate (rooms occupied / total rooms)
        const totalRooms = await db.Room.count();
        const occupiedRooms = await db.Room.count({
            where: {
                status: 'occupied'
            }
        });
        const occupancyRate = (occupiedRooms / totalRooms) * 100;

        // average_daily_rate (average rental income per paid occupied room per day)
        // const averageDailyRateResult = await db.Reservation.findAll({
        //     attributes: [
        //         [Sequelize.literal('AVG("Payments"."amount" / DATEDIFF("check_out_date", "check_in_date"))'), 'average_daily_rate']
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
        // const averageLengthOfStayResult = await db.Reservation.findAll({
        //     attributes: [
        //         [Sequelize.literal('AVG(DATEDIFF("check_out_date", "check_in_date"))'), 'average_length_of_stay']
        //     ],
        //     where: {
        //         createdAt: {
        //             [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        //             [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        //         }
        //     }
        // });

        // const averageLengthOfStay = averageLengthOfStayResult[0].dataValues.average_length_of_stay || 0;

        // booking_lead_time
        // const bookingLeadTimeResult = await db.Reservation.findAll({
        //     attributes: [
        //         [Sequelize.literal('AVG(DATEDIFF("check_in_date", createdAt))'), 'booking_lead_time']
        //     ],
        //     where: {
        //         createdAt: {
        //             [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        //             [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        //         }
        //     }
        // });

        // const bookingLeadTime = bookingLeadTimeResult[0].dataValues.booking_lead_time || 0;

        // cancellation_rate
        // const totalReservations = await db.Reservation.count({
        //     where: {
        //         createdAt: {
        //             [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        //             [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        //         }
        //     }
        // });

        // const cancelledReservations = await db.Reservation.count({
        //     where: {
        //         createdAt: {
        //             [Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
        //             [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        //         },
        //         status: 'canceled'
        //     }
        // });

        // const cancellationRate = (cancelledReservations / totalReservations) * 100 || 0;

        // const repeatGuestRateQuery = `
        //     SELECT COUNT(*) AS repeat_guests
        //     FROM (
        //         SELECT "user_id"
        //         FROM "Reservations"
        //         GROUP BY "user_id"
        //         HAVING COUNT(*) > 1
        //     ) AS repeat_guests_table
        // `;

        // // repeat_guest_rate
        // const [repeatGuestRateResult] = await db.sequelize.query(repeatGuestRateQuery, { type: Sequelize.QueryTypes.SELECT });
        // const totalGuests = await User.count();

        // const repeatGuestRate = (repeatGuestRateResult && repeatGuestRateResult.repeat_guests || 0) / totalGuests * 100;

        // occupancy_rate_by_room_type
        // const occupancyRateByRoomType = await db.Room.findAll({
        //     attributes: ['type', [Sequelize.fn('AVG', Sequelize.literal('CASE WHEN "status" = \'occupied\' THEN 1 ELSE 0 END')), 'occupancy_rate']],
        //     group: ['type']
        // });

        await db.Analytics.bulkCreate([
            {
                metric_type: 'number_of_guests',
                metric_value: bookedRoomsCount,
                metric_date: currentDate
            },
            // {
            //     metric_type: 'number_of_reservations',
            //     metric_value: numberOfReservations,
            //     metric_date: currentDate
            // },
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
            // {
            //     metric_type: 'average_length_of_stay',
            //     metric_value: averageLengthOfStay || 0,
            //     metric_date: currentDate
            // },
            // {
            //     metric_type: 'booking_lead_time',
            //     metric_value: bookingLeadTime || 0,
            //     metric_date: currentDate
            // },
            // {
            //     metric_type: 'cancellation_rate',
            //     metric_value: cancellationRate || 0,
            //     metric_date: currentDate
            // },
            // {
            //     metric_type: 'repeat_guest_rate',
            //     metric_value: repeatGuestRate || 0,
            //     metric_date: currentDate
            // }
        ]);

        // await Promise.all(occupancyRateByRoomType.map(async (item) => {
        //     await db.Analytics.create({
        //         metric_type: 'occupancy_rate_by_room_type',
        //         metric_value: item.dataValues.occupancy_rate || 0,
        //         metric_date: currentDate,
        //         room_type: item.dataValues.type
        //     });
        // }));

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