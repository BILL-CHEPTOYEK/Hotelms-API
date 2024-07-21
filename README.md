# HotelMS API

Welcome to the HotelMS API, a backend service for managing hotel reservations, rooms, and users. This API is built using Node.js, Express, and Sequelize ORM to interact with a SQL database.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [License](#license)

## Installation

Follow these steps to get the HotelMS API up and running on your local machine:

1. Clone the repository:

    ```bash
    git clone https://github.com/BILL-CHEPTOYEK/Hotelms-API.git
    cd Hotelms-API
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up the database:
   - Ensure you have a SQL database running.
   

## Configuration

The configuration for the database connection is located in the `config/db.config.js` file. Ensure that the `db.config` file contains the correct details for your database setup.

## Usage

To start the server, run:

bash
npm start

This will start the server on the port specified in your .env file (default is 5000).
## API Endpoints
### User Endpoints

    Get All Users

        GET /api/users

        Response:

        json

        {
          "status": "Success",
          "status_code": 100,
          "data": [ /* Array of user objects */ ]
        }

### Room Endpoints

    Get All Rooms

        GET /api/hotelms/rooms

        Response:

        json

        {
          "status": "Success",
          "status_code": 100,
          "data": [ /* Array of room objects */ ]
        }

## Sample Data Endpoint

    Post Data

        POST /data

        Request:

        json

{
  "data_r": "Sample data"
}

Response:

json

        {
          "status": "Success",
          "status_code": 100,
          "message": "Welcome to HOTELMS",
          "data": "Result - Sample data"
        }

## Database Models
### User Model

The user model is defined in models/userModel.js and includes the following fields:

    user_id: Unique identifier for the user (string).
    first_name: First name of the user (string).
    last_name: Last name of the user (string).
    role: Role of the user, either 'admin' or 'customer' (enum).

### Room Model

The room model is defined in models/roomModel.js and includes the following fields:

    room_id: Unique identifier for the room (string).
    room_number: Room number (integer).
    type: Type of the room (string).
    price: Price per night (decimal).
    status: Status of the room (available, occupied, etc.) (string).

### License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributors

- [Bill Cheptoyek](https://github.com/BILL-CHEPTOYEK)
- [Iraku Harry](https://github.com/iraqooh)
- [Atong Abraham Kur](https://github.com/Abram-MrRight)
- [Akoldou Samuel](https://github.com/Akoldou)
- [Ngong Abraham Kon](https://github.com/Ngongkon)
- [Efiti Andrew](https://github.com/1efitiAnndrew)
- [Geriga Sunday Drago](https://github.com/sundayDrago)