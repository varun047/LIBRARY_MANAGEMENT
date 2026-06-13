# Library Management System
## About
The Library Management System is a comprehensive application designed to manage library books, users, and transactions. This system allows for efficient management of the library's collections and user information.

## Tech Stack
- Primary language: JavaScript
- Frameworks: React, Flask
- Libraries: Bootstrap, Font Awesome
- Database: SQLite
- Frontend framework: Vite

## Features
- User Management System
- Book Management System
- Transaction Management System
- Admin Panel for managing users and books
- Responsive UI for mobile and desktop devices

## Getting Started
### Prerequisites
- Node.js installed on your machine
- Familiarity with JavaScript and React

### Installation
1. Clone the repository using `git clone https://github.com/your-repo/library-management-system.git`
2. Install dependencies by running `npm install` in the frontend directory
3. Run the application by executing `npm start` in the frontend directory

## Project Structure
The project is structured into two main directories: `library-management-system` and `library-management-system/frontend`. The former contains the backend API, models, controllers, and utilities, while the latter contains the frontend codebase.

### Backend Directory
- `app.py`: Main application entry point
- `controllers/`: Contains different controller classes for managing users, books, transactions, and admins
- `models/`: Contains different model classes representing user, book, transaction, and admin data
- `utils/`: Contains utility functions for database interactions and authentication

### Frontend Directory
- `App.jsx`: Main application component
- `components/`: Contains reusable UI components such as DataTable, Layout, Loader, Modal, Navbar, and SearchBar
- `pages/`: Contains different page components for the application's routes
- `services/`: Contains API services for making requests to the backend API

### Dependencies
- `package.json` contains dependencies for frontend development
- `requirements.txt` contains dependencies for Python development