module.exports = (sequelize, Sequelize) => {
    const Room = sequelize.define('Room', {
        number: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },
        type: {
            type: Sequelize.STRING,
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
