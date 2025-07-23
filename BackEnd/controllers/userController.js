const { Op } = require('sequelize');
const sequelize = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const getFleetManagerRegistrations = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const registrations = await User.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'registrations']
            ],
            where: {
                roleId: 2,
                createdAt: {
                    [Op.gte]: sinceDate,
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
            raw: true
        });

        res.status(200).json(registrations);
    } catch (error) {
        console.error("❌ Error fetching registration data:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const getRegistrationStats = async (req, res) => {
    try {
        // 1. Get all users
        const days = parseInt(req.query.days) || 30;
        const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const users = await User.findAll({
            where: {
                roleId: 2,
                createdAt: {
                    [Op.gte]: sinceDate,
                }
            },
            attributes: ["id", "createdAt"],
            raw: true
        });

        // 2. Group by date
        const registrationsByDate = await User.findAll({
            where: {
                roleId: 2,
                createdAt: {
                    [Op.gte]: sinceDate,
                }
            },
            attributes: [
                [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
                [sequelize.fn("COUNT", sequelize.col("id")), "registrations"]
            ],
            group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
            order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
            raw: true
        });

        // 3. Count admin users (optional: based on actions table if you have one)
        const adminCount = await User.count({
            where: { roleId: 1 }
        });

        res.status(200).json({
            registrationData: registrationsByDate,
            total: users.length,
            adminActivities: adminCount
        });
    } catch (error) {
        console.error("Stats Fetch Error:", error);
        res.status(500).json({ message: "Failed to fetch summary stats." });
    }
};

const getRecentRegistrations = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const users = await User.findAll({
            where: {
                roleId: 2,
            },
            order: [['createdAt', 'DESC']],
            limit,
            attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt'] // adjust fields as needed
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent users' });
    }
};

// Get all fleet managers
const getFleetManagers = async (req, res) => {
  try {
    const managers = await User.findAll({ where: { roleId: 2 } });
    res.json(managers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add a fleet manager
const addFleetManager = async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hash,
      roleId: 2,
      isActive: true,
    });
    res.status(201).json({ message: 'Fleet Manager added', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Edit a fleet manager
const editFleetManager = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, userName, email, password } = req.body;
  try {
    const user = await User.findOne({ where: { id, roleId: 2 } });
    if (!user) return res.status(404).json({ message: 'Fleet Manager not found' });
    user.firstName = firstName;
    user.lastName = lastName;
    user.userName = userName;
    user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: 'Fleet Manager updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a fleet manager
// const deleteFleetManager = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findOne({ where: { id, roleId: 2 } });
//     if (!user) return res.status(404).json({ message: 'Fleet Manager not found' });
//     await user.destroy();
//     res.json({ message: 'Fleet Manager deleted' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
const deleteFleetManager = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findOne({ where: { id, roleId: 2 } });
      if (!user) return res.status(404).json({ message: 'Fleet Manager not found' });
  
      await user.destroy({ force: true }); // Optional based on setup
      res.json({ message: 'Fleet Manager deleted' });
    } catch (err) {
      console.error("Error deleting fleet manager:", err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  

module.exports = {
    getFleetManagerRegistrations,
    getRegistrationStats,
    getRecentRegistrations,
    getFleetManagers,
    addFleetManager,
    editFleetManager,
    deleteFleetManager,
}   
