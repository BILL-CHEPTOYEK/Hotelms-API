const db = require('./index');
const Chance = require('chance');

module.exports = async () => {
    try {
        // Create Users
        const users = await db.User.bulkCreate([
            { first_name: 'John', last_name: 'Doe', email: 'john@example.com', password: 'password', role: 'admin' },
            { first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', password: 'password', role: 'customer' },
            { first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', password: 'password', role: 'customer' },
            { first_name: 'Alice', last_name: 'Williams', email: 'alice@example.com', password: 'password', role: 'customer' },
            { first_name: 'Mike', last_name: 'Brown', email: 'mike@example.com', password: 'password', role: 'customer' },
            { first_name: 'Emily', last_name: 'Davis', email: 'emily@example.com', password: 'password', role: 'customer' },
            { first_name: 'Sarah', last_name: 'Miller', email: 'sarah@example.com', password: 'password', role: 'customer' },
            { first_name: 'Kevin', last_name: 'Wilson', email: 'kevin@example.com', password: 'password', role: 'customer' },
            { first_name: 'Rebecca', last_name: 'Anderson', email: 'rebecca@example.com', password: 'password', role: 'customer' },
            { first_name: 'Brian', last_name: 'Thomas', email: 'brian@example.com', password: 'password', role: 'customer' },
            { first_name: 'Laura', last_name: 'Jackson', email: 'laura@example.com', password: 'password', role: 'customer' },
            { first_name: 'Chris', last_name: 'White', email: 'chris@example.com', password: 'password', role: 'customer' },
            { first_name: 'Matthew', last_name: 'Harris', email: 'matthew@example.com', password: 'password', role: 'customer' },
            { first_name: 'Katherine', last_name: 'Martin', email: 'katherine@example.com', password: 'password', role: 'customer' },
            { first_name: 'Jennifer', last_name: 'Thompson', email: 'jennifer@example.com', password: 'password', role: 'customer' },
            { first_name: 'Joseph', last_name: 'Garcia', email: 'joseph@example.com', password: 'password', role: 'customer' },
            { first_name: 'Lisa', last_name: 'Martinez', email: 'lisa@example.com', password: 'password', role: 'customer' },
            { first_name: 'Michael', last_name: 'Robinson', email: 'michael@example.com', password: 'password', role: 'customer' },
            { first_name: 'Nicole', last_name: 'Clark', email: 'nicole@example.com', password: 'password', role: 'customer' },
            { first_name: 'Richard', last_name: 'Rodriguez', email: 'richard@example.com', password: 'password', role: 'customer' },
        ]);

        // Create Rooms
        const rooms = await db.Room.bulkCreate([
            { number: 101, type: 'Single', price: 100, status: 'available' },
            { number: 201, type: 'Double', price: 150, status: 'available' },
            { number: 102, type: 'Single', price: 100, status: 'available' },
            { number: 202, type: 'Double', price: 150, status: 'available' },
            { number: 103, type: 'Suite', price: 200, status: 'available' },
            { number: 203, type: 'Suite', price: 200, status: 'available' },
            { number: 104, type: 'Single', price: 100, status: 'booked' },
            { number: 204, type: 'Double', price: 150, status: 'booked' },
            { number: 105, type: 'Single', price: 100, status: 'available' },
            { number: 205, type: 'Double', price: 150, status: 'available' },
            { number: 106, type: 'Suite', price: 200, status: 'available' },
            { number: 206, type: 'Suite', price: 200, status: 'available' },
            { number: 107, type: 'Single', price: 100, status: 'booked' },
            { number: 207, type: 'Double', price: 150, status: 'booked' },
            { number: 108, type: 'Single', price: 100, status: 'available' },
            { number: 208, type: 'Double', price: 150, status: 'available' },
            { number: 109, type: 'Suite', price: 200, status: 'available' },
            { number: 210, type: 'Suite', price: 200, status: 'available' },
            { number: 301, type: 'Single', price: 100, status: 'available' },
            { number: 401, type: 'Double', price: 150, status: 'available' },
        ]);

        try {
            const chance = new Chance();
            const analyticsData = [];
            for (let i = 0; i < 20; i++) {
                const metricType = chance.pickone([
                    'number_of_guests', 'total_revenue', 'number_of_reservations',
                    'occupancy_rate', 'average_daily_rate', 'revenue_per_available_room',
                    'average_length_of_stay', 'booking_lead_time', 'cancellation_rate', 'repeat_guest_rate',
                    'occupancy_rate_by_room_type'
                ]);
    
                const metricValue = chance.integer({ min: 100, max: 10000 });
                const metricDate = chance.date({ year: 2023 });
                const userId = chance.integer({ min: 1, max: users.length });
                const roomId = chance.integer({ min: 1, max: rooms.length });
    
                analyticsData.push({
                    metric_type: metricType,
                    metric_value: metricValue,
                    metric_date: metricDate,
                    user_id: userId,
                    room_id: roomId,
                });
            }
    
            const createdAnalytics = await db.Analytics.bulkCreate(analyticsData);
    
            console.log('Analytics table populated with mock data successfully.');
        } catch (error) {
            console.error('Error populating Analytics table:', error);
        }
    

        // // Create Reservations
        // const reservations = await Reservation.bulkCreate([
        //     { user_id: users[0].user_id, room_id: rooms[0].room_id, check_in_date: '2024-07-20', check_out_date: '2024-07-25', status: 'confirmed' },
        //     { user_id: users[1].user_id, room_id: rooms[1].room_id, check_in_date: '2024-08-01', check_out_date: '2024-08-05', status: 'confirmed' },
        //     // Add more reservations as needed
        // ]);

        // // Create Payments
        // const payments = await Payment.bulkCreate([
        //     { reservation_id: reservations[0].reservation_id, amount: 500 },
        //     { reservation_id: reservations[1].reservation_id, amount: 600 },
        // ]);

        // // Create Notifications
        // const notifications = await Notification.bulkCreate([
        //     { user_id: users[0].user_id, message: 'Your reservation is confirmed.', read_status: false },
        //     { user_id: users[1].user_id, message: 'New payment received.', read_status: false },
        // ]);

        console.log('Database populated with mock data successfully.');
    } catch (error) {
        console.error('Error populating database:', error);
    }
}