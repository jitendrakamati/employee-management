# Employee Management System

A modern, full-stack employee management application with a beautiful React frontend and robust GraphQL backend.

![Employee Management System](https://img.shields.io/badge/React-18.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-GraphQL-green) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## ✨ Features

### Frontend
- 🎨 **Beautiful UI** with Tailwind CSS and custom gradients
- 📱 **Responsive Design** - Works on all devices (mobile-first)
- 🍔 **Hamburger Menu** with one-level deep submenus
- 🧭 **Horizontal Navigation** with dropdown menus (stable hover behavior)
- 📊 **Grid View** - 10-column table with sortable headers
- 🎴 **Tile View** - Card-based layout with essential information
- 🔍 **Advanced Filtering** - Search, department, and status filters
- 📈 **Sorting** - Sort by name, department, position, or join date
- 🎯 **Action Menu (Admin only)** - Add, Edit, Delete, Flag/Unflag
- 🔎 **Detail View** - Beautiful modal with complete employee information (Edit opens update form)
- 🔐 **Authentication** - JWT-based login system with robust token handling
- 👤 **Role-Based UI** - Admin vs Employee capabilities
- 🔔 **Toast Notifications** - Success/error feedback for add, update, delete, flag, unflag
- 📱 **Mobile Pagination** - Large touch targets, stacked layout, smooth scroll to top

### Backend
- 🚀 **GraphQL API** with Apollo Server
- 🔒 **JWT Authentication** with bcrypt password hashing
- 👮 **Role-Based Access Control** (Admin/Employee)
- 📄 **Pagination** - Backend-driven via `limit` + `offset`, returns `total` and `hasMore`
- 🔍 **Filtering & Sorting** - Server-side implementation
- ⚡ **DataLoader** - Batch loading and caching for performance
- 🏷️ **Flagging** - Admin can flag/unflag employees (status field)
- 📊 **Comprehensive Schema** - Queries and mutations for all operations

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Apollo Client** - GraphQL client
- **Radix UI** - Accessible components
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Apollo Server** - GraphQL server
- **GraphQL** - API query language
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **DataLoader** - Performance optimization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
cd employee-management
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the Backend** (Terminal 1)
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:4000/graphql`

2. **Start the Frontend** (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`


## 🔑 Test Credentials

### Admin Account
- **Email:** sarah.johnson@company.com
- **Password:** admin123
- **Permissions:** Full access (create, edit, delete)

### Employee Account
- **Email:** michael.chen@company.com
- **Password:** employee123
- **Permissions:** View only

## 📚 API Documentation

### Queries

#### Get All Employees
```graphql
query GetEmployees($filter: EmployeeFilter, $sort: EmployeeSort, $limit: Int, $offset: Int) {
  employees(filter: $filter, sort: $sort, limit: $limit, offset: $offset) {
    employees {
      id
      name
      email
      department
      position
      joinDate
      status
      role
    }
    total
    hasMore
  }
}
```

#### Get Single Employee
```graphql
query GetEmployee($id: ID!) {
  employee(id: $id) {
    id
    name
    email
    department
    position
    joinDate
    status
    role
  }
}
```

### Mutations

#### Login
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      name
      email
      role
    }
  }
}
```

#### Create Employee (Admin Only)
```graphql
mutation CreateEmployee($input: CreateEmployeeInput!) {
  createEmployee(input: $input) {
    id
    name
    email
  }
}
```

#### Update Employee (Admin Only)
```graphql
mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
  updateEmployee(id: $id, input: $input) {
    id
    name
    email
  }
}
```

#### Delete Employee (Admin Only)
```graphql
mutation DeleteEmployee($id: ID!) {
  deleteEmployee(id: $id)
}
```

#### Flag Employee (Admin Only)
```graphql
mutation FlagEmployee($id: ID!) {
  flagEmployee(id: $id) {
    id
    status
  }
}
```

#### Unflag Employee (Admin Only)
```graphql
mutation UnflagEmployee($id: ID!) {
  unflagEmployee(id: $id) {
    id
    status
  }
}
```

## 📁 Project Structure

```
employee-management/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication logic
│   │   ├── data/          # Seed data
│   │   ├── models/        # Data models
│   │   ├── schema/        # GraphQL schema & resolvers
│   │   ├── utils/         # DataLoader & utilities
│   │   └── server.js      # Express & Apollo Server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/    # Header, HamburgerMenu
│   │   │   ├── employees/ # Grid, Tiles, Detail, Filters
│   │   │   └── ui/        # Reusable UI components (button, dialog, toast)
│   │   ├── graphql/       # GraphQL queries
│   │   ├── lib/           # Utilities
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   └── package.json
└── README.md
```

