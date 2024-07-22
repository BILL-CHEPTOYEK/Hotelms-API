module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("Notification", {
        notification_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Model name is case sensitive
                key: 'user_id'
            }
        },
        message: {
            type: Sequelize.STRING,
            allowNull: false
        },
        read_status: {
            type: Sequelize.ENUM('unread', 'read'),
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
