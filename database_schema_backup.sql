-- Database schema for School Connect Rwanda
-- Run this script in MySQL to create the database and table

CREATE DATABASE IF NOT EXISTS school_connect_rwanda;
USE school_connect_rwanda;

CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  min_fee INT NOT NULL,
  max_fee INT NOT NULL,
  programs TEXT NOT NULL,
  description TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  website VARCHAR(255)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'school_admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  school_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Sample data for Rwandan schools
INSERT INTO schools (name, location, min_fee, max_fee, programs, description, contact_email, contact_phone, website) VALUES
('Kigali International Community School', 'Kigali', 1500000, 3000000, 'International Baccalaureate, Cambridge IGCSE, Science, Arts', 'A premier international school offering world-class education with IB curriculum.', 'info@kics.edu.rw', '+250 788 123 456', 'https://kics.edu.rw'),
('Lycee de Kigali', 'Kigali', 800000, 1500000, 'French Curriculum, Science, Literature, Technical', 'Traditional French education with modern facilities and comprehensive programs.', 'contact@lyceedekigali.rw', '+250 788 234 567', 'https://lyceedekigali.rw'),
('Green Hills Academy', 'Kigali', 1200000, 2500000, 'American Curriculum, STEM, Arts, Sports', 'American-style education focusing on STEM and holistic development.', 'admissions@greenhills.rw', '+250 788 345 678', 'https://greenhills.rw'),
('Rwanda Coding Academy', 'Kigali', 500000, 1000000, 'Computer Science, Web Development, Mobile Apps', 'Specialized coding school preparing students for tech careers.', 'hello@rwandacoding.rw', '+250 788 456 789', 'https://rwandacoding.rw'),
('Musanze Secondary School', 'Musanze', 200000, 600000, 'General Education, Agriculture, Science', 'Community-focused school with strong agricultural programs.', 'info@musanzesecondary.rw', '+250 788 567 890', 'https://musanzesecondary.rw'),
('Huye Technical School', 'Huye', 300000, 800000, 'Technical Education, Engineering, Business', 'Technical education center for engineering and business studies.', 'admissions@huyetech.rw', '+250 788 678 901', 'https://huyetech.rw'),
('Nyamirambo Boys Secondary School', 'Kigali', 150000, 400000, 'General Education, Science, Arts', 'Traditional boys school with excellent academic record.', 'contact@nyamirambo.edu.rw', '+250 788 789 012', 'https://nyamirambo.edu.rw'),
('Gisagara Girls Secondary School', 'Gisagara', 100000, 350000, 'General Education, Home Economics, Science', 'Empowering girls through quality education and leadership.', 'info@gisagaragirls.rw', '+250 788 890 123', 'https://gisagaragirls.rw'),
('Rubavu Technical College', 'Rubavu', 400000, 900000, 'Technical Education, Tourism, ICT', 'Technical college specializing in tourism and ICT.', 'admissions@rubavutech.rw', '+250 788 901 234', 'https://rubavutech.rw'),
('Muhanga Secondary School', 'Muhanga', 180000, 500000, 'General Education, Agriculture, Arts', 'Well-rounded education with focus on agriculture and arts.', 'contact@muhangasecondary.rw', '+250 788 012 345', 'https://muhangasecondary.rw');