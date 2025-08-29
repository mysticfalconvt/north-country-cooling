# Admin CMS Setup Guide

This project now includes a built-in admin CMS system to replace Google Sheets. Follow these steps to set up the database and admin interface.

## Prerequisites

1. **PostgreSQL Database**: Ensure you have a PostgreSQL database running
2. **Environment Variables**: Set up your `.env.local` file with the required variables

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file (copy from `.env.example`):

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/north_country_cooling"

# Admin Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password"

# App URL (for API calls)
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

Generate and run database migrations:

```bash
# Generate migration files
npm run db:generate

# Apply migrations to database
npm run db:migrate
```

### 4. Create Admin User

```bash
npm run setup:admin
```

### 5. Start Development Server

```bash
npm run dev
```

## Access the Admin Panel

1. **Login URL**: `http://localhost:3000/admin/login`
2. **Username**: Whatever you set in `ADMIN_USERNAME`
3. **Password**: Whatever you set in `ADMIN_PASSWORD`

## Admin Features

The admin panel includes three main sections:

### Site Settings
- Title and subtitle
- Main content sections
- Contact information (phone, email, Facebook)
- Learn more text
- Facebook post embed URL

### Quotes Management
- Add/remove quotes that appear on the site
- Quotes rotate every 5 seconds on the home page

### Links Management
- Manage links that appear on the "Learn More" page
- Links are displayed with preview cards

## Database Schema

The system uses the following tables:

- **site_settings**: Stores all site content and configuration
- **quotes**: Customer quotes that rotate on the homepage
- **links**: Links displayed on the Learn More page
- **admin_users**: Admin login credentials

## Migration from Google Sheets

If you're migrating from Google Sheets:

1. Export your current data from Google Sheets
2. Use the admin interface to manually enter the data, or
3. Create a one-time import script using the database schema

## Security Notes

- Admin sessions last 24 hours
- Passwords are hashed with bcrypt
- Admin routes require authentication
- Use HTTPS in production
- Set strong passwords for admin accounts

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database permissions

### Admin Login Problems
- Verify environment variables are set
- Check that admin user was created successfully
- Clear browser cookies and try again

### API Errors
- Check the browser console for detailed error messages
- Verify database connectivity
- Ensure migrations have been applied

## Production Deployment

1. Set up PostgreSQL database
2. Set environment variables on your hosting platform
3. Run database migrations
4. Create admin user
5. Deploy the application

The admin panel will be available at `/admin/login` on your production domain.