import React, { useState } from 'react';
import Button from '../components/ui/Button';
import FormInput from '../components/forms/FormInput';

export default function AuthPage({ userType, setUserType, isLogin, setIsLogin, onNavigate }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [employeeForm, setEmployeeForm] = useState({ email: '', password: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (e) => {
    setEmployeeForm({ ...employeeForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      if (res.status === 200) {
        // Store user data in localStorage
        localStorage.setItem('userEmail', form.email);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Show success modal
        setSuccessMessage(`Welcome back, ${data.user.name || 'User'}! Login successful.`);
        setShowSuccessModal(true);
        
        // Navigate to dashboard after a short delay
        setTimeout(() => {
          setShowSuccessModal(false);
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setErrorMessage(data.message || 'Login failed. Please check your credentials.');
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 3000);
      }
    } catch (err) {
      setErrorMessage('Server error. Please try again later.');
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
    }
  };

  const handleEmployeeLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: employeeForm.email, password: employeeForm.password })
      });
      const data = await res.json();
      if (res.status === 200) {
        // Store admin data in localStorage
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        localStorage.setItem('userType', 'employee');
        
        // Show success modal
        setSuccessMessage(`Welcome back, ${data.admin.name || 'Administrator'}! Login successful.`);
        setShowSuccessModal(true);
        
        // Navigate to admin dashboard after a short delay
        setTimeout(() => {
          setShowSuccessModal(false);
          console.log('Redirecting to admin dashboard...');
          window.location.href = '/admin-dashboard';
        }, 2000);
      } else {
        setErrorMessage(data.message || 'Admin login failed. Please check your credentials.');
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 3000);
      }
    } catch (err) {
      setErrorMessage('Server error. Please try again later.');
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {userType === 'customer' ? 
              (isLogin ? 'Welcome back!' : 'Create your account') : 
              'Employee Login'
            }
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {userType === 'customer' ? 
              (isLogin ? 'Sign in to access your credit dashboard' : 'Start your free credit monitoring journey') :
              'Sign in to access the employee dashboard'
            }
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <Button
              onClick={() => {
                setUserType('customer');
                setIsLogin(true);
              }}
              variant={userType === 'customer' ? 'secondary' : 'ghost'}
              size="small"
              className="flex-1"
            >
              Customer
            </Button>
            <Button
              onClick={() => {
                setUserType('employee');
                setIsLogin(true);
              }}
              variant={userType === 'employee' ? 'secondary' : 'ghost'}
              size="small"
              className="flex-1"
            >
              Bank Employee
            </Button>
          </div>

          <form className="space-y-6" onSubmit={userType === 'customer' && isLogin ? handleLogin : userType === 'employee' ? handleEmployeeLogin : (e) => e.preventDefault()}>
            {/* Name Field (Customer signup only) */}
            {userType === 'customer' && !isLogin && (
              <FormInput
                label="Full Name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
              />
            )}

            {/* Employee Email Field (Employee login only) */}
            {userType === 'employee' && (
              <FormInput
                label="Admin Email"
                type="email"
                name="email"
                placeholder="Enter your admin email"
                required
                value={employeeForm.email}
                onChange={handleEmployeeChange}
              />
            )}

            {/* Email Field (Customer only) */}
            {userType === 'customer' && (
              <FormInput
                label="Email Address"
                type="email"
                name="email"
                placeholder="Enter your email address"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
              />
            )}

            {/* Phone Field (Customer signup only) */}
            {userType === 'customer' && !isLogin && (
              <FormInput
                label="Mobile Number"
                type="tel"
                name="phone"
                placeholder="Enter your mobile number"
                required
              />
            )}

            {/* Password Field */}
            <FormInput
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              value={userType === 'employee' ? employeeForm.password : form.password}
              onChange={userType === 'employee' ? handleEmployeeChange : handleChange}
            />

            {/* Confirm Password Field (Customer signup only) */}
            {userType === 'customer' && !isLogin && (
              <FormInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                required
              />
            )}

            {/* Remember Me & Forgot Password (Login only) */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            {/* Terms & Conditions (Customer signup only) */}
            {userType === 'customer' && !isLogin && (
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="w-full"
              >
                {userType === 'employee' ? 'Employee Sign In' : 
                 (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </div>
          </form>

          {/* Toggle Login/Signup (Customer only) */}
          {userType === 'customer' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <Button
                  onClick={() => setIsLogin(!isLogin)}
                  variant="ghost"
                  size="small"
                  className="ml-1 text-blue-600 hover:text-blue-700"
                >
                  {isLogin ? 'Sign up here' : 'Sign in here'}
                </Button>
              </p>
            </div>
          )}

          {/* Employee Account Note */}
          {userType === 'employee' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Employee accounts are created by system administrators.
                <br />
                Contact IT support if you need access.
              </p>
            </div>
          )}
        </div>

        {/* Security Badge */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Your data is secured with 256-bit SSL encryption</span>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform animate-pulse">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">Login Successful!</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              
              {/* Loading Animation */}
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300">
            <div className="text-center">
              {/* Error Icon */}
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              {/* Error Message */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">Login Failed</h3>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              
              {/* Close Button */}
              <button 
                onClick={() => setShowErrorModal(false)}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
