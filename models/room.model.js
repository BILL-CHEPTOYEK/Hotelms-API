module.exports = (sequelize, Sequelize) => {
    const Room = sequelize.define('Room', {
        room_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        number: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },
        type: {
            type: Sequelize.ENUM('Single', 'Double', 'Twin', 'Queen', 'King', 'Suite', 'Deluxe', 'Luxury'),
            allowNull: false
        },
        price: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('available', 'booked'),
            defaultValue: 'available'
        }
    });

    return Room;
};
