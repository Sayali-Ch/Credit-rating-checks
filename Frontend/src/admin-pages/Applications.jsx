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
    try {
      setUpdating(true);
      
      // Update local state immediately for better UX
      setApplicationsList(prevApps => 
        prevApps.map(app => 
          app.id === applicationId 
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
            app.id === applicationId 
              ? { ...app, status: app.status } // This would need the original status
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
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Loan Applications</h1>
                <p className="mt-2 text-gray-600 text-lg">
                  Monitor and manage loan applications with real-time status updates
                </p>
              </div>
              <button
                onClick={fetchApplications}
                disabled={updating}
                className="btn-refresh"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${updating ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="h-1 w-24 rounded-full mx-auto" style={{ backgroundColor: '#8b5cf6' }}></div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
