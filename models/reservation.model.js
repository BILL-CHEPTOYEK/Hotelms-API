module.exports = (sequelize, Sequelize) => {
    const Reservation = sequelize.define('Reservation', {
        reservation_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        check_in_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        check_out_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('confirmed', 'canceled', 'completed'),
            defaultValue: 'confirmed'
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Model name is case sensitive
                key: 'user_id'
            }
        },
        room_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Rooms', // Model name is case sensitive
                key: 'room_id'
            }
        }
    }, {
        timestamps: true
    });

    return Reservation;
};
