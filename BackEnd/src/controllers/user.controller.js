

const DB = require('../utils/db');
const ResponseHelper = require('../utils/response');
const bcrypt = require('bcryptjs');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const users = await DB.findAll('users', {
        orderBy: 'created_at',
        order: 'DESC',
        limit,
        offset
      });

      const total = await DB.count('users');
      const pagination = ResponseHelper.pagination(total, page, limit);

      return ResponseHelper.success(res, { users, pagination });
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return ResponseHelper.error(res);
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await DB.findById('users', req.params.id);
      if (!user) {
        return ResponseHelper.error(res, 'User not found', 404);
      }
      return ResponseHelper.success(res, { user });
    } catch (error) {
      console.error('Error in getUserById:', error);
      return ResponseHelper.error(res);
    }
  }

  static async createUser(req, res) {
    const connection = await DB.beginTransaction();
    try {
      const { username, email, password, role } = req.body;

      const existingUser = await DB.findOne('users', { email });
      if (existingUser) {
        await DB.rollback(connection);
        return ResponseHelper.error(res, 'Email already exists', 400);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await DB.insert('users', {
        username,
        email,
        password: hashedPassword,
        role: role || 'user'
      });

      await DB.commit(connection);
      return ResponseHelper.success(res, { id: result.insertId }, 'User created successfully', 201);
    } catch (error) {
      await DB.rollback(connection);
      console.error('Error in createUser:', error);
      return ResponseHelper.error(res);
    }
  }

  static async updateUser(req, res) {
    const connection = await DB.beginTransaction();
    try {
      const { id } = req.params;
      const { username, email, password, role } = req.body;

      const user = await DB.findById('users', id);
      if (!user) {
        await DB.rollback(connection);
        return ResponseHelper.error(res, 'User not found', 404);
      }

      const updateData = { username, email, role };
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      await DB.update('users', updateData, { id });
      await DB.commit(connection);

      return ResponseHelper.success(res, null, 'User updated successfully');
    } catch (error) {
      await DB.rollback(connection);
      console.error('Error in updateUser:', error);
      return ResponseHelper.error(res);
    }
  }

  static async deleteUser(req, res) {
    const connection = await DB.beginTransaction();
    try {
      const { id } = req.params;

      const user = await DB.findById('users', id);
      if (!user) {
        await DB.rollback(connection);
        return ResponseHelper.error(res, 'User not found', 404);
      }

      await DB.delete('users', { id });
      await DB.commit(connection);

      return ResponseHelper.success(res, null, 'User deleted successfully');
    } catch (error) {
      await DB.rollback(connection);
      console.error('Error in deleteUser:', error);
      return ResponseHelper.error(res);
    }
  }

  static async searchUsers(req, res) {
    try {
      const { term } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const users = await DB.search(
        'users',
        ['username', 'email'],
        term,
        { limit, offset }
      );

      return ResponseHelper.success(res, { users });
    } catch (error) {
      console.error('Error in searchUsers:', error);
      return ResponseHelper.error(res);
    }
  }

  static async getFleetManagers(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const offset = (page - 1) * limit;

      const safeLimit = Math.max(1, Math.min(100, Number(limit)));
      const safeOffset = Math.max(0, Number(offset));

      console.log('FleetManager Query:', { 
        limit: safeLimit, 
        offset: safeOffset, 
        types: { limit: typeof safeLimit, offset: typeof safeOffset } 
      });

      const fleetManagers = await DB.findAll('users', {
        where: { roleId: 2 },
        orderBy: 'created_at',
        order: 'DESC',
        limit: safeLimit,
        offset: safeOffset
      });

      const total = await DB.count('users', { roleId: 2 });
      const pagination = ResponseHelper.pagination(total, page, limit);

      return ResponseHelper.success(res, {
        fleetManagers,
        pagination
      });

    } catch (error) {
      console.error('Error in getFleetManagers:', error);
      return ResponseHelper.error(res, 'Failed to fetch fleet managers', 500);
    }
  }

  static async getFleetManagerById(req, res) {
    try {
      const { id } = req.params;
      const fleetManager = await DB.findOne('users', {
        id: parseInt(id),
        roleId: 2
      });

      if (!fleetManager) {
        return ResponseHelper.error(res, 'Fleet manager not found', 404);
      }

      return ResponseHelper.success(res, { fleetManager });
    } catch (error) {
      console.error('Error in getFleetManagerById:', error);
      return ResponseHelper.error(res, 'Failed to fetch fleet manager', 500);
    }
  }

  static async updateFleetManager(req, res) {
    const connection = await DB.beginTransaction();
    try {
      const { id } = req.params;
      const updates = { ...req.body };

      delete updates.role;
      delete updates.roleId;

      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      }

      const fleetManager = await DB.findOne('users', {
        id: parseInt(id),
        roleId: 2
      });

      if (!fleetManager) {
        await DB.rollback(connection);
        return ResponseHelper.error(res, 'Fleet manager not found', 404);
      }

      await DB.update('users', updates, { id: parseInt(id) });
      await DB.commit(connection);

      const updatedFleetManager = await DB.findById('users', parseInt(id));

      return ResponseHelper.success(res, {
        fleetManager: updatedFleetManager
      }, 'Fleet manager updated successfully');
    } catch (error) {
      await DB.rollback(connection);
      console.error('Error in updateFleetManager:', error);
      return ResponseHelper.error(res, 'Failed to update fleet manager', 500);
    }
  }

  static async deleteFleetManager(req, res) {
    const connection = await DB.beginTransaction();
    try {
      const { id } = req.params;

      const fleetManager = await DB.findOne('users', {
        id: parseInt(id),
        roleId: 2
      });

      if (!fleetManager) {
        await DB.rollback(connection);
        return ResponseHelper.error(res, 'Fleet manager not found', 404);
      }

      await DB.delete('users', { id: parseInt(id) });
      await DB.commit(connection);

      return ResponseHelper.success(res, null, 'Fleet manager deleted successfully');
    } catch (error) {
      await DB.rollback(connection);
      console.error('Error in deleteFleetManager:', error);
      return ResponseHelper.error(res, 'Failed to delete fleet manager', 500);
    }
  }
}


module.exports = UserController;
