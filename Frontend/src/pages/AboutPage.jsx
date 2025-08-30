import React from 'react';
import Button from '../components/ui/Button';
import StatCard from '../components/cards/StatCard';
import ContactCard from '../components/cards/ContactCard';

export default function AboutPage({ onNavigate }) {
  const team = [
    {
      name: "Rajesh Kumar",
      role: "CEO & Founder",
      image: "👨‍💼",
      description: "Former banking executive with 15+ years in credit risk management."
    },
    {
      name: "Priya Sharma",
      role: "CTO",
      image: "👩‍💻",
      description: "Tech leader specializing in fintech security and data analytics."
    },
    {
      name: "Amit Singh",
      role: "Head of Product",
      image: "👨‍🎯",
      description: "Product strategist focused on user experience and financial wellness."
    },
    {
      name: "Sneha Patel",
      role: "Lead Data Scientist",
      image: "👩‍🔬",
      description: "Expert in credit modeling and machine learning algorithms."
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "CibilView was established with a mission to democratize credit monitoring in India."
    },
    {
      year: "2021",
      title: "First 10K Users",
      description: "Reached our first milestone of 10,000 active users within the first year."
    },
    {
      year: "2022",
      title: "Multi-Bureau Integration",
      description: "Integrated with all major credit bureaus to provide comprehensive credit reports."
    },
    {
      year: "2023",
      title: "AI-Powered Insights",
      description: "Launched machine learning algorithms for personalized credit improvement recommendations."
    },
    {
      year: "2024",
      title: "100K+ Users",
      description: "Crossed 100,000 users and helped improve over 50,000 credit scores."
    },
    {
      year: "2025",
      title: "Advanced Features",
      description: "Introduced real-time monitoring and enhanced security features."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About CibilView</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to make credit monitoring accessible, transparent, and empowering for every Indian.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At CibilView, we believe that everyone deserves access to their financial information and the tools to improve it. 
                We're committed to breaking down barriers and making credit health monitoring simple, transparent, and actionable.
              </p>
              <p className="text-gray-600 mb-6">
                Our platform empowers millions of Indians to take control of their financial future through real-time credit monitoring, 
                personalized insights, and educational resources.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  value="100K+"
                  label="Active Users"
                  color="blue"
                />
                <StatCard
                  value="50K+"
                  label="Scores Improved"
                  color="green"
                />
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h3>
              <p className="text-gray-600">
                To become India's most trusted credit health platform, empowering every citizen with the knowledge and tools 
                to achieve their financial goals.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust & Security</h3>
              <p className="text-gray-600">Your financial data is protected with bank-level security and complete transparency.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">We strive for excellence in every feature, ensuring accuracy and reliability.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer First</h3>
              <p className="text-gray-600">Every decision we make is centered around improving our users' financial well-being.</p>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Journey</h2>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{milestone.year}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-4xl mb-3">{member.image}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Recognition & Awards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-semibold text-gray-900 mb-1">Best Fintech Startup 2023</h3>
              <p className="text-sm text-gray-600">India Fintech Awards</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-semibold text-gray-900 mb-1">Top Rated Credit App</h3>
              <p className="text-sm text-gray-600">App Store & Play Store</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎖️</div>
              <h3 className="font-semibold text-gray-900 mb-1">Customer Choice Award</h3>
              <p className="text-sm text-gray-600">Financial Services Excellence</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Join the CibilView Family</h2>
          <p className="text-lg mb-6 opacity-90">
            Be part of a community that's committed to financial empowerment and credit health improvement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => onNavigate('auth')}
              variant="white-primary"
              size="large"
            >
              Start Your Journey
            </Button>
            <Button 
              onClick={() => onNavigate('support')}
              variant="white-outline"
              size="large"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
      {/* Bottom spacing for better visibility */}
      <div className="h-16"></div>
    </div>
  );
}
