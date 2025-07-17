const DB = require('../utils/db');
const ResponseHelper = require('../utils/response');

class RoleController {
  static async getAllRoles(req, res) {
    try {
      const roles = await DB.query('SELECT * FROM roles ORDER BY id');
      return ResponseHelper.success(res, { roles });
    } catch (error) {
      console.error('Error in getAllRoles:', error);
      return ResponseHelper.error(res);
    }
  }

  static async getRoleById(req, res) {
    try {
      const role = await DB.findById('roles', req.params.id);
      if (!role) {
        return ResponseHelper.error(res, 'Role not found', 404);
      }
      return ResponseHelper.success(res, { role });
    } catch (error) {
      console.error('Error in getRoleById:', error);
      return ResponseHelper.error(res);
    }
  }

  // Only for development/setup purposes
  static async createRole(req, res) {
    const connection = await DB.beginTransaction();
    try {
      const { roleName, displayName } = req.body;
      
      const existingRole = await DB.findOne('roles', { roleName });
      if (existingRole) {
        await DB.rollback(connection);
        return ResponseHelper.error(res, 'Role already exists', 400);
      }

      const result = await DB.insert('roles', {
        roleName,
        displayName,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await DB.commit(connection);
      return ResponseHelper.success(res, { id: result.insertId }, 'Role created successfully', 201);
    } catch (error) {
      await DB.rollback(connection);
      console.error('Error in createRole:', error);
      return ResponseHelper.error(res);
    }
  }
}

module.exports = RoleController;
