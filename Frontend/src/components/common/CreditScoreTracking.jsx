import React from "react";
import CreditScoreSpeedometer from './CreditScoreSpeedometer';

export default function CreditScoreTracking() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Credit Score Tracking
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Monitor your credit score trends and understand the factors that impact your financial health.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Score Display */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">680</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Good Credit</h3>
                <p className="text-gray-600 mb-4">You're building excellent credit habits</p>
              </div>
              
              {/* Credit Score Speedometer */}
              <div className="max-w-sm mx-auto mb-6">
                <CreditScoreSpeedometer score={680} size="medium" showLabels={false} />
              </div>
              
              <div className="flex justify-center space-x-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Full Report
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:border-gray-400 transition-colors">
                  Get Improvement Tips
                </button>
              </div>
            </div>
          </div>

          {/* Credit Factors */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Credit Factors</h3>
            <div className="space-y-4">
              {[
                { name: 'Payment History', score: 95, color: 'bg-green-500' },
                { name: 'Credit Utilization', score: 78, color: 'bg-blue-500' },
                { name: 'Length of Credit History', score: 85, color: 'bg-purple-500' },
                { name: 'Credit Mix', score: 72, color: 'bg-orange-500' },
                { name: 'New Credit', score: 88, color: 'bg-indigo-500' },
              ].map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {factor.name}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {factor.score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${factor.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${factor.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
