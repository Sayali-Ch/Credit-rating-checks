import React, { useState, useEffect } from 'react';
import TopBar from '../components/Topbar.jsx';

function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    pancardNumber: '',
    income: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage (set during login)
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        occupation: user.occupation || '',
        pancardNumber: user.pan_card_number || '',
        income: user.annual_income || ''
      });
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Save the updated profile data
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      
      // Map form fields to database field names
      const updatedUser = { 
        ...user, 
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        occupation: form.occupation,
        pan_card_number: form.pancardNumber, // Map to database field name
        annual_income: form.income // Map to database field name
      };
      
      // Update localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      // Update backend database
      try {
        const response = await fetch('http://localhost:5000/update-profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            name: form.name,
            phone: form.phone,
            address: form.address,
            occupation: form.occupation,
            annual_income: form.income,
            pan_card_number: form.pancardNumber
          })
        });
        
        if (response.ok) {
          alert('Profile updated successfully!');
        } else {
          alert('Failed to update profile in database');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
      }
    }
    setEditing(false);
  };

  const handleCancel = () => {
    // Reset form to original data
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        occupation: user.occupation || '',
        pancardNumber: user.pan_card_number || '',
        income: user.annual_income || ''
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
                <p className="text-gray-500 mt-2">Manage your personal information and preferences</p>
              </div>
              <div className="flex gap-3">
                {editing ? (
                  <>
                    <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                      Save Changes
                    </button>
                    <button onClick={handleCancel} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-blue-600 mb-2">Personal Information</h2>
                <p className="text-gray-400 mb-4">Update your personal details here</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 mb-1">Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${editing ? 'border-blue-400 bg-white' : 'border-gray-200 bg-gray-100'} focus:outline-none`} readOnly={!editing} />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Email Address</label>
                    <input name="email" value={form.email} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${editing ? 'border-blue-400 bg-white' : 'border-gray-200 bg-gray-100'} focus:outline-none`} readOnly={!editing} />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${editing ? 'border-blue-400 bg-white' : 'border-gray-200 bg-gray-100'} focus:outline-none`} readOnly={!editing} />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Address</label>
                    <textarea name="address" value={form.address} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${editing ? 'border-blue-400 bg-white' : 'border-gray-200 bg-gray-100'} focus:outline-none`} rows={2} readOnly={!editing} />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-blue-600 mb-2">Employment Information</h2>
                <p className="text-gray-400 mb-4">Your current employment details</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 mb-1">Occupation</label>
                    <input name="occupation" value={form.occupation} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${editing ? 'border-blue-400 bg-white' : 'border-gray-200 bg-gray-100'} focus:outline-none`} readOnly={!editing} />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Pancard Number</label>
                    <input name="pancardNumber" value={form.pancardNumber} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${editing ? 'border-blue-400 bg-white' : 'border-gray-200 bg-gray-100'} focus:outline-none`} readOnly={!editing} />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Annual Income</label>
                    <input name="income" value={form.income} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${editing ? 'border-blue-400 bg-white' : 'border-gray-200 bg-gray-100'} focus:outline-none`} readOnly={!editing} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-blue-600 mb-2">Account Settings</h2>
            <p className="text-gray-400 mb-4">Manage your account preferences and security</p>
            <div className="flex gap-4">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">Change Password</button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">Two-Factor Auth</button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">Notification Settings</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
