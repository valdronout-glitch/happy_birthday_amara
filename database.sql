CREATE DATABASE IF NOT EXISTS `amara_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `amara_db`;

-- Table wishes
CREATE TABLE IF NOT EXISTS `wishes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `text` TEXT NOT NULL,
    `sender` VARCHAR(255) NOT NULL,
    `color` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table scrapbook
CREATE TABLE IF NOT EXISTS `scrapbook` (
    `id` VARCHAR(100) PRIMARY KEY,
    `src` TEXT NOT NULL,
    `caption` VARCHAR(255) NOT NULL,
    `left_pos` VARCHAR(50) NOT NULL,
    `top_pos` VARCHAR(50) NOT NULL,
    `rotate` VARCHAR(50) NOT NULL,
    `z_index` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table chat_messages
CREATE TABLE IF NOT EXISTS `chat_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `msg_id` VARCHAR(100) UNIQUE NOT NULL,
    `sender` VARCHAR(50) NOT NULL,
    `text` TEXT,
    `image` LONGTEXT,
    `time` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table profiles
CREATE TABLE IF NOT EXISTS `profiles` (
    `username` VARCHAR(50) PRIMARY KEY,
    `display_name` VARCHAR(255) NOT NULL,
    `bio` VARCHAR(255) NOT NULL,
    `mood` VARCHAR(255) NOT NULL,
    `avatar` LONGTEXT,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default profiles
INSERT INTO `profiles` (`username`, `display_name`, `bio`, `mood`, `avatar`) VALUES 
('valdric', 'Valdric 💖', 'Mencintaimu adalah hal terbaik yang pernah ada.', 'Kangen Amara...', ''),
('amara', 'Amara Clarinta 🌸', 'Sweet 21st, looking forward to magical days!', 'Happy Birthday!', '')
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), bio = VALUES(bio), mood = VALUES(mood), avatar = VALUES(avatar);

-- Insert default polaroids
INSERT INTO `scrapbook` (`id`, `src`, `caption`, `left_pos`, `top_pos`, `rotate`, `z_index`) VALUES 
('default_amara_1', 'assets/amara_1.png', 'Gorgeous Amara 🌸', '8%', '12%', '-3deg', 10),
('default_amara_2', 'assets/amara_2.jpg', 'Sweetest Smile 💕', '36%', '8%', '4deg', 11),
('default_amara_3', 'assets/amara_3.jpg', 'Sparkling Eyes ✨', '65%', '14%', '-5deg', 12)
ON DUPLICATE KEY UPDATE src = VALUES(src), caption = VALUES(caption), left_pos = VALUES(left_pos), top_pos = VALUES(top_pos), rotate = VALUES(rotate), z_index = VALUES(z_index);
