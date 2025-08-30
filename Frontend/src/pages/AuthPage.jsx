import React from 'react';
import Button from '../components/ui/Button';
import FormInput from '../components/forms/FormInput';

export default function AuthPage({ userType, setUserType, isLogin, setIsLogin }) {
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

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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

            {/* Employee ID Field (Employee login only) */}
            {userType === 'employee' && (
              <FormInput
                label="Employee ID"
                type="text"
                name="employeeId"
                placeholder="Enter your employee ID"
                required
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
    </div>
  );
}
