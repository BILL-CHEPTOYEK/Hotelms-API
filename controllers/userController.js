// controllers/userController.js
const { Op } = require('sequelize');
const User = require('../models/userModels');
// const Operation = db.Sequelize.Op;

exports.searchUsers = async (req, res) => {
  try {
    const { query, sortBy } = req.query;

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { first_name: { [Op.like]: `%${query}%` } },
        ]
      },
      order: [
        [sortBy || 'createdAt', 'DESC']
      ]
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'User not found' });
  }
};


