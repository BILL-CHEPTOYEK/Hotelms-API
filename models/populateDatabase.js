const db = require('./index');
const Chance = require('chance');

module.exports = async () => {
    const chance = new Chance();
    const currentDate = new Date();
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
    
                analyticsData.push({
                    metric_type: metricType,
                    metric_value: metricValue
                });
            }
    
            await db.Analytics.bulkCreate(analyticsData);
    
            console.log('Analytics table populated with mock data successfully.');
        } catch (error) {
            console.error('Error populating Analytics table:', error);
        }
    

        // // Create Reservations
        const reservations = [];
        for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 2; j++) {
            const checkInDate = chance.date({ year: 2024, month: currentDate.getMonth() });
            const checkOutDate = new Date(checkInDate);
            checkOutDate.setDate(checkOutDate.getDate() + 2 + Math.floor(Math.random() * 5));
            reservations.push({
                user_id: users[i].user_id,
                room_id: rooms[i].room_id,
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                status: i % 7 == 0 ? 'canceled' : i % 5 == 0 ? 'completed' : 'confirmed'
            });
        }
        } 
        await db.Reservation.bulkCreate(reservations);

        // // Create Payments
        // const payments = await Payment.bulkCreate([
        //     { reservation_id: reservations[0].reservation_id, amount: 500 },
        //     { reservation_id: reservations[1].reservation_id, amount: 600 },
        // ]);

        // Create Notifications
        await db.Notification.bulkCreate([
            { user_id: users[0].user_id, message: 'Your reservation is confirmed.', read_status: 'unread' },
            { user_id: users[1].user_id, message: 'New payment received.', read_status: 'unread' },
            { user_id: users[2].user_id, message: 'Room upgrade available.', read_status: 'unread' },
            { user_id: users[3].user_id, message: 'Check-in time changed.', read_status: 'unread' },
            { user_id: users[4].user_id, message: 'New message from hotel staff.', read_status: 'unread' },
            { user_id: users[5].user_id, message: 'Your reservation is canceled.', read_status: 'unread' },
            { user_id: users[6].user_id, message: 'Payment reminder.', read_status: 'unread' },
            { user_id: users[7].user_id, message: 'Room assignment changed.', read_status: 'unread' },
            { user_id: users[8].user_id, message: 'Special offer available.', read_status: 'unread' },
            { user_id: users[9].user_id, message: 'Check-out time changed.', read_status: 'unread' },
            { user_id: users[10].user_id, message: 'New review from other guests.', read_status: 'unread' },
            { user_id: users[11].user_id, message: 'Hotel policy update.', read_status: 'unread' },
            { user_id: users[12].user_id, message: 'Room service menu updated.', read_status: 'unread' },
            { user_id: users[13].user_id, message: 'Fitness center hours changed.', read_status: 'unread' },
            { user_id: users[14].user_id, message: 'Spa appointment available.', read_status: 'unread' },
            { user_id: users[15].user_id, message: 'Breakfast buffet hours changed.', read_status: 'unread' },
            { user_id: users[16].user_id, message: 'Hotel event schedule updated.', read_status: 'unread' },
            { user_id: users[17].user_id, message: 'Parking information updated.', read_status: 'unread' },
            { user_id: users[18].user_id, message: 'Wi-Fi network changed.', read_status: 'unread' },
            { user_id: users[19].user_id, message: 'Hotel contact information updated.', read_status: 'unread' },
            ]);
            
        console.log('Database populated with mock data successfully.');
    } catch (error) {
        console.error('Error populating database:', error);
    }
}