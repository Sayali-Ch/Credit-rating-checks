import React, { useState } from 'react';
import Button from '../components/ui/Button';
import FAQItem from '../components/ui/FAQItem';
import ContactCard from '../components/cards/ContactCard';
import FormInput from '../components/forms/FormInput';

export default function SupportPage({ onNavigate }) { // eslint-disable-line no-unused-vars
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  });

  const faqCategories = [
    { id: 'general', name: 'General', icon: '❓' },
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'credit', name: 'Credit Score', icon: '📊' },
    { id: 'billing', name: 'Billing', icon: '💳' },
    { id: 'technical', name: 'Technical', icon: '🔧' }
  ];

  const faqs = {
    general: [
      {
        question: "What is CibilView and how does it work?",
        answer: "CibilView is a comprehensive credit monitoring platform that helps you track your credit score, get personalized improvement tips, and find suitable credit products. We connect with major credit bureaus to provide real-time updates on your credit health."
      },
      {
        question: "Is CibilView free to use?",
        answer: "Yes! CibilView offers a free plan that includes basic credit score monitoring, monthly updates, and essential tips. We also offer premium plans with advanced features like real-time alerts and detailed analytics."
      },
      {
        question: "How often is my credit score updated?",
        answer: "Your credit score is updated monthly for free users and in real-time for premium users. We fetch data from all major credit bureaus to ensure accuracy."
      }
    ],
    account: [
      {
        question: "How do I create an account?",
        answer: "Click on 'Login/Signup' button, select 'Customer', then choose 'Sign Up'. Fill in your details including name, email, phone number, and create a secure password."
      },
      {
        question: "I forgot my password. How can I reset it?",
        answer: "On the login page, click 'Forgot your password?' and enter your registered email. You'll receive a password reset link within minutes."
      },
      {
        question: "How can I update my personal information?",
        answer: "After logging in, go to your dashboard and click on 'Profile Settings' to update your personal information, contact details, and preferences."
      }
    ],
    credit: [
      {
        question: "Why is my credit score different from other platforms?",
        answer: "Different platforms may use different credit bureaus or scoring models. CibilView aggregates data from multiple bureaus to give you the most comprehensive view of your credit health."
      },
      {
        question: "How can I improve my credit score?",
        answer: "Our 'Tips' section provides personalized recommendations based on your credit profile. Common strategies include paying bills on time, keeping credit utilization low, and maintaining old credit accounts."
      },
      {
        question: "How long does it take to see credit score improvements?",
        answer: "Credit score improvements can take 30-90 days to reflect, depending on the actions taken. Consistent positive financial behavior will gradually improve your score over time."
      }
    ],
    billing: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay."
      },
      {
        question: "Can I cancel my premium subscription anytime?",
        answer: "Yes, you can cancel your premium subscription anytime from your account settings. You'll continue to have access to premium features until the end of your billing cycle."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer a 30-day money-back guarantee for premium subscriptions. If you're not satisfied, contact our support team for a full refund."
      }
    ],
    technical: [
      {
        question: "The app is not loading properly. What should I do?",
        answer: "Try refreshing your browser, clearing cache and cookies, or using a different browser. If the issue persists, contact our technical support team."
      },
      {
        question: "Is my data secure on CibilView?",
        answer: "Yes, we use bank-level encryption and security measures to protect your data. We're compliant with industry standards and never share your personal information with third parties."
      },
      {
        question: "Can I access CibilView on my mobile device?",
        answer: "Absolutely! CibilView is fully responsive and works seamlessly on all devices - desktop, tablet, and mobile phones through your web browser."
      }
    ]
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for contacting us! We\'ll get back to you within 24 hours.');
    setContactForm({
      name: '',
      email: '',
      category: 'general',
      subject: '',
      message: ''
    });
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get help with your account, understand credit scores, or contact our support team.
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-gray-600 mb-4">Find answers to commonly asked questions</p>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">Browse FAQ</Button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Get help via email within 24 hours</p>
            <Button variant="ghost" className="text-green-600 hover:text-green-700">Send Email</Button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
            <Button variant="ghost" className="text-purple-600 hover:text-purple-700">Start Chat</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            {/* FAQ Categories */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                {faqCategories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={selectedCategory === category.id ? "secondary" : "outline"}
                    size="small"
                    className="flex items-center space-x-2"
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* FAQ Content */}
            <div className="p-6">
              <div className="space-y-4">
                {faqs[selectedCategory].map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Contact Support</h2>
              <p className="text-gray-600 mt-1">Can't find what you're looking for? Send us a message.</p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Name"
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  placeholder="Your full name"
                  required
                />
                
                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <FormInput
                label="Category"
                type="select"
                name="category"
                value={contactForm.category}
                onChange={handleContactChange}
                options={[
                  { value: 'general', label: 'General Inquiry' },
                  { value: 'account', label: 'Account Issues' },
                  { value: 'credit', label: 'Credit Score Questions' },
                  { value: 'billing', label: 'Billing & Payments' },
                  { value: 'technical', label: 'Technical Support' }
                ]}
              />

              <FormInput
                label="Subject"
                type="text"
                name="subject"
                value={contactForm.subject}
                onChange={handleContactChange}
                placeholder="Brief description of your issue"
                required
              />

              <FormInput
                label="Message"
                type="textarea"
                name="message"
                value={contactForm.message}
                onChange={handleContactChange}
                placeholder="Please provide detailed information about your issue..."
                rows={5}
                required
              />

              <Button type="submit" variant="primary" size="large" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Other Ways to Reach Us</h2>
            <p className="opacity-90">We're here to help you succeed with your credit journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ContactCard
              icon="📧"
              title="Email Support"
              value="support@cibilview.com"
              description="Get help via email within 24 hours"
              color="blue"
              variant="gradient"
            />
            
            <ContactCard
              icon="📞"
              title="Phone Support"
              value="1800-123-4567"
              description="Call us during business hours"
              color="green"
              variant="gradient"
            />
            
            <ContactCard
              icon="🕒"
              title="Business Hours"
              value="Mon-Fri 9AM-6PM IST"
              description="Our support team availability"
              color="purple"
              variant="gradient"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Immediate Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <span className="mr-2">💬</span>
                <span>Live Chat: Available 24/7</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">⚡</span>
                <span>Email Response: Within 2 hours</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">📞</span>
                <span>Phone Support: Mon-Fri 9-6</span>
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">🌍</span>
                <span>Multi-language Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom spacing for better visibility */}
      <div className="h-16"></div>
    </div>
  );
}
