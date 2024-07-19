module.exports = (sequelize, DataTypes) => {
    const Analytics = sequelize.define('Analytic', {
        analytics_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        metric_type: {
            type: DataTypes.ENUM(
                'number_of_guests', 'total_revenue', 'number_of_reservations',
                'occupancy_rate', 'average_daily_rate', 'revenue_per_available_room',
                'average_length_of_stay', 'booking_lead_time', 'cancellation_rate', 'repeat_guest_rate',
                'occupancy_rate_by_room_type'
            ),
            allowNull: false
        },
        metric_value: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        timestamps: true
    });

    return Analytics;
}