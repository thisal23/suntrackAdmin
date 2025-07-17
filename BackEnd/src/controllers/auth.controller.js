const DB = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ResponseHelper = require('../utils/response');
const { generateOTP, sendOTPEmail } = require('../utils/email');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

class AuthController {
  // @desc    Login user
  // @route   POST /api/auth/login
  // @access  Public
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const [user] = await DB.query(`
        SELECT u.*, r.roleName, r.displayName as roleDisplayName 
        FROM users u 
        JOIN roles r ON u.roleId = r.id 
        WHERE u.email = ?
      `, [email]);

      if (user && (await bcrypt.compare(password, user.password))) {
        if (!user.isActive) {
          return ResponseHelper.error(res, 'Your account is inactive', 401);
        }

        const userData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          role: user.roleName,
          roleDisplayName: user.roleDisplayName,
          token: generateToken(user.id)
        };

        return ResponseHelper.success(res, userData);
      } else {
        return ResponseHelper.error(res, 'Invalid email or password', 401);
      }
    } catch (error) {
      console.error('Error in login:', error);
      return ResponseHelper.error(res);
    }
  }

  // @desc    Register new user (Fleet Manager by Admin)
  // @route   POST /api/auth/register
  // @access  Private (Admin only)
  static async registerFleetManager(req, res) {
    const connection = await DB.beginTransaction();
    try {
      const { firstName, lastName, username, email, password } = req.body;

      // Check if user exists
      const existingUser = await DB.findOne('users', { email });
      if (existingUser) {
        await DB.rollback(connection);
        return ResponseHelper.error(res, 'User already exists', 400);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user with Fleet Manager role (roleId = 2)
      const result = await DB.insert('users', {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        roleId: 2, // Fleet Manager role
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await DB.commit(connection);

      return ResponseHelper.success(
        res, 
        { id: result.insertId }, 
        'Fleet Manager registered successfully',
        201
      );
    } catch (error) {
      await DB.rollback(connection);
      console.error('Error in registerFleetManager:', error);
      return ResponseHelper.error(res);
    }
  }

  // @desc    Register first admin (public, only if no admin exists)
  // @route   POST /api/auth/register-admin
  // @access  Public (only if no admin exists)
  static async registerAdmin(req, res) {
    const connection = await DB.beginTransaction();
    try {
      // Check if any admin exists
      const adminCount = await DB.count('users', { roleId: 1 });
      if (adminCount > 0) {
        await DB.rollback(connection);
        return ResponseHelper.error(res, 'Admin already exists', 400);
      }

      const { firstName, lastName, username, email, password } = req.body;
      // Check if user exists
      const existingUser = await DB.findOne('users', { email });
      if (existingUser) {
        await DB.rollback(connection);
        return ResponseHelper.error(res, 'User already exists', 400);
      }
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // Create admin user (roleId = 1)
      const result = await DB.insert('users', {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        roleId: 1, // Admin role   
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await DB.commit(connection);
      return ResponseHelper.success(
        res,
        { id: result.insertId },
        'Admin registered successfully',
        201
      );
    } catch (error) {
      await DB.rollback(connection);
      console.error('Error in registerAdmin:', error);
      return ResponseHelper.error(res);
    }
  }

  // @desc    Reset Password Request
  // @route   POST /api/auth/reset-password
  // @access  Public
  static async resetPasswordRequest(req, res) {
    const connection = await DB.beginTransaction();
    try {
      const { email } = req.body;

      const user = await DB.findOne('users', { email });
      if (!user) {
        await DB.rollback(connection);
        return ResponseHelper.error(res, 'User not found', 404);
      }

      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await DB.update('users', {
        resetPasswordOtp: otp,
        resetPasswordExpires: expiresAt
      }, { id: user.id });

      await sendOTPEmail(email, otp);
      await DB.commit(connection);

      return ResponseHelper.success(res, null, 'Reset password OTP sent successfully');
    } catch (error) {
      await DB.rollback(connection);
      console.error('Error in resetPasswordRequest:', error);
      return ResponseHelper.error(res);
    }
  }

  // @desc    Verify OTP and Reset Password
  // @route   POST /api/auth/verify-otp
  // @access  Public
  static async verifyOTPAndResetPassword(req, res) {
    const connection = await DB.beginTransaction();
    try {
      const { email, otp, newPassword } = req.body;

      const user = await DB.findOne('users', { 
        email,
        resetPasswordOtp: otp
      });

      if (!user || new Date() > new Date(user.resetPasswordExpires)) {
        await DB.rollback(connection);
        return ResponseHelper.error(res, 'Invalid or expired OTP', 400);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await DB.update('users', {
        password: hashedPassword,
        resetPasswordOtp: null,
        resetPasswordExpires: null
      }, { id: user.id });

      await DB.commit(connection);
      return ResponseHelper.success(res, null, 'Password reset successfully');
    } catch (error) {
      await DB.rollback(connection);
      console.error('Error in verifyOTPAndResetPassword:', error);
      return ResponseHelper.error(res);
    }
  }

  // @desc    Get user profile
  // @route   GET /api/auth/profile
  // @access  Private
  static async getProfile(req, res) {
    try {
      const [user] = await DB.query(`
        SELECT 
          u.id, u.firstName, u.lastName, u.username, u.email,
          r.roleName, r.displayName as roleDisplayName
        FROM users u 
        JOIN roles r ON u.roleId = r.id 
        WHERE u.id = ?
      `, [req.user.id]);

      if (!user) {
        return ResponseHelper.error(res, 'User not found', 404);
      }

      return ResponseHelper.success(res, { user });
    } catch (error) {
      console.error('Error in getProfile:', error);
      return ResponseHelper.error(res);
    }
  }
}

module.exports = AuthController;
