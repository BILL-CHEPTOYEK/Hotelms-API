// Import modules
const express = require("express");
const cors = require('cors');
require('dotenv').config();

// Import models
const db = require("./models");


// Initialize express app
const app = express();

// Middleware to allow cross-origin requests
const corsOptions = {
    origin: "*"
};
app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const populateDatabase = require('./models/populateDatabase');

// Synchronize the database
db.sequelize.sync({ force: false }).then(async () => {
    console.log("DB synchronized");
    if (process.env.POPULATE_DATA === 'true') {
        await populateDatabase();
    }

});

const cron = require('node-cron');
const { runAllAnalytics } = require('./controllers/hotel.controller');

// Schedule task to run at 11:59 PM every day
cron.schedule('55 05 14 * * *', async () => {
    try {
        console.log('Running analytics update task...');
        await runAllAnalytics();
        console.log('Analytics update task completed.');
    } catch (error) {
        console.error('Error running analytics update task:', error);
    }
});


// Import routes
const hotelRoutes = require("./routes/hotel.routes");
app.use('/api/hotelms', hotelRoutes);

// Define port for project
const PORT = process.env.PORT || 5000;

// Monitor when server starts
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});
