module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("notification", {
        notification_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }, 
        user_id: { 
            type: Sequelize.INTEGER,
            allowNull: false
        },
        message: {
            type: Sequelize.STRING,
            allowNull: false
        },
        read_status: {
            type: Sequelize.ENUM,
            values: ['unread', 'read'],
            defaultValue: 'unread'
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        timestamps: false
    });

    return Notification;
};
