module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.ENUM('admin', 'customer'),
            defaultValue: 'customer'
        }
    }, {
        defaultScope: {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    });

    return User;
};
