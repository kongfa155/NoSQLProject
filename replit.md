# Project-Quizzes - NoSQL Quiz Application

## Overview
This is a full-stack quiz management application built with React (frontend) and Express.js (backend), using MongoDB as the database. The application allows users to create, manage, and take quizzes across different subjects.

**Purpose**: Educational quiz platform for creating and managing subject-specific quizzes with user authentication, admin controls, and quiz contribution features.

**Current State**: Fully configured and running on Replit with MongoDB Atlas integration.

## Recent Changes (October 26, 2025)
- Migrated from GitHub Pages to Replit environment
- Configured backend to run on port 3000 (localhost)
- Configured frontend to run on port 5000 (0.0.0.0) with proxy to backend
- Updated Vite config to allow all hosts for Replit's iframe proxy
- Removed GitHub Pages basename from routing
- Connected to MongoDB Atlas database
- Set up deployment configuration for VM target

## Project Architecture

### Tech Stack
- **Frontend**: React 19.1, Vite 7.1, TailwindCSS, React Router, Redux (with persistence)
- **Backend**: Express.js 5.1, Node.js (ES Modules)
- **Database**: MongoDB (Mongoose 8.18)
- **Authentication**: JWT, bcryptjs
- **Email**: SendGrid (optional, for verification emails)

### Project Structure
```
├── backend/              # Express.js backend server
│   ├── api/             # Email utilities (SendGrid)
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middlewares/     # Auth, upload, token verification
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── server.js        # Main backend entry point
├── src/                 # React frontend
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── redux/          # State management
│   ├── routes/         # App routing
│   ├── services/       # API service layer
│   └── main.jsx        # Frontend entry point
└── public/             # Static assets
```

### Key Features
- User authentication and authorization
- Role-based access (Admin/User)
- Subject and chapter management
- Quiz creation and editing with CSV import
- Multiple question types (text and image questions)
- Quiz submission and scoring
- User contribution system
- Admin review dashboard
- User statistics and performance tracking

## Configuration

### Environment Variables
- `MONGO_URI`: MongoDB connection string (stored in Replit Secrets)
- `SENDGRID_API_KEY`: Optional email service API key
- `VITE_API_BASE_URL`: Frontend API endpoint (defaults to /api)

### Ports
- **Frontend**: 5000 (webview)
- **Backend**: 3000 (console, localhost only)

### Workflows
1. **Backend**: Runs Express server on port 3000
2. **Frontend**: Runs Vite dev server on port 5000 with proxy to backend

## Development Notes

### Backend API Endpoints
- `/api/auth` - Authentication (login, register, forgot password)
- `/api/users` - User management
- `/api/subjects` - Subject CRUD
- `/api/chapters` - Chapter management
- `/api/quizzes` - Quiz operations
- `/api/questions` - Question management
- `/api/questionImages` - Image question handling
- `/api/submissions` - Quiz submissions
- `/api/contributed` - User quiz contributions

### Frontend Routes
- `/about` - Landing page with project mission
- `/login` - Authentication page
- `/subject/view` - Subject listing (requires login)
- `/subject/edit` - Subject editing (admin only)
- `/quizzes/:id` - Take a quiz
- `/admin` - Admin dashboard
- `/settings` - User settings
- `/donggopde` - Contribute quizzes

### Database Models
- User (authentication, roles, stats)
- Subject (course subjects)
- Chapter (subject subdivisions)
- Quiz (quiz metadata)
- QuestionText (text-based questions)
- QuestionImage (image-based questions)
- Submission (user quiz attempts)
- ContributedQuiz (user-submitted quizzes)

## User Preferences
- Application is in Vietnamese language
- Uses MongoDB Atlas for production database
- Prefers component-based architecture with Redux for state management
