const User = require('./User');
const Role = require('./Role');

// Role has many Users
Role.hasMany(User, {
    foreignKey: 'roleId',
    as: 'users',
});

User.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role',
});

module.exports = {
    User,
    Role,
};