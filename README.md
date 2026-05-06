# 🎓 School Connect Rwanda - Comprehensive Documentation

## 📋 Project Overview

**School Connect Rwanda** is a comprehensive web platform designed to connect students in Rwanda with educational institutions. The platform serves as a bridge between prospective students and schools, providing an easy-to-use interface for discovering, comparing, and applying to schools based on various criteria.

### 🎯 Core Mission
To empower Rwandan students by providing transparent access to educational opportunities, helping them make informed decisions about their academic future while assisting schools in reaching qualified applicants.

---

## 📚 Project History & Development Timeline

### Phase 1: Project Inception (Initial Setup)
- **Started as**: A basic school directory platform
- **Initial Tech Stack**: Node.js, Express, MySQL, HTML/CSS
- **Core Features**: School listings, basic search functionality
- **Database**: MySQL with schools table containing basic information

### Phase 2: Authentication System Implementation (Current Phase)
- **Major Enhancement**: Added comprehensive user authentication system
- **New Features**: User registration, login, role-based access control
- **Security**: JWT tokens, bcrypt password hashing, protected routes
- **Admin Features**: User management dashboard, role assignment

### Phase 3: Advanced Features (In Progress)
- **Message System**: Communication between students and schools
- **Enhanced School Profiles**: Detailed school information and programs
- **Application Tracking**: Student application management
- **Analytics Dashboard**: Admin statistics and insights

---

## 🏗️ Architecture & Technology Stack

### Backend
- **Runtime**: Node.js v22.14.0
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcryptjs (10 salt rounds)
- **CORS**: Enabled for cross-origin requests

### Frontend
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Bootstrap 5.3.0 framework with custom styling
- **Vanilla JavaScript**: No frameworks, pure JS for better performance
- **Icons**: Font Awesome 6.0.0
- **Responsive Design**: Mobile-first approach

### Database Schema
```sql
-- Users table (Authentication & Roles)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schools table (Educational Institutions)
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

-- Messages table (Communication System)
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
```

---

## ✅ Completed Features

### 🔐 Authentication System
- **User Registration**: New users can create accounts (role: 'user')
- **Secure Login**: Email/password authentication with role validation
- **JWT Implementation**: Stateless authentication with 24-hour token expiry
- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: Token-based sessions with localStorage

### 👨‍💼 Admin Dashboard
- **User Management**: View all registered users
- **Role Management**: Change user roles (admin ↔ user)
- **User Deletion**: Remove users with safety checks
- **Statistics**: User counts and system metrics
- **Protected Routes**: Admin-only access with middleware

### 🎨 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Bootstrap-based with custom Rwandan theme
- **Role-based Navigation**: Different dashboards for admin/user
- **Form Validation**: Client-side validation with error messages
- **Loading States**: User feedback during API calls

### 🛠️ API Endpoints
```javascript
// Authentication
POST /api/auth/register     // User registration
POST /api/auth/login        // User login
GET  /api/auth/profile      // Get user profile
PUT  /api/auth/profile      // Update profile

// Admin Only
GET  /api/auth/admin/users           // List all users
DELETE /api/auth/admin/users/:id     // Delete user
PUT  /api/auth/admin/users/:id/role  // Update user role

// Schools
GET  /api/schools           // Get all schools
GET  /api/schools/:id       // Get school details
POST /api/schools/search    // Search schools
POST /api/schools           // Create school (admin)
PUT  /api/schools/:id       // Update school (admin)
DELETE /api/schools/:id     // Delete school (admin)
```

---

## 🚧 Currently In Progress

### 🔄 Authentication Flow Refinement
- **Login Redirect Issues**: Ensuring proper redirection after login
- **Role Tab Functionality**: Admin/User login tab switching
- **Session Persistence**: Maintaining login state across browser sessions
- **Logout Functionality**: Proper token cleanup and redirection

### 🎯 Frontend Enhancements
- **Student Dashboard**: Complete user dashboard implementation
- **School Detail Pages**: Enhanced school information display
- **Search Functionality**: Advanced filtering and sorting
- **Message Interface**: Student-school communication system

### 🔧 Backend Improvements
- **Error Handling**: Comprehensive error responses
- **Input Validation**: Server-side validation middleware
- **Rate Limiting**: Prevent abuse of authentication endpoints
- **Logging**: Request/response logging for debugging

---

## 📋 Remaining Features & Roadmap

### Phase 3: Message System
- [ ] Student-to-school messaging interface
- [ ] Message status tracking (unread/read/replied)
- [ ] Email notifications for new messages
- [ ] Message history and threading

### Phase 4: Advanced School Features
- [ ] School profile management for admins
- [ ] Program and curriculum details
- [ ] Admission requirements and deadlines
- [ ] Photo gallery and virtual tours
- [ ] Application form builder

