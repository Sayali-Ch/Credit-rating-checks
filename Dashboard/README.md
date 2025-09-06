# Admin Dashboard

A modern, responsive admin dashboard built with React, Vite, and TailwindCSS.

## Features

- **Analytics Dashboard**: Credit score distribution and loan type breakdown charts
- **Applications Management**: View and manage loan applications with real-time status
- **Responsive Design**: Mobile-friendly interface with TailwindCSS
- **Modular Architecture**: Easily integrable into existing React applications
- **TypeScript-Free**: Pure JavaScript implementation for simplicity

## Tech Stack

- **React** v19.1.1 - UI framework
- **Vite** v7.1.4 - Build tool and development server
- **TailwindCSS** v3.4.17 - Utility-first CSS framework
- **ShadCN UI** - High-quality, accessible UI components
- **React Router** v7.8.2 - Client-side routing
- **Recharts** v3.1.2 - Data visualization library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/atharva-adhapure/admin-dashboard.git
cd admin-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── AnalyticsCharts.jsx
│   ├── ApplicationsTable.jsx
│   ├── DashboardCard.jsx
│   └── Navbar.jsx
├── pages/              # Page components
│   ├── Analytics.jsx
│   └── Applications.jsx
├── data/               # Mock data
│   ├── applications.js
│   └── users.js
├── App.jsx             # Main application component
└── index.js            # Export module for integration
```

## Integration

This dashboard can be easily integrated into existing React applications. See `INTEGRATION.md` for detailed integration instructions.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT License
