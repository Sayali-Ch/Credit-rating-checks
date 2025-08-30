import React from 'react';
import FeatureCard from '../components/cards/FeatureCard';
import StatCard from '../components/cards/StatCard';
import Button from '../components/ui/Button';

export default function FeaturesPage({ onNavigate }) {
  const features = [
    {
      title: "Real-time Credit Monitoring",
      description: "Get instant alerts when changes occur to your credit report. Stay informed about your credit health 24/7.",
      icon: "📊",
      color: "blue"
    },
    {
      title: "Personalized Credit Tips",
      description: "Receive customized recommendations based on your credit profile to improve your score effectively.",
      icon: "💡",
      color: "green"
    },
    {
      title: "Multi-Bureau Reports",
      description: "Access reports from all major credit bureaus in one place for a comprehensive view of your credit.",
      icon: "📋",
      color: "purple"
    },
    {
      title: "Credit Score Simulator",
      description: "See how different financial decisions might impact your credit score before you make them.",
      icon: "🎯",
      color: "orange"
    },
    {
      title: "Identity Theft Protection",
      description: "Advanced security monitoring to protect your personal information and detect suspicious activity.",
      icon: "🔒",
      color: "red"
    },
    {
      title: "Financial Goal Tracking",
      description: "Set and track your financial goals with our intelligent progress monitoring system.",
      icon: "🎪",
      color: "indigo"
    }
  ];

  const stats = [
    { value: "100K+", label: "Active Users", color: "blue" },
    { value: "750+", label: "Average Score Improvement", color: "green" },
    { value: "99.9%", label: "Uptime Guarantee", color: "purple" },
    { value: "24/7", label: "Customer Support", color: "orange" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Your Credit Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover all the tools and insights you need to take control of your credit health and achieve your financial goals.
          </p>
          <Button 
            onClick={() => onNavigate('auth')}
            variant="primary"
            size="large"
          >
            Start Free Trial
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Trusted by Thousands
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                label={stat.label}
                color={stat.color}
              />
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">How CibilView Works</h2>
            <p className="text-lg opacity-90">
              Getting started with your credit monitoring journey is simple and secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Sign Up Securely</h3>
              <p className="opacity-90">Create your account with bank-level security in just 2 minutes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Your Score</h3>
              <p className="opacity-90">Access your credit score and detailed report from all major bureaus</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Improve & Monitor</h3>
              <p className="opacity-90">Follow personalized tips and track your progress in real-time</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => onNavigate('auth')}
              variant="white-primary"
              size="large"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </div>
      {/* Bottom spacing for better visibility */}
      <div className="h-16"></div>
    </div>
  );
}
