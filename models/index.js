const dbConfig = require("../config/db.config.js");
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

sequelize.authenticate().then(() => {
    console.log('Connection established successfully');
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model.js")(sequelize, Sequelize);
db.Room = require("./room.model.js")(sequelize, Sequelize);
db.Reservation = require("./reservation.model.js")(sequelize, Sequelize);

// Define associations
db.User.hasMany(db.Reservation, { foreignKey: 'user_id' });
db.Room.hasMany(db.Reservation, { foreignKey: 'room_id' });
db.Reservation.belongsTo(db.User, { foreignKey: 'user_id' });
db.Reservation.belongsTo(db.Room, { foreignKey: 'room_id' });

module.exports = db;
