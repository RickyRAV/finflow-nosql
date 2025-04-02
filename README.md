# FINFLOW-NOSQL

**Empower Your Finances, Simplify Your Life**

[![last commit](https://img.shields.io/badge/last_commit-today-blue.svg)](https://github.com/yourusername/finflow-nosql)
[![typescript](https://img.shields.io/badge/typescript-97.4%25-blue.svg)](https://github.com/yourusername/finflow-nosql)
[![languages](https://img.shields.io/badge/languages-3-blue.svg)](https://github.com/yourusername/finflow-nosql)

## Built with the tools and technologies:

[![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)](https://www.json.org/)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white)](https://github.com/colinhacks/zod)
[![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![date-fns](https://img.shields.io/badge/date--fns-770C56?style=for-the-badge&logo=date-fns&logoColor=white)](https://date-fns.org/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)](https://react-hook-form.com/)

FinFlow is a modern financial management application built with a NoSQL database backend that helps users track transactions, manage accounts, and visualize spending patterns.

## Features

- **Transaction Management:** Create, view, update, and delete financial transactions
- **Account Management:** Manage multiple financial accounts
- **Filtering & Searching:** Advanced filtering options for transactions
- **Data Visualization:** Flow charts and reports for financial analysis
- **OpenAPI Integration:** Fully documented API with Swagger UI

## Project Structure

The project is structured into two main parts:

- `/api` - Backend API built with Hono
- `/dashboard` - Frontend application built with React and TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/finflow-nosql.git
   cd finflow-nosql
   ```

2. Install dependencies for both API and dashboard
   ```bash
   # Install API dependencies
   cd api
   npm install

   # Install dashboard dependencies
   cd ../dashboard
   npm install
   ```

3. Configure environment variables
   Create `.env` files in both the api and dashboard directories based on the provided examples.

### Running the Application

#### API
```bash
cd api
npm run dev
```

#### Dashboard
```bash
cd dashboard
npm run dev
```

The API will be available at http://localhost:8787 and the dashboard at http://localhost:3000.

## License

MIT