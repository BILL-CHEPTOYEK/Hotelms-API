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

// Synchronize the database
db.sequelize.sync({ force: false }).then(() => {
    console.log("DB synchronized");
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
