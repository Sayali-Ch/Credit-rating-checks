import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Briefcase, Settings, Loader2, Edit, Save, X } from 'lucide-react';
import UserProfileService, { getUserProfileFallback } from '../../services/user/userProfileService';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Get current user from auth context or localStorage
  const currentUserId = localStorage.getItem('userId') || '1'; // Default for demo

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first
        let userData;
        try {
          userData = await UserProfileService.getUserProfile(currentUserId);
        } catch (apiError) {
          // Fallback to mock data during development
          console.warn('API not available, using mock data:', apiError.message);
          userData = getUserProfileFallback(currentUserId);
        }
        
        if (!userData) {
          throw new Error('Profile not found');
        }
        
        setUser(userData);
        setFormData(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUserId]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedUser = await UserProfileService.updateUserProfile(currentUserId, formData);
      setUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error (show toast, etc.)
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Profile...</h2>
          <p className="text-gray-600">Please wait while we fetch your information.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/user/dashboard')} className="bg-blue-600 hover:bg-blue-700">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <main className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* User Header */}
          <div className="mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">View and manage your personal information</p>
            </div>
            <div className="flex justify-center mt-6">
              {!editing ? (
                <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/50">
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
                    {editing ? (
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900 font-medium">{user.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    {editing ? (
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900">{user.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900">{user.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    {editing ? (
                      <textarea
                        value={formData.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900">{user.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50/50">
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
                    {editing ? (
                      <input
                        type="text"
                        value={formData.occupation || ''}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                        className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900 font-medium">{user.occupation}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pancard Number</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900 font-mono">{user.pancardNumber}</span>
                      <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Annual Income</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.annualIncome || ''}
                        onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                        className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., $95,000"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-900 font-semibold text-green-600">{user.annualIncome}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Credit Score Section (Read-only for users) */}
          <Card className="mt-8 shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/50">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="h-1 w-12 rounded-full bg-purple-600"></div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-purple-600" />
                    Credit Information
                  </CardTitle>
                  <p className="text-sm text-gray-600">Your current credit rating and loan eligibility</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                <div>
                  <p className="text-sm font-medium text-gray-700">Current Credit Score</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{user.creditScore}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {user.creditScore >= 750 ? 'Excellent' : 
                     user.creditScore >= 700 ? 'Good' : 
                     user.creditScore >= 650 ? 'Fair' : 'Poor'} Credit Rating
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user.creditScore >= 750 ? 'bg-green-100 text-green-800' :
                    user.creditScore >= 700 ? 'bg-blue-100 text-blue-800' :
                    user.creditScore >= 650 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.creditScore >= 700 ? 'Loan Eligible' : 'Improve Score'}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Updated monthly</p>
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
