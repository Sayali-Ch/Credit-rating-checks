import React, { useState, useEffect } from 'react';
import ApplicationsTable from '../admin-components/ApplicationsTable';
import DashboardCard from '../admin-components/DashboardCard';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import ApplicationService, { getApplicationsFallback } from '../services/applicationService';

const Applications = () => {
  const [applicationsList, setApplicationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching applications from API...');
      
      // Try to fetch from API first
      let applicationsData;
      try {
        applicationsData = await ApplicationService.getAllApplications();
        console.log('✅ API Success! Fetched', applicationsData.length, 'applications');
        console.log('📊 Sample data:', applicationsData[0]);
      } catch (apiError) {
        console.error('❌ API Error:', apiError.message);
        console.log('🔄 Using fallback data...');
        // Fallback to mock data during development
        applicationsData = getApplicationsFallback();
      }
      
      setApplicationsList(applicationsData);
    } catch (err) {
      console.error('❌ Fetch Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle status change with database update
  const handleStatusChange = async (applicationId, newStatus) => {
    // Store the original status for potential revert
    const originalApplication = applicationsList.find(app => app._id === applicationId);
    const originalStatus = originalApplication?.status;

    try {
      setUpdating(true);
      
      // Update local state immediately for better UX
      setApplicationsList(prevApps => 
        prevApps.map(app => 
          app._id === applicationId 
            ? { ...app, status: newStatus }
            : app
        )
      );

      // Try to update in database
      try {
        await ApplicationService.updateApplicationStatus(applicationId, newStatus);
        console.log(`Successfully updated application ${applicationId} to status: ${newStatus}`);
      } catch (apiError) {
        // If API fails, revert the local change
        console.warn('Failed to update in database:', apiError.message);
        setApplicationsList(prevApps => 
          prevApps.map(app => 
            app._id === applicationId 
              ? { ...app, status: originalStatus } // Revert to original status
              : app
          )
        );
        throw apiError;
      }
    } catch (err) {
      console.error('Error updating application status:', err);
      // Show error notification to user
      setError('Failed to update application status. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setUpdating(false);
    }
  };

  // Calculate statistics
  const totalApplications = applicationsList.length;
  const approvedCount = applicationsList.filter(app => app.status === 'Approved').length;
  const pendingCount = applicationsList.filter(app => app.status === 'Under Scrutiny').length;
  const rejectedCount = applicationsList.filter(app => app.status === 'Rejected').length;
  
  const approvalRate = totalApplications > 0 ? Math.round((approvedCount / totalApplications) * 100) : 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Applications</h2>
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
          <div className="mb-12 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-6 flex items-center justify-center space-x-4">
                <div className="relative max-w-3xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/50">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight mb-4">
                      Loan Applications
                    </h1>
                    <p className="text-gray-600 text-xl font-medium leading-relaxed">
                      Monitor and manage loan applications with real-time status updates
                    </p>
                  </div>
                </div>
                <button
                  onClick={fetchApplications}
                  disabled={updating}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh data"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="relative flex items-center space-x-2">
                    <RefreshCw className={`w-6 h-6 ${updating ? 'animate-spin' : ''}`} />
                    <span className="text-lg">Refresh</span>
                  </div>
                </button>
              </div>
              <div className="h-1 w-40 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mx-auto shadow-lg"></div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <DashboardCard
              title="Total Applications"
              value={totalApplications.toLocaleString()}
              subtitle="lifetime applications"
              color="#198ae6"
              trend={{ type: 'up', value: '+15.3%' }}
            />
            <DashboardCard
              title="Approved"
              value={approvedCount.toLocaleString()}
              subtitle={`${approvalRate}% approval rate`}
              color="#22c55e"
              trend={{ type: 'up', value: '+8.7%' }}
            />
            <DashboardCard
              title="Pending Review"
              value={pendingCount.toLocaleString()}
              subtitle="awaiting decision"
              color="#f59e0b"
              trend={{ type: 'neutral', value: 'stable' }}
            />
            <DashboardCard
              title="Rejected"
              value={rejectedCount.toLocaleString()}
              subtitle="applications declined"
              color="#ef4444"
              trend={{ type: 'down', value: '-3.2%' }}
            />
          </div>

          {/* Applications Table */}
          <ApplicationsTable 
            applications={applicationsList} 
            onStatusChange={handleStatusChange}
          />
        </div>
      </main>
    </div>
  );
};

export default Applications;
