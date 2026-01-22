# Municipality Management System

A comprehensive web-based application for managing municipal operations, connecting citizens with local government services through an intuitive platform.

## Overview

This system provides a complete solution for municipality management, featuring separate portals for citizens and administrators. Citizens can submit service requests, view and pay bills, while administrators can manage requests, create bills, and oversee municipal operations.

## Features

### Citizen Portal
- User registration and authentication
- Submit service requests (maintenance, complaints, permits)
- View personal bills and payment history
- Make online payments
- Track request status
- Profile management

### Admin Portal
- Dashboard with system overview
- Manage citizen requests (approve/reject/process)
- Create and manage bills for citizens
- View payment records
- User management
- Request categorization and tracking

## Technology Stack

### Backend
- **Framework:** Laravel (PHP)
- **Database:** MariaDB
- **Authentication:** Laravel Sanctum/JWT
- **API:** RESTful API architecture

### Frontend
- **Framework:** React.js
- **Styling:** CSS3
- **HTTP Client:** Axios
- **Routing:** React Router

### Development Tools
- **Version Control:** Git
- **Package Managers:** Composer (PHP), npm (Node.js)
- **Server:** Apache/Nginx with PHP

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **PHP:** >= 8.1
- **Composer:** Latest version
- **Node.js:** >= 16.x
- **npm:** >= 8.x
- **MariaDB:** >= 10.x
- **Web Server:** Apache or Nginx
- **Git:** For version control

### Recommended Tools
- **XAMPP/WAMP/Laragon:** For local development environment
- **Postman:** For API testing
- **VS Code:** Code editor with relevant extensions

## Installation

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd municipality-system
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install PHP dependencies:
```bash
composer install
```

Create environment file:
```bash
cp .env.example .env
```

Configure your `.env` file with database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=municipality_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

Generate application key:
```bash
php artisan key:generate
```

Run database migrations:
```bash
php artisan migrate
```

(Optional) Seed the database with sample data:
```bash
php artisan db:seed
```

Start the Laravel development server:
```bash
php artisan serve
```
Backend will run on `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory from the project root:
```bash
cd frontend
```

Install Node.js dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm start
```
Frontend will run on `http://localhost:5173`

## Usage

### Default Login Credentials

After installation, you can log in with these default accounts:

**Admin Account:**
- Email: `admin@municipality.com`
- Password: `password123`

**Citizen Account:**
- Email: `ashraf@gmail.com`
- Password: `12345678`

*(Note: Change these credentials after first login)*

### Accessing the Application

1. **Citizen Portal:** Navigate to `http://localhost:5173`
   - Register a new account or login
   - Submit service requests
   - View and pay bills
   - Track request status

2. **Admin Portal:** Navigate to `http://localhost:5173/admin`
   - Login with admin credentials
   - Manage citizen requests
   - Create bills for citizens
   - View payment records
   - Monitor system activity

### Key Workflows

**For Citizens:**
1. Register/Login to the system
2. Navigate to "Submit Request" to create new service requests
3. Check "My Requests" to track status
4. View bills in "My Bills" section
5. Make payments through "Payments" section

**For Administrators:**
1. Login to admin portal
2. Review pending requests in dashboard
3. Approve/reject/process requests
4. Create bills for citizens via "Billing" section
5. Monitor payments and system activity

## Project Structure
```
municipality-system/
├── backend/                    # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── Api/       # API Controllers
│   │   ├── Models/            # Eloquent Models
│   │   └── Notifications/     # Email Notifications
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   └── seeders/           # Database Seeders
│   ├── routes/
│   │   ├── api.php           # API Routes
│   │   └── web.php           # Web Routes
│   ├── tests/                # Backend Tests
│   └── .env                  # Environment Configuration
│
└── frontend/                  # React Frontend
    ├── src/
    │   ├── components/       # Reusable Components
    │   ├── context/          # React Context (Auth)
    │   ├── layouts/          # Layout Components
    │   ├── pages/            # Page Components
    │   │   ├── citizen/      # Citizen Portal Pages
    │   │   └── admin/        # Admin Portal Pages
    │   ├── App.jsx           # Main App Component
    │   └── main.jsx          # Entry Point
    ├── public/               # Static Assets
    └── package.json          # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Citizen Portal
- `GET /api/citizen/requests` - Get user requests
- `POST /api/citizen/requests` - Create new request
- `GET /api/citizen/payments` - Get user payments
- `POST /api/citizen/payments` - Make payment
- `GET /api/citizen/permits` - Get user permits

### Admin Portal
- `GET /api/admin/requests` - Get all requests
- `PUT /api/admin/requests/{id}` - Update request status
- `POST /api/admin/bills` - Create bill for citizen
- `GET /api/admin/payments` - View all payments
- `GET /api/admin/citizens` - Get all citizens

## Database Schema

### Main Tables
- **users** - System users (admins and citizens)
- **citizens** - Citizen profile information
- **requests** - Service requests submitted by citizens
- **payments** - Payment records
- **permits** - Permit applications
- **departments** - Municipal departments
- **employees** - Employee records
- **projects** - Municipal projects
- **tasks** - Task management
- **events** - Municipal events
- **documents** - Document management

## Features in Detail

### Request Management
- Citizens can submit various types of requests (maintenance, complaints, permits)
- Admins can view, approve, reject, or process requests
- Real-time status updates
- Request categorization

### Billing & Payments
- Admins create bills for citizens
- Citizens view their bills online
- Online payment processing
- Payment history tracking

### Permit System
- Citizens apply for permits
- Document upload support
- Admin approval workflow
- Permit status tracking

### Notification System
- Email notifications for request updates
- Payment confirmations
- Welcome notifications for new users
- Permit status notifications

## Troubleshooting

### Common Issues

**Database Connection Error:**
- Verify MariaDB is running
- Check database credentials in `.env` file
- Ensure database exists: `CREATE DATABASE municipality_db;`

**Port Already in Use:**
- Backend: Use different port with `php artisan serve --port=8001`
- Frontend: Change port in `vite.config.js` or Vite will automatically prompt for alternative port

**CORS Issues:**
- Verify `FRONTEND_URL` in backend `.env`
- Check Laravel CORS configuration in `config/cors.php`

**Dependencies Not Installing:**
- Clear composer cache: `composer clear-cache`
- Clear npm cache: `npm cache clean --force`

## Contributing

If this is a team project, contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is developed as part of academic coursework.

## Contact

For questions or issues, please contact the development team.

---

**Note:** This is an academic project developed for educational purposes as part of a Computer Science program.