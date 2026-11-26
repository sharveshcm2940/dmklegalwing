-- Run as the MySQL root user:  mysql -u root -p < mysql-setup.sql
-- Change the password before running.
CREATE DATABASE IF NOT EXISTS dmk_legal_wing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'legalwing'@'localhost' IDENTIFIED BY 'CHANGE_THIS_PASSWORD';
GRANT ALL PRIVILEGES ON dmk_legal_wing.* TO 'legalwing'@'localhost';
FLUSH PRIVILEGES;
