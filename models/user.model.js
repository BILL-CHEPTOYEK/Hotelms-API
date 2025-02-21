module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        user_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
        },
        password: {
            type: Sequelize.STRING,
            allowNull: true 
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
