# BongaCredit Admin Dashboard

A Neo-Brutalist admin dashboard for managing the BongaCredit platform. Built with React, Next.js, and Tailwind CSS.

## 🎨 Design Philosophy

**Neo-Brutalism / High-Contrast Utility**
- **Trust & Robustness**: Sturdy, high-contrast UI that feels like a serious financial tool.
- **Clarity**: Monospaced fonts and clear borders for error-free data reading.
- **Speed**: "No fluff" design for rapid decision making.

## 🚀 Features

- **Dashboard Overview**: Real-time metrics for revenue, transactions, and success rates.
- **Transaction Management**: Detailed table view with filtering and search.
- **Product Management**: Create, edit, and activate/deactivate products.
- **Secure Login**: High-contrast, secure authentication screen.

## 🛠 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Tables**: TanStack Table

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bongacredit-admin.git
   cd bongacredit-admin
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```bash
   VITE_API_URL=http://localhost:3000/api/v1
   ```
   *Note: In production, set `VITE_API_URL` to your deployed backend URL (e.g., `https://api.bongacredit.com/api/v1`).*

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Run development server**
   ```bash
   pnpm dev
   ```

## 📱 Pages

- `/` - Dashboard Overview
- `/transactions` - Transaction History
- `/products` - Product Management
- `/login` - Admin Login

## 📝 License

MIT
