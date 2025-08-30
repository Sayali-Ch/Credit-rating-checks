import React from 'react';
import CreditScoreSpeedometer from '../components/common/CreditScoreSpeedometer';
import Button from '../components/ui/Button';

export default function HomePage({ navigate }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Trusted{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Credit Companion
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Track, improve, and unlock your financial potential with our comprehensive credit monitoring platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('auth')}
                variant="primary"
                size="large"
              >
                Get Started Free
              </Button>
              <Button 
                onClick={() => navigate('features')}
                variant="outline"
                size="large"
              >
                Explore Features
              </Button>
            </div>
          </div>

          {/* Right Content - Credit Score Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Credit Score</h3>
                  <div className="text-5xl font-bold text-blue-600 mb-2">750</div>
                  <div className="text-sm text-gray-500">Excellent</div>
                </div>
                
                {/* Credit Score Speedometer */}
                <div className="mb-4">
                  <CreditScoreSpeedometer score={750} size="medium" showLabels={false} />
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Improvement Potential</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-semibold text-gray-900">750</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-lg font-semibold text-green-600">850</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
