# Srishti – The Farm: Full-Stack Web Application

A complete, responsive full-stack web application for **Srishti – The Farm**, a premium farm-stay retreat near Chennai. Built with modern technologies and designed for production deployment.

![Srishti The Farm](./assets/IMG-20250817-WA0002.jpg)

## 🌟 Features

### Public Features
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Home Page**: Hero section, features showcase, gallery preview, and accommodations
- **Accommodations**: Detailed room information with booking integration
- **Booking System**: Complete booking flow with availability checking
- **Contact Page**: Contact form, location info, and FAQ section
- **Newsletter Signup**: Email subscription with validation

### Admin Features
- **Secure Authentication**: JWT-based admin login system
- **Dashboard**: Overview statistics and recent activity
- **Booking Management**: View, filter, and update booking requests
- **Contact Management**: Handle contact form submissions and newsletter subscriptions
- **Status Updates**: Mark bookings and messages as processed

### Technical Features
- **SEO Optimized**: Meta tags and semantic HTML structure
- **Security**: Input validation, rate limiting, and secure headers
- **Email Notifications**: Automated email alerts for new bookings/contacts
- **Database**: PostgreSQL with Sequelize ORM
- **Containerized**: Docker and Docker Compose for easy deployment
- **Health Monitoring**: Built-in health checks for all services

## 🛠 Tech Stack

### Frontend
- **React 18** with React Router for navigation
- **Tailwind CSS** for styling and responsive design
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** database with Sequelize ORM
- **JWT** for authentication
- **Joi** for input validation
- **Nodemailer** for email functionality
- **Helmet** for security headers
- **Morgan** for logging

### DevOps
- **Docker** and **Docker Compose** for containerization
- **Nginx** for serving React app in production
- **Health checks** for monitoring

## 📁 Project Structure

```
srishti-farm/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── App.js         # Main app component
│   ├── Dockerfile         # Frontend Docker config
│   └── nginx.conf         # Nginx configuration
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── scripts/          # Database scripts
│   ├── Dockerfile        # Backend Docker config
│   └── index.js          # Server entry point
├── assets/               # Farmhouse images and media
├── docker-compose.yml    # Multi-container orchestration
├── .env.example         # Environment variables template
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- **Docker** and **Docker Compose** installed
- **Git** for cloning the repository

### 1. Clone the Repository
```bash
git clone <repository-url>
cd srishti-farm
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 3. Start with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 4. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

### 5. Admin Access
- **Login URL**: http://localhost/admin/login
- **Default Credentials**: 
  - Email: admin@srishtithefarm.com
  - Password: admin123

## 🔧 Development Setup

### Local Development (without Docker)

#### Backend Setup
```bash
cd server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start PostgreSQL (locally or via Docker)
docker run --name postgres -e POSTGRES_PASSWORD=postgres123 -p 5432:5432 -d postgres:15

# Run database migrations and seed
npm run seed

# Start development server
npm run dev
```

#### Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📧 Email Configuration

To enable email notifications for bookings and contact forms:

1. **Gmail Setup** (recommended):
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password  # Generate from Google Account settings
   EMAIL_FROM=noreply@srishtithefarm.com
   ```

2. **Other SMTP Providers**:
   Update the EMAIL_* variables in `.env` with your provider's settings.

## 🗄 Database

### Schema
The application uses PostgreSQL with three main tables:
- **Users**: Admin authentication
- **Bookings**: Guest booking requests
- **Contacts**: Contact form submissions and newsletter subscriptions

### Backup and Restore
```bash
# Backup
docker exec srishti-db pg_dump -U postgres srishti_farm > backup.sql

# Restore
docker exec -i srishti-db psql -U postgres srishti_farm < backup.sql
```

## 🔐 Security

### Production Security Checklist
- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Configure HTTPS with SSL certificates
- [ ] Set up firewall rules
- [ ] Enable database authentication
- [ ] Configure email authentication
- [ ] Set up monitoring and logging

### Environment Variables
Never commit `.env` files to version control. Always use strong, unique passwords and secrets in production.

## 🚀 Deployment

### Docker Compose (Recommended)
```bash
# Production deployment
docker-compose -f docker-compose.yml up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Build and deploy backend
4. Build and deploy frontend with nginx
5. Set up SSL certificates
6. Configure domain and DNS

### Cloud Deployment
The application is ready for deployment on:
- **AWS** (ECS, RDS, CloudFront)
- **Google Cloud** (Cloud Run, Cloud SQL)
- **DigitalOcean** (App Platform, Managed Database)
- **Heroku** (with PostgreSQL add-on)

## 📊 Monitoring

### Health Checks
All services include health checks:
- **Database**: PostgreSQL connection test
- **Backend**: HTTP health endpoint at `/api/health`
- **Frontend**: Nginx health endpoint at `/health`

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs server
docker-compose logs client
docker-compose logs database
```

## 🧪 Testing

### API Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test booking creation
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"1234567890","checkIn":"2024-12-01","checkOut":"2024-12-03","guests":2,"accommodationType":"deluxe","message":"Test booking"}'
```

### Frontend Testing
Navigate to http://localhost and test:
- [ ] Home page loads correctly
- [ ] Accommodations page displays rooms
- [ ] Booking form works
- [ ] Contact form submits
- [ ] Admin login functions
- [ ] Admin dashboard displays data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software for Srishti – The Farm. All rights reserved.

## 📞 Support

For technical support or questions:
- **Email**: admin@srishtithefarm.com
- **Phone**: +91 XXXXX XXXXX

## 🔄 Updates

### Version 1.0.0
- Initial release with full booking and contact management
- Docker containerization
- Admin dashboard
- Responsive design
- Email notifications

---

**Built with ❤️ for Srishti – The Farm**
#   N D N  
 