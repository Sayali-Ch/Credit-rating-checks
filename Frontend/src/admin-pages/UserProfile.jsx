import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../admin-components/ui/card";
import { Button } from "../admin-components/ui/button";
import { ArrowLeft, User, Briefcase, Settings, Loader2 } from 'lucide-react';
import UserProfileService, { getUserProfileFallback } from '../services/userService';

const UserProfile = () => {
  const { userId } = useParams(); // This comes from the URL parameter
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first, using the URL parameter as customerId
        let userData;
        try {
          userData = await UserProfileService.getUserProfile(userId);
        } catch (apiError) {
          // Fallback to mock data during development
          console.warn('API not available, using mock data:', apiError.message);
          userData = getUserProfileFallback(userId);
        }
        
        if (!userData) {
          throw new Error('User not found');
        }
        
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Profile</h2>
          <p className="text-gray-600">Please wait while we fetch the user information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/admin-dashboard/applications')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-6xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Header with back button */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin-dashboard/applications')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-200 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm hover:shadow-md border border-white/50"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back to Applications</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Customer Profile
                </h1>
                <p className="text-gray-600">Detailed information and loan application status</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-white/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">Active Profile</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <Card className="relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 backdrop-blur-sm">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 25px 25px, #3b82f6 2px, transparent 0), radial-gradient(circle at 75px 75px, #8b5cf6 2px, transparent 0)`,
                  backgroundSize: '100px 100px'
                }}></div>
              </div>
              
              <CardHeader className="relative pb-6 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-3 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg"></div>
                    <div className="absolute inset-0 h-3 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-50 blur-sm"></div>
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      Personal Information
                    </CardTitle>
                    <p className="text-sm text-gray-600 font-medium ml-11">Basic personal details and contact information</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative space-y-6">
                <div className="space-y-5">
                  <div className="group">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                    <div className="mt-2 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl border border-gray-200/50 shadow-sm group-hover:shadow-md transition-all duration-200">
                      <span className="text-gray-900 font-semibold text-lg">{user.name}</span>
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Email</label>
                    <div className="mt-2 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl border border-gray-200/50 shadow-sm group-hover:shadow-md transition-all duration-200">
                      <span className="text-gray-900 font-medium">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                    <div className="mt-2 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl border border-gray-200/50 shadow-sm group-hover:shadow-md transition-all duration-200">
                      <span className="text-gray-900 font-medium">{user.phone}</span>
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Address</label>
                    <div className="mt-2 p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl border border-gray-200/50 shadow-sm group-hover:shadow-md transition-all duration-200">
                      <span className="text-gray-900 font-medium">{user.address}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-1 w-12 rounded-full bg-green-600"></div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                      Employment Information
                    </CardTitle>
                    <p className="text-sm text-gray-600">Your current employment details</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Occupation</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900 font-medium">{user.occupation}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">PAN Card Number</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900 font-mono">{user.panCardNumber || user.pancardNumber || 'Not Available'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Annual Income</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900 font-semibold text-green-600">{user.annualIncome}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Settings */}
          <Card className="mt-8 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="h-1 w-12 rounded-full bg-purple-600"></div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-purple-600" />
                    Credit Score
                  </CardTitle>
                  <p className="text-sm text-gray-600">Current financial rating</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Credit Score Section */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Current Score</h3>
                    <p className="text-sm text-gray-600">Based on customer's financial history</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-blue-600">{user.creditScore}</div>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            user.creditScore >= 750 ? 'bg-green-500' :
                            user.creditScore >= 650 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min((user.creditScore / 900) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">out of 900</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
