import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
          <Button onClick={() => navigate('/applications')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <main className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Header with Back Button */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Button
                onClick={() => navigate('/applications')}
                variant="outline"
                className="hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">Manage your personal information and preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-1 w-12 rounded-full bg-blue-600"></div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Personal Information
                    </CardTitle>
                    <p className="text-sm text-gray-600">Your basic personal details</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900 font-medium">{user.name}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">{user.phone}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">{user.address}</span>
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
