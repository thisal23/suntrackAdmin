const { pool } = require('./database');

const initializeDatabase = async () => {
  try {
    // Create roles table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT NOT NULL AUTO_INCREMENT,
        roleName VARCHAR(255) NOT NULL,
        displayName VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        roleId INT NOT NULL,
        isActive TINYINT NOT NULL DEFAULT 1,
        resetPasswordOtp VARCHAR(255) NULL,
        resetPasswordExpires DATETIME NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY username (username),
        UNIQUE KEY email (email),
        KEY fk_user_role_idx (roleId),
        CONSTRAINT fk_users_roles FOREIGN KEY (roleId) REFERENCES roles (id) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    // Create vehicle brands table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS vehiclebrands (
        id INT NOT NULL AUTO_INCREMENT,
        brand VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY unique_brand (brand)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    // Create vehicle models table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS vehiclemodels (
        id INT NOT NULL AUTO_INCREMENT,
        model VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY unique_model (model)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    // Create vehicles table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INT NOT NULL AUTO_INCREMENT,
        plateNo VARCHAR(20) DEFAULT NULL,
        brandId INT NOT NULL,
        modelId INT NOT NULL,
        vehicleType VARCHAR(255) NOT NULL,
        fuelType VARCHAR(45) NOT NULL,
        category VARCHAR(255) NOT NULL,
        registeredYear INT NOT NULL,
        chassieNo VARCHAR(45) NOT NULL,
        status VARCHAR(45) NOT NULL DEFAULT 'available',
        color VARCHAR(45) NOT NULL,
        image TEXT,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY plateNo (plateNo),
        KEY fk_brand_idx (brandId),
        KEY fk_model_idx (modelId),
        CONSTRAINT fk_vehicles_brand FOREIGN KEY (brandId) REFERENCES vehiclebrands (id) ON UPDATE CASCADE,
        CONSTRAINT fk_vehicles_model FOREIGN KEY (modelId) REFERENCES vehiclemodels (id) ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    // Insert default roles if they don't exist
    await pool.execute(`
      INSERT IGNORE INTO roles (id, roleName, displayName) VALUES 
      (1, 'Admin', 'Administrator'),
      (2, 'FleetManager', 'Manager'),
      (3, 'User', 'Driver')
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

module.exports = initializeDatabase;
