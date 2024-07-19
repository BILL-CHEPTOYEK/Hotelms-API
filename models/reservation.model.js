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
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    });

    // Define associations
    Reservation.belongsTo(sequelize.models.Room, {
        foreignKey: {
            name: 'room_id',
            allowNull: false
        }
    });
    Reservation.belongsTo(sequelize.models.User, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        }
    });

    return Reservation;
};
