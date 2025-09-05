import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import AnalyticsService, { getAnalyticsFallback } from '../services/analyticsService';
import ApplicationService, { getApplicationsFallback } from '../services/applicationService';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API first
      let analytics, applicationsData;
      try {
        analytics = await AnalyticsService.getDashboardAnalytics();
        applicationsData = await ApplicationService.getAllApplications();
      } catch (apiError) {
        // Fallback to mock data during development
        console.warn('API not available, using mock data:', apiError.message);
        analytics = getAnalyticsFallback();
        applicationsData = getApplicationsFallback();
      }
      
      setAnalyticsData(analytics);
      setApplications(applicationsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics data
  const totalUsers = analyticsData?.totalUsers || 0;
  const totalApplications = applications.length;
  
  // Calculate average credit score from applications
  const avgCreditScore = applications.length > 0 
    ? Math.round(applications.reduce((sum, app) => sum + app.creditScore, 0) / applications.length)
    : 0;
  
  // Calculate approval rate
  const approvedApplications = applications.filter(app => app.status === 'Approved').length;
  const approvalRate = totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Analytics</h2>
          <p className="text-gray-600">Please wait while we fetch the latest data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-red-800">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          )}

          {/* Page Header */}
          <div className="mb-10 text-center">
            <div className="mb-4 flex items-center justify-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
                <p className="mt-2 text-gray-600 text-lg">
                  Comprehensive insights into loan applications and credit performance
                </p>
              </div>
              <button
                onClick={fetchAnalyticsData}
                disabled={loading}
                className="btn-refresh"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="h-1 w-24 rounded-full mx-auto" style={{ backgroundColor: '#198ae6' }}></div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <DashboardCard
              title="Total Users"
              value={totalUsers.toLocaleString()}
              subtitle="registered users"
              trend={{ type: 'up', value: '+12%' }}
            />
            <DashboardCard
              title="Average Credit Score"
              value={avgCreditScore}
              subtitle="across all users"
              color="#22c55e"
              trend={{ type: 'up', value: '+2.3%' }}
            />
            <DashboardCard
              title="Total Applications"
              value={totalApplications.toLocaleString()}
              subtitle={`${applications.filter(app => app.status === 'Under Scrutiny').length} pending review`}
              color="#8b5cf6"
              trend={{ type: 'up', value: '+8.1%' }}
            />
            <DashboardCard
              title="Approval Rate"
              value={`${approvalRate}%`}
              subtitle={`${approvedApplications} approved applications`}
              color="#16a34a"
              trend={{ type: 'up', value: '+5.2%' }}
            />
          </div>

          {/* Analytics Charts */}
          <AnalyticsCharts 
            creditScoreData={analyticsData?.creditScoreDistribution || []}
            loanTypeData={analyticsData?.loanTypeBreakdown || []}
          />
        </div>
      </main>
    </div>
  );
};

export default Analytics;
