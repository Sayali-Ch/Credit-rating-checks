// Main exports for the Admin Dashboard module
export { default as App } from './App';
export { AdminDashboard } from './App';

// Component exports
export { default as Navbar } from './components/Navbar';
export { default as DashboardCard } from './components/DashboardCard';
export { default as AnalyticsCharts } from './components/AnalyticsCharts';
export { default as ApplicationsTable } from './components/ApplicationsTable';

// Page exports
export { default as Analytics } from './pages/Analytics';
export { default as Applications } from './pages/Applications';

// UI Component exports
export { Button } from './components/ui/button';
export { Badge } from './components/ui/badge';
export { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
export { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
export { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from './components/ui/table';

// Data exports
export { users, creditScoreDistribution, loanTypeBreakdown } from './data/users';
export { applications } from './data/applications';
