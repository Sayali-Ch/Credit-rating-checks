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
  const [loanApplications, setLoanApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`🔍 Fetching user profile for ID: ${userId}`);
        
        // Try to fetch from API first, using the URL parameter as customerId
        let userData;
        try {
          userData = await UserProfileService.getUserProfile(userId);
          console.log('✅ API response successful');
          console.log('📊 Raw API data:', userData);
          console.log('📊 Data fields:', {
            name: userData.name,
            email: userData.email,
            credit_score: userData.credit_score,
            annual_income: userData.annual_income,
            pan_card_number: userData.customer_id,
            phone: userData.phone,
            address: userData.address,
            occupation: userData.occupation
          });
        } catch (apiError) {
          // Fallback to mock data during development
          console.warn('API not available, using mock data:', apiError.message);
          userData = getUserProfileFallback(userId);
          console.log('📝 Fallback data:', userData);
        }
        
        if (!userData) {
          throw new Error(`User not found with ID: ${userId}`);
        }
        
        setUser(userData);

        // Fetch loan applications for this user
        try {
          const loanResponse = await fetch(`http://localhost:5000/api/loans/customer/${userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
            }
          });
          
          if (loanResponse.ok) {
            const loanData = await loanResponse.json();
            setLoanApplications(loanData.loans || []);
          } else {
            // Use mock loan data if API fails
            setLoanApplications([{
              _id: '1',
              loanType: 'Personal Loan',
              appliedDate: new Date(),
              status: 'Under Scrutiny',
              creditScore: userData.credit_score || 750,
              loanParameters: {
                existingDebts: 15000,
                employmentType: 'salaried',
                residencyStatus: 'owned',
                addressProof: 'yes'
              }
            }]);
          }
        } catch (loanError) {
          console.warn('Failed to fetch loan applications:', loanError);
          setLoanApplications([]);
        }
        
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
                      <span className="text-gray-900 font-mono">{user.customer_id || user.customer_id || user.customer_id || 'Not Available'}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Annual Income</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900 font-semibold text-green-600">
                        {user.annualIncome || user.annual_income || 'Not Available'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Credit Score Section - Enhanced */}
          <Card className="mt-8 shadow-xl border-0 bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 overflow-hidden">
            <CardHeader className="pb-6 bg-gradient-to-r from-purple-600/5 to-indigo-600/5">
              <div className="flex items-center space-x-3">
                <div className="h-1 w-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600"></div>
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
              {/* Enhanced Credit Score Display */}
              <div className="p-8 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-xl border border-purple-200/50 shadow-inner">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Current Score
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">Based on customer's financial history</p>
                </div>
                
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="text-6xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      {user.creditScore || user.credit_score || 'Loading...'}
                    </div>
                    <div className="absolute -top-2 -right-8 text-lg text-gray-500 font-medium">
                      out of 900
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>300</span>
                    <span className="font-semibold text-gray-700">Credit Score Range</span>
                    <span>900</span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        (user.creditScore || user.credit_score) >= 750 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                        (user.creditScore || user.credit_score) >= 650 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 
                        'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      style={{ width: `${Math.min((((user.creditScore || user.credit_score || 0) - 300) / 600) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 bg-white/70 rounded-lg border border-gray-200/50">
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Category</div>
                    <div className={`text-sm font-bold ${
                      (user.creditScore || user.credit_score) >= 750 ? 'text-green-600' :
                      (user.creditScore || user.credit_score) >= 650 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {(user.creditScore || user.credit_score) >= 750 ? 'Excellent' :
                       (user.creditScore || user.credit_score) >= 650 ? 'Good' : 'Fair'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white/70 rounded-lg border border-gray-200/50">
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Status</div>
                    <div className={`text-sm font-bold ${
                      (user.creditScore || user.credit_score) >= 650 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(user.creditScore || user.credit_score) >= 650 ? 'Loan Eligible' : 'Limited Options'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white/70 rounded-lg border border-gray-200/50">
                    <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Percentile</div>
                    <div className="text-sm font-bold text-blue-600">
                      {(user.creditScore || user.credit_score) ? 
                        Math.round((((user.creditScore || user.credit_score) - 300) / 600) * 100) : 0}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loan Applications Section */}
        {loanApplications.length > 0 && (
          <div className="mt-8">
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20">
              <CardHeader className="bg-gradient-to-r from-green-600/5 to-emerald-600/5">
                <div className="flex items-center space-x-4">
                  <div className="h-3 w-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg"></div>
                  <div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      Loan Applications
                    </CardTitle>
                    <p className="text-sm text-gray-600 font-medium ml-11">Active and past loan applications with details</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {loanApplications.map((loan, index) => {
                  // Calculate loan amount from loan data
                  const loanAmount = loan.loan_data?.loanAmount || 
                                   loan.loan_data?.loanAmount || 
                                   loan.loanParameters?.loanAmount || 
                                   'Not specified';
                  
                  // Determine eligibility based on credit score and loan type
                  const creditRequirements = {
                    'home-loan': 700,
                    'Home Loan': 700,
                    'car-loan': 650,
                    'Car Loan': 650,
                    'personal-loan': 600,
                    'Personal Loan': 600,
                    'education-loan': 580,
                    'Education Loan': 580,
                    'business-loan': 750,
                    'Business Loan': 750
                  };
                  
                  const requiredScore = creditRequirements[loan.loanType] || creditRequirements[loan.loan_type] || 650;
                  const currentScore = loan.creditScore || loan.credit_score || user.creditScore || user.credit_score || 0;
                  const isEligible = currentScore >= requiredScore;
                  const eligibilityStatus = isEligible ? 'Eligible' : 'Not Eligible';
                  
                  return (
                    <div key={loan._id || index} className="p-6 bg-gradient-to-r from-gray-50 to-green-50/50 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{loan.loanType || loan.loan_type}</h3>
                          <p className="text-sm text-gray-600">Applied on: {new Date(loan.appliedDate || loan.applied_date).toLocaleDateString()}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          eligibilityStatus === 'Eligible' ? 'bg-green-100 text-green-800 border border-green-200' :
                          'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {eligibilityStatus}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white/80 p-3 rounded-lg border border-gray-200/50">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Credit Score</label>
                          <div className="text-lg font-semibold text-blue-600">{currentScore || 'N/A'}</div>
                          <div className="text-xs text-gray-500">Required: {requiredScore}</div>
                        </div>
                        <div className="bg-white/80 p-3 rounded-lg border border-gray-200/50">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Loan Amount</label>
                          <div className="text-lg font-semibold text-green-600">
                            {typeof loanAmount === 'number' ? `₹${loanAmount.toLocaleString()}` : loanAmount}
                          </div>
                        </div>
                        <div className="bg-white/80 p-3 rounded-lg border border-gray-200/50">
                          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Application ID</label>
                          <div className="text-sm font-mono text-gray-700">{loan._id || 'N/A'}</div>
                        </div>
                      </div>

                      {/* Eligibility Details */}
                      <div className="mb-4 p-4 bg-white/60 rounded-lg border border-gray-200/50">
                        <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Eligibility Assessment</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${isEligible ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm font-medium text-gray-700">
                              Credit Score: {currentScore || 'N/A'} / {requiredScore} required
                            </span>
                          </div>
                          <div className={`text-sm font-bold ${isEligible ? 'text-green-600' : 'text-red-600'}`}>
                            {isEligible ? '✓ Meets Requirements' : '✗ Below Requirements'}
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${isEligible ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${currentScore ? Math.min((currentScore / requiredScore) * 100, 100) : 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Loan Parameters */}
                      {(loan.loanParameters || loan.loanData || loan.loan_data) && (
                        <div className="mt-4 p-4 bg-white/60 rounded-lg border border-gray-200/50">
                          <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Loan Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(loan.loanParameters || loan.loanData || loan.loan_data || {}).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-sm text-gray-600 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/_/g, ' ')}:
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {typeof value === 'number' && (key.includes('income') || key.includes('debt') || key.includes('price') || key.includes('amount') || key.includes('value') || key.includes('payment'))
                                    ? `₹${value.toLocaleString()}` 
                                    : value
                                  }
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