### Phase 5: Analytics & Reporting
- [ ] Admin analytics dashboard
- [ ] User engagement metrics
- [ ] School popularity statistics
- [ ] Application success rates
- [ ] Geographic distribution reports

### Phase 6: Mobile App (Future)
- [ ] React Native mobile application
- [ ] Push notifications
- [ ] Offline school browsing
- [ ] GPS-based school discovery

---

## 🚨 Current Issues & Known Problems

### Critical Issues
1. **Port 3000 Conflicts**: `EADDRINUSE` errors when starting server
   - **Cause**: Previous server instances not properly terminated
   - **Workaround**: Manually kill processes using port 3000
   - **Solution**: Implement proper process management

2. **Login Redirect Problems**: Users not being redirected to correct dashboards
   - **Status**: Partially fixed, needs testing
   - **Cause**: Timing issues with redirect logic
   - **Impact**: Users stay on login page after successful authentication

### Minor Issues
3. **File Encoding**: Some model files show binary content in output
   - **Affected**: `server/models/User.js`
   - **Impact**: Code inspection difficult, but functionality works
   - **Solution**: File re-encoding or recreation

4. **Role Tab Persistence**: Login role selection doesn't persist on page reload
   - **Impact**: Users need to re-select admin/user login each time
   - **Solution**: localStorage persistence for role preference

5. **Error Messages**: Some API errors not user-friendly
   - **Impact**: Technical error messages shown to users
   - **Solution**: User-friendly error message mapping

---

## 🛠️ Setup & Installation Guide

### Prerequisites
- **Node.js**: v14.0 or higher (currently using v22.14.0)
- **MySQL Server**: v8.0 or higher
- **Git**: For version control
- **Web Browser**: Modern browser with JavaScript enabled

### Installation Steps

1. **Clone/Download Project**
   ```bash
   # Download and extract to your desired location
   cd "C:\Users\NTWALI\Desktop\school connect"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Ensure MySQL server is running
   # Run database initialization
   node setup_db.js
   ```

4. **Start Development Server**
   ```bash
   npm start
   # Server runs on http://localhost:3000
   ```

### Default Credentials
- **Admin Account**:
  - Email: `admin@schoolconnect.rw`
  - Password: `admin123`
  - Role: `admin`

---

## 🔧 Development Commands

```bash
# Start production server
npm start

# Start development server (with nodemon)
npm run dev

# Setup database
node setup_db.js

# Check server status
curl http://localhost:3000
```

---

## 📊 Project Statistics

- **Lines of Code**: ~2,500+ lines
- **Database Tables**: 3 (users, schools, messages)
- **API Endpoints**: 12+ routes
- **Frontend Pages**: 6+ HTML pages
- **Completed Features**: 70%
- **Test Coverage**: Basic manual testing

---

## 🤝 Contributing Guidelines

### Code Standards
- **JavaScript**: ES6+ syntax, async/await preferred
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Comments**: JSDoc style for functions, inline for complex logic
- **Error Handling**: Try/catch blocks with meaningful error messages

### Database Standards
- **Table Names**: Plural, lowercase (users, schools, messages)
- **Column Names**: snake_case for database, camelCase for API responses
- **Foreign Keys**: Proper relationships with CASCADE delete
- **Indexes**: Primary keys auto-indexed, add indexes for frequently queried columns

### Security Practices
- **Passwords**: Always hash with bcrypt (minimum 10 rounds)
- **JWT**: 24-hour expiry, secure secret key
- **Input Validation**: Both client and server-side validation
- **CORS**: Properly configured for production
- **SQL Injection**: Use parameterized queries only

---

## 📞 Support & Contact

### Project Maintainers
- **Developer**: NTWALI
- **Location**: Rwanda
- **Email**: info@schoolconnect.rw
- **Phone**: +250 795 585029

### Technical Support
- **Issues**: Report via project repository
- **Documentation**: This README.md file
- **Updates**: Check commit history for latest changes

---

## 📈 Future Vision

School Connect Rwanda aims to become the premier educational platform in Rwanda, serving:
- **10,000+ Students**: Annual active users
- **500+ Schools**: Comprehensive school database
- **Mobile App**: Native iOS and Android applications
- **AI Features**: Smart school recommendations
- **Government Integration**: Official education ministry partnership

---

## 📜 License & Legal

**License**: MIT License
**Copyright**: 2026 School Connect Rwanda
**Restrictions**: Educational use only, no commercial redistribution without permission

---

*This documentation is continuously updated as the project evolves. Last updated: May 4, 2026*
└── README.md
```

## Usage

1. Enter your preferred fee range (minimum and maximum)
2. Enter the location (district in Rwanda)
3. Click "Search Schools" to find matching schools
4. View results in card format with school details

## Sample Data

The application includes sample data for 10 Rwandan schools with realistic information about fees, locations, and programs.

## Contributing

Feel free to contribute to this project by adding more features or improving the existing code.