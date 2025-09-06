import React, { useState, useEffect } from 'react';
import DashboardCard from '../admin-components/DashboardCard';
import AnalyticsCharts from '../admin-components/AnalyticsCharts';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-5xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-sm flex items-center justify-between backdrop-blur-sm">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-full mr-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full p-1 transition-all duration-200"
              >
                ×
              </button>
            </div>
          )}

          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 flex items-center justify-center space-x-4">
              <div className="relative max-w-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                    Analytics Dashboard
                  </h1>
                  <p className="mt-3 text-gray-600 text-lg font-medium">
                    Comprehensive insights into loan applications and credit performance
                  </p>
                </div>
              </div>
              <button
                onClick={fetchAnalyticsData}
                disabled={loading}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh data"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center space-x-2">
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </div>
              </button>
            </div>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto shadow-lg"></div>
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
