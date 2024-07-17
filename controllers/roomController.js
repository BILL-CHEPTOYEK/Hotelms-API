// controllers/roomController.js
const { Op } = require('sequelize');
const Room = require('../models/roomModel');

exports.searchRooms = async (req, res) => {
  try {
    const { query, sortBy } = req.query;

    const rooms = await Room.findAll({
      where: {
        [Op.or]: [
          { number: { [Op.like]: `%${query}%` } },
        ]
      },
      order: [
        [sortBy || 'createdAt', 'DESC']
      ]
    });

    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'No Room Found' });
  }
};
