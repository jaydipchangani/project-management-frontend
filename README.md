---
description: Repository Information Overview
alwaysApply: true
---

# Project Management Frontend Information

## Summary
A React-based project management frontend application that provides a web interface for managing projects, tasks, and users. Built with modern web technologies including React 19, Vite, Tailwind CSS, and Bootstrap. The application integrates with a backend API for data persistence and includes role-based features for different user types (admin, manager, team member).

## Structure
The application follows a modular component-based architecture organized by feature and functionality:

- **src/api** - API configuration and Axios instance setup
- **src/components** - Reusable React components
  - admin/ - Admin-specific components (ProjectForm, TaskForm, UserForm, ProjectList, TaskList, UsersList)
  - common/ - Shared components (ProtectedRoute)
- **src/contexts** - React Context API for state management (AuthContext)
- **src/pages** - Page-level components
  - auth/ - Authentication pages (Login, Register)
  - dashboard/ - Dashboard pages with role-based views (AdminView, ManagerView, TeamView, UsersView, DashboardLayout, DashboardContent)
  - projects/ - Projects management pages
  - tasks/ - Tasks management pages
- **src/services** - API service modules for different domains (auth, project, task, user, dashboard)
- **src/App.jsx** - Main application component
- **src/main.jsx** - Application entry point
- **public/** - Static assets

## Language & Runtime
**Language**: JavaScript (JSX)
**Runtime**: Node.js
**Framework**: React 19.1.1
**Build Tool**: Vite 7.1.12
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- react@^19.1.1 - UI framework for building interactive interfaces
- react-dom@^19.1.1 - React DOM rendering
- react-router-dom@^7.9.5 - Client-side routing for navigation
- axios@^1.13.1 - HTTP client for API communication
- bootstrap@^5.3.8 - CSS framework for styling
- react-bootstrap@^2.10.10 - Bootstrap components as React components
- tailwindcss@^3.4.13 - Utility-first CSS framework
- dayjs@^1.11.19 - Date/time library for handling dates
- classnames@^2.5.1 - Utility for conditional className management

**Development Dependencies**:
- vite@^7.1.12 - Build tool and dev server
- @vitejs/plugin-react@^5.0.4 - Vite React plugin with HMR support
- eslint@^9.39.0 - Code linting tool
- @eslint/js@^9.36.0 - ESLint JavaScript configuration
- eslint-plugin-react-hooks@^5.2.0 - ESLint rules for React hooks
- eslint-plugin-react-refresh@^0.4.22 - ESLint rules for React refresh
- postcss@^8.5.6 - CSS processing
- autoprefixer@^10.4.21 - PostCSS plugin for vendor prefixes
- vite-plugin-eslint@^1.8.1 - ESLint plugin for Vite
- @types/react@^19.1.16 - TypeScript types for React
- @types/react-dom@^19.1.9 - TypeScript types for React DOM
- globals@^16.4.0 - Global variable definitions for ESLint

## Build & Installation
```bash
# Install dependencies
npm install

# Start development server (with hot module reloading)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint code analysis
npm run lint
```

## Configuration Files
**Main Configuration Files**:
- vite.config.js - Vite build and dev server configuration
- tailwind.config.js - Tailwind CSS customization
- postcss.config.js - PostCSS plugins (Tailwind and Autoprefixer)
- eslint.config.js - ESLint linting rules
- .env - Environment variables (VITE_API_BASE_URL for API endpoint)
- index.html - Main HTML entry point

## Development Setup
The project uses:
- **Styling**: Tailwind CSS combined with Bootstrap for UI components
- **State Management**: React Context API (AuthContext for authentication)
- **API Integration**: Axios with configured base URL from environment variables
- **Routing**: React Router DOM for client-side navigation
- **Build Process**: Vite with React Fast Refresh for instant feedback during development

## API Integration
- Base URL: https://project-management-backend-n97n.onrender.com/api (configured in .env)
- HTTP Client: Axios with interceptors for request/response handling
- Services: Modular API service layer for auth, projects, tasks, users, and dashboard data

