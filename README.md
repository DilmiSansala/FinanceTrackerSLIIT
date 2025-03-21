[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xIbq4TFL)


Certainly! Below is a **README.md** file tailored to your Personal Finance Tracker system, following the guidelines provided in the assignment. It includes instructions for setting up the project, running the application, and testing.

---

# Personal Finance Tracker - RESTful API

This project is a **Personal Finance Tracker** system built using **Node.js** with the **Express** framework. It provides a secure RESTful API for managing financial records, tracking expenses, setting budgets, and analyzing spending trends. The system supports multiple user roles (Admin and Regular User) and includes features like expense tracking, budget management, financial reports, and notifications.

---

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Setup Instructions](#setup-instructions)
4. [Environment Variables](#environment-variables)
5. [API Documentation](#api-documentation)
6. [Running Tests](#running-tests)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

- **User Roles and Authentication:**

  - Admin: Manage all user accounts, transactions, and system settings.
  - Regular User: Add, edit, and delete personal transactions, set budgets, and view financial reports.
  - Secure login using **JWT (JSON Web Tokens)**.

- **Expense and Income Tracking:**

  - CRUD operations for income and expense entries.
  - Categorize expenses (e.g., Food, Transportation, Entertainment).
  - Support for recurring transactions (e.g., monthly subscriptions).

- **Budget Management:**

  - Set monthly or category-specific budgets.
  - Notify users when nearing or exceeding budgets.

- **Financial Reports:**

  - Generate reports for spending trends over time.
  - Visualize income vs. expenses using charts or summaries.

- **Notifications and Alerts:**

  - Notify users about unusual spending patterns or important deadlines.
  - Send reminders for bill payments or upcoming financial goals.

- **Goals and Savings Tracking:**

  - Set financial goals (e.g., saving for a car).
  - Track progress toward goals with visual indicators.

- **Multi-Currency Support:**
  - Manage finances in multiple currencies.
  - Real-time exchange rate updates for accurate reporting.

---

## Technologies Used

- **Backend:**

  - Node.js
  - Express.js
  - MongoDB (Database)
  - Mongoose (ODM for MongoDB)
  - JWT (JSON Web Tokens for authentication)

- **Testing:**

  - Jest (Unit and Integration Testing)
  - Supertest (API Testing)

- **Tools:**
  - Postman (API Testing and Documentation)
  - Swagger (API Documentation)
  - NPM (Node Package Manager)

---

## Setup Instructions

### Prerequisites

1. **Node.js** installed (v14 or higher).
2. **MongoDB** installed or a MongoDB Atlas account.
3. **Git** installed.

### Steps to Run the Project

1. **Clone the Repository:**

   ```bash
   git clone (https://github.com/SE1020-IT2070-OOP-DSA-25/project-DilmiSansala.git)
   cd personal-finance-tracker
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   PORT=3000
   JWT_KEY=your_jwt_secret_key
   MONGO_URI=your_mongodb_connection_string
   ```

   Replace `your_jwt_secret_key` with a secure secret key for JWT and `your_mongodb_connection_string` with your MongoDB connection string.

4. **Run the Application:**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

---

## Environment Variables

The following environment variables are required to run the project:

| Variable Name | Description                       | Example Value                               |
| ------------- | --------------------------------- | ------------------------------------------- |
| `PORT`        | Port on which the server runs     | `3000`                                      |
| `JWT_KEY`     | Secret key for JWT authentication | `your_jwt_secret_key`                       |
| `MONGODB_URL` | MongoDB connection string         | `mongodb://localhost:27017/finance-tracker` |

---

## API Documentation

The API documentation is available using **Swagger**. After starting the server, you can access the documentation at:

```
http://localhost:3000/api-docs
```

### Example Endpoints

1. **User Authentication:**

   - **POST** `/api/auth/register` - Register a new user.
   - **POST** `/api/auth/login` - Login and get a JWT token.

2. **Transactions:**

   - **POST** `/api/transactions` - Create a new transaction.
   - **GET** `/api/transactions` - Get all transactions for the logged-in user.
   - **PUT** `/api/transactions/:id` - Update a transaction.
   - **DELETE** `/api/transactions/:id` - Delete a transaction.

3. **Budgets:**

   - **POST** `/api/budgets` - Create a new budget.
   - **GET** `/api/budgets` - Get all budgets for the logged-in user.
   - **PUT** `/api/budgets/:id` - Update a budget.
   - **DELETE** `/api/budgets/:id` - Delete a budget.

4. **Reports:**

   - **POST** `/api/reports` - Generate a financial report.
   - **GET** `/api/reports` - Get all reports for the logged-in user.

5. **Goals:**
   - **POST** `/api/goals` - Create a new financial goal.
   - **GET** `/api/goals` - Get all goals for the logged-in user.
   - **PUT** `/api/goals/:id` - Update a goal.
   - **DELETE** `/api/goals/:id` - Delete a goal.

---

## Running Tests

### Unit Tests

Run unit tests using **Jest**:

```bash
npm test
```

### Integration Tests

Run integration tests to ensure all parts of the application work together:

```bash
npm run test:integration
```

### Security Testing

Use **OWASP ZAP** or **Burp Suite** to perform security testing on the API.

---

## Deployment

To deploy the application, follow these steps:

1. **Build the Application:**

   ```bash
   npm run build
   ```

2. **Deploy to a Hosting Service:**

   - Use services like **Heroku**, **AWS**, or **Vercel**.
   - Ensure the environment variables are set in the hosting service.

3. **Run the Application:**

   ```bash
   npm start
   ```

---

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Contact

For any questions or feedback, please contact:

- **Dilmi Sansala**
- **Email:** dilmisansala21@gmail.com
- **GitHub:** (https://github.com/DilmiSansala)

---



