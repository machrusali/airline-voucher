# Airline Voucher Seat Assignment Application

A web application built to assign 3 unique promotional seat numbers to airline flight crew members based on aircraft seating specifications.

## Tech Stack
- **Backend:** PHP Laravel 13.x (Database: SQLite)
- **Frontend:** React + Vite + Tailwind CSS v4

---

## Installation & Setup Instructions

### 1. Prerequisites
Ensure you have the following installed on your local machine:
- PHP >= 8.3
- Composer
- Node.js >= 23.3.0 & npm

### 2. Backend Setup (Laravel 13)
1. Open your terminal and navigate to the backend directory:
   cd backend
2. Install PHP dependencies:
   composer install
3. Copy environment configuration file:
   cp .env.example .env
4. Generate application encryption key:
   php artisan key:generate
5. Create an empty SQLite database file:
   touch database/database.sqlite
6. Run database migrations to set up tables:
   php artisan migrate
7. Start the backend local development server:
   php artisan serve

### 3. Frontend Setup (React)
1. Open a new terminal window and navigate to the frontend directory:
   cd frontend
2. Install frontend dependencies:
   npm install
3. Start the Vite development web server:
   npm run dev

---

## Running Automated Feature Tests
To run the automated endpoint integration tests for the backend, navigate to the `backend/` directory and execute:
php artisan test