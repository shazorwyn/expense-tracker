# Expense Tracker with Budget Insights

A modern, responsive expense tracker built with **React 19 + TypeScript**, **Vite**, **Firebase** (Auth + Firestore), **Tailwind CSS**, and **Chart.js**. Track income and expenses, visualize spending patterns, get automatic budget insights, and export reports as CSV or PDF.

## Features

- **Authentication** — email/password login & registration, protected routes, persistent sessions
- **Dashboard** — total balance, income, expenses, monthly summary chart, budget insights, recent transactions
- **Transactions** — add / edit / delete, search & filter, realtime sync via Firestore
- **Reports** — income vs. expense chart, category distribution pie charts, financial trend line chart, adjustable date range
- **Budget Insights** — automatic detection of spending increases, overspending, and category concentration
- **Export** — download transactions as CSV or PDF
- **Responsive** — works on desktop, tablet, and mobile

## Getting Started

### 1. Install dependencies

```bash
pnpm install
# or: npm install
```

### 2. Configure Firebase

Create a Firebase project at https://console.firebase.google.com, enable **Email/Password Authentication** and **Cloud Firestore**, then copy `.env.example` to `.env` and fill in your project's config:

```bash
cp .env.example .env
```

### 3. Deploy Firestore rules & indexes (optional but recommended)

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 4. Run the dev server

```bash
pnpm dev
```

App will be available at `http://localhost:5173`.

### 5. Build for production

```bash
pnpm build
```

## Project Structure

```text
expense-tracker/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── charts/         # IncomeExpenseChart, CategoryPieChart, MonthlyTrendChart
│   │   ├── layout/         # Navbar, Sidebar, DashboardLayout
│   │   ├── transactions/   # TransactionForm, TransactionRow
│   │   └── ui/             # Button, Input, Select, Card, Modal, Spinner, EmptyState
│   ├── context/            # AuthContext
│   ├── firebase/           # config.ts, auth.ts
│   ├── hooks/               # useAuth, useTransactions, useBudgetInsights
│   ├── pages/               # Login, Register, Dashboard, Transactions, Reports, Profile, NotFound
│   ├── routes/              # ProtectedRoute
│   ├── services/            # transactionService, userService, exportService
│   ├── types/                # shared TypeScript types
│   ├── utils/                # categories, formatters, insights
│   ├── App.tsx
│   └── main.tsx
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Firestore Data Model

**users/{uid}**
```ts
{ uid: string; name: string; email: string; }
```

**transactions/{id}**
```ts
{
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;       // yyyy-MM-dd
  notes?: string;
  createdAt: number;
}
```

## Tech Stack

React 19 · TypeScript · Vite · React Router DOM · Tailwind CSS · Chart.js / react-chartjs-2 · Firebase Auth & Firestore · React Hook Form · Zod · date-fns · PapaParse · jsPDF
