import React, { useState, useEffect } from "react";
import TopBar from "../components/Topbar";
import { user as mockUser } from "../data/user";

function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    occupation: "",
    pancardNumber: "",
    income: ""
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        name: "John Customer",
        email: "customer@demo.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, Anytown, ST 12345",
        occupation: "Software Engineer",
        pancardNumber: "BXER4568BVD",
        income: "$85,000"
      });
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleEdit() {
    setEditing(true);
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setUser(form);
      setSaving(false);
      setEditing(false);
      alert("Profile updated successfully!");
    }, 1000);
  }

  if (loading) return <div className="flex items-center justify-center h-96 text-lg text-gray-500">Loading profile...</div>;

  return (
    <>
      <TopBar />
  <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8 mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <p className="text-gray-500 mt-2">Manage your personal information and preferences</p>
          </div>
          <div className="mt-4 md:mt-0">
            {!editing ? (
              <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-blue-700 transition" onClick={handleEdit}>
                Edit Profile
              </button>
            ) : (
              <button className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-green-700 transition" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-blue-600 mb-2">Personal Information</h2>
            <p className="text-gray-400 mb-4">Your basic personal details</p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-600 mb-1">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${editing ? 'border-blue-400 bg-white' : 'border-gray-200 bg-gray-100'} focus:outline-none`} readOnly={!editing} />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-600 mb-1">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${editing ? 'border-blue-400 bg-white' : 'border-gray-200 bg-gray-100'} focus:outline-none`} readOnly={!editing} />
                </div>
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
    </>
  );
}

export default Profile;