const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const databaseName = process.env.DB_NAME || 'haidang_portfolio';
const connectionOptions = {
  host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', charset: 'utf8mb4',
};
const pool = mysql.createPool({ ...connectionOptions, database: databaseName, waitForConnections: true, connectionLimit: 10, queueLimit: 0 });

async function initializeDatabase() {
  const bootstrap = await mysql.createConnection(connectionOptions);
  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await bootstrap.end();
  await pool.query(`CREATE TABLE IF NOT EXISTS admins (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, username VARCHAR(80) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS profile (
    id TINYINT UNSIGNED PRIMARY KEY DEFAULT 1, name_vi VARCHAR(150) NOT NULL, name_en VARCHAR(150) NOT NULL,
    role VARCHAR(180) NOT NULL, bio_vi TEXT NOT NULL, bio_en TEXT NOT NULL, avatar_url VARCHAR(500) NOT NULL DEFAULT '/avatar.jpg',
    email VARCHAR(190) NOT NULL, location_vi VARCHAR(190) NOT NULL, location_en VARCHAR(190) NOT NULL,
    github VARCHAR(500) DEFAULT '', linkedin VARCHAR(500) DEFAULT '', facebook VARCHAR(500) DEFAULT '',
    availability TINYINT(1) NOT NULL DEFAULT 1, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS projects (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(180) NOT NULL, category VARCHAR(120) NOT NULL DEFAULT 'WEB APP',
    description_vi TEXT NOT NULL, description_en TEXT NOT NULL, tags JSON NULL, project_url VARCHAR(500) DEFAULT '',
    source_url VARCHAR(500) DEFAULT '', image_url VARCHAR(500) DEFAULT '', featured TINYINT(1) NOT NULL DEFAULT 0,
    published TINYINT(1) NOT NULL DEFAULT 1, sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS posts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(220) NOT NULL, slug VARCHAR(240) NOT NULL UNIQUE,
    excerpt_vi TEXT NOT NULL, excerpt_en TEXT NOT NULL, content_vi LONGTEXT NOT NULL, content_en LONGTEXT NOT NULL,
    image_url VARCHAR(500) DEFAULT '', published TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS messages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(190) NOT NULL,
    subject VARCHAR(220) NOT NULL, message TEXT NOT NULL, is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  await pool.query(`CREATE TABLE IF NOT EXISTS visitors (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(60) NOT NULL,
    name VARCHAR(120) NOT NULL,
    color VARCHAR(20) DEFAULT '#ffffff',
    accessory VARCHAR(50) DEFAULT 'none',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  
  // Try to alter visitors if it already exists (to add color, accessory)
  try {
    await pool.query(`ALTER TABLE visitors ADD COLUMN color VARCHAR(20) DEFAULT '#ffffff', ADD COLUMN accessory VARCHAR(50) DEFAULT 'none'`);
  } catch(e) { /* ignore if already exists */ }

  await pool.query(`CREATE TABLE IF NOT EXISTS reactions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id INT UNSIGNED NOT NULL,
    type VARCHAR(20) NOT NULL,
    count INT UNSIGNED DEFAULT 0,
    UNIQUE KEY project_reaction (project_id, type)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  await pool.query(`CREATE TABLE IF NOT EXISTS global_stats (
    stat_key VARCHAR(100) PRIMARY KEY,
    stat_value INT UNSIGNED DEFAULT 0
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  await pool.query(`CREATE TABLE IF NOT EXISTS sticky_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    color VARCHAR(20) DEFAULT '#ffff88',
    x INT DEFAULT 0,
    y INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);


  await pool.query(`INSERT IGNORE INTO profile
    (id,name_vi,name_en,role,bio_vi,bio_en,avatar_url,email,location_vi,location_en,github,linkedin,facebook) VALUES
    (1,'Lữ Hải Đăng','Lu Hai Dang','Full-stack & IoT Developer',
    'Mình là một developer đến từ Vĩnh Long, tập trung vào web full-stack và IoT. Mình thích kết nối phần mềm, dữ liệu và phần cứng thành trải nghiệm liền mạch, dễ hiểu cho người dùng.',
    'I am a developer based in Vinh Long, focused on full-stack web and IoT. I enjoy connecting software, data, and hardware into seamless experiences.',
    '/avatar.jpg','haidanglu2004@gmail.com','Vĩnh Long, Việt Nam','Vinh Long, Vietnam','https://github.com/HaiDang1304','https://www.linkedin.com/in/h%E1%BA%A3i-%C4%91%C4%83ng-l%E1%BB%AF-4473aa395/','https://www.facebook.com/luhaidang04')`);
  const [[projectCount]] = await pool.query('SELECT COUNT(*) AS total FROM projects');
  if (Number(projectCount.total) === 0) {
    await pool.query(`INSERT INTO projects (title,category,description_vi,description_en,tags,project_url,source_url,featured,sort_order) VALUES
      ('SYSTEM FARM IOT','FULL-STACK · IOT','Hệ thống nông trại thông minh để giám sát cảm biến và điều khiển thiết bị thời gian thực qua MQTT, Firebase, web và mobile.','A smart-farm system for monitoring sensors and controlling devices in real time across MQTT, Firebase, web, and mobile.','["React","Firebase","HiveMQ","ESP32"]','','https://github.com/HaiDang1304/System-Farm-IoT',1,1),
      ('TEZ MOVIES','FRONTEND · WEB APP','Ứng dụng khám phá phim với giao diện hiện đại, tìm kiếm nhanh và trải nghiệm duyệt nội dung mượt mà trên mọi thiết bị.','A movie discovery app with a modern interface, fast search, and a smooth browsing experience on every device.','["React","REST API","Vercel"]','https://tez-movies.vercel.app/','',0,2)`);
  }
  const adminUsername = process.env.ADMIN_USERNAME || 'admin.dev';
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-me-now';
  const [[admin]] = await pool.query('SELECT id FROM admins WHERE username=?', [adminUsername]);
  if (!admin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await pool.query('INSERT INTO admins (username,password_hash) VALUES (?,?)', [adminUsername, passwordHash]);
    console.log(`Đã tạo tài khoản quản trị: ${adminUsername}`);
  } else if (process.env.ADMIN_PASSWORD) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await pool.query('UPDATE admins SET password_hash=? WHERE id=?', [passwordHash, admin.id]);
  }
}

module.exports = { pool, initializeDatabase };
