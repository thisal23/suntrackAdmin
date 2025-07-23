const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define('role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    roleName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    tableName: 'roles',
    timestamps: false,
});

// Function to seed initial roles
async function seedRoles() {
    try {
        await Role.bulkCreate([
            {
                id: 1,
                roleName: 'Admin',
                displayName: 'Administrator'
            },
            {
                id: 2,
                roleName: 'FleetManager',
                displayName: 'Manager'
            },
            {
                id: 3,
                roleName: 'User',
                displayName: 'Driver'
            }
        ], {
            ignoreDuplicates: true // This will skip if roles already exist
        });
        console.log('Roles seeded successfully');
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
}

module.exports = Role;
module.exports.seedRoles = seedRoles;