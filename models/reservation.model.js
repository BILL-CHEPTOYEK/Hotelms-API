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
        }
    }, {
        timestamps: true
    });

    return Reservation;
};
