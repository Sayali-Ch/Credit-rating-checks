import React, { useState } from "react";

const UserOnboardingForm = () => {
    const [form, setForm] = useState({
        aadharNumber: "",
        name: "",
        email: "",
        mobile: "",
        dob: "",
        age: "",
        gender: "",
        applicantFullName: "",
        parentMobile: "",
        maritalStatus: "",
        familyIncome: "",
        hasIncomeCert: "Yes",
        hasBarcode: "No",
        issuingAuthority: "",
        incomeCertFile: null,
        incomeCertNo: "",
        aadhar: null,
        pan: null,
        income: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        alert("Form submitted!");
    };

    return (
        <form className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow space-y-8" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-black-600 mb-4">User Signup Details</h2>
            <div className="border border-blue-200 rounded-xl p-6 bg-blue-50 mb-8">
                <div className="flex items-center mb-6">
                    <div className="text-lg font-semibold text-blue-700 mr-4">Personal Details</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Name<span className="text-red-500">*</span></label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Email ID<span className="text-red-500">*</span></label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Mobile Number<span className="text-red-500">*</span></label>
                        <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Date of Birth (as per Aadhaar)<span className="text-red-500">*</span></label>
                        <input type="date" name="dob" value={form.dob} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Age<span className="text-red-500">*</span></label>
                        <input type="number" name="age" value={form.age} onChange={handleChange} required min="0" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Gender<span className="text-red-500">*</span></label>
                        <select name="gender" value={form.gender} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* Income Details Section */}
            <div className="border border-blue-200 rounded-xl p-6 bg-blue-50 mb-8">
                <div className="flex items-center mb-6">
                    <div className="text-lg font-semibold text-blue-700 mr-4">Income Details</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Annual Income<span className="text-red-500">*</span></label>
                        <input type="number" name="familyIncome" value={form.familyIncome} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Do you have Income Certificate?<span className="text-red-500">*</span></label>
                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="hasIncomeCert" value="Yes" checked={form.hasIncomeCert === "Yes"} onChange={handleChange} required /> Yes
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="hasIncomeCert" value="No" checked={form.hasIncomeCert === "No"} onChange={handleChange} required /> No
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Issuing Authority<span className="text-red-500">*</span></label>
                        <select name="issuingAuthority" value={form.issuingAuthority} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200">
                            <option value="">Select Authority</option>
                            <option value="Tahsildar">Tahsildar</option>
                            <option value="Naib Tahsildar">Naib Tahsildar</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Income Certificate<span className="text-red-500">*</span></label>
                        <input type="file" name="incomeCertFile" accept="application/pdf,image/*" onChange={handleChange} required className="w-full" />
                        <div className="mt-2 text-xs text-red-600">Even if the bar code is available, please upload the document.</div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Income Certificate No<span className="text-red-500">*</span></label>
                        <input type="text" name="incomeCertNo" value={form.incomeCertNo} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                </div>
            </div>
            {/* Bank Details Section */}
    
            <div className="border border-blue-200 rounded-xl p-6 bg-blue-50 mb-8">
                <div className="flex items-center mb-6">
                    <div className="text-lg font-semibold text-blue-700 mr-4">Aadhaar Card Details</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Aadhaar Card Number</label>
                        <input type="text" name="aadharNumber" value={form.aadharNumber || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Aadhaar Certificate<span className="text-red-500">*</span></label>
                        <input type="file" name="aadhar" accept="application/pdf,image/*" onChange={handleChange} required className="w-full" />
                    </div>
                </div>
            </div>

            <div className="border border-blue-200 rounded-xl p-6 bg-blue-50 mb-8">
                <div className="flex items-center mb-6">
                    <div className="text-lg font-semibold text-blue-700 mr-4">Pan Card Details</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Pan Card Number</label>
                        <input type="text" name="panNumber" value={form.panNumber || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Pan Card<span className="text-red-500">*</span></label>
                        <input type="file" name="panCard" accept="application/pdf,image/*" onChange={handleChange} required className="w-full" />
                    </div>
                </div>
            </div>

            <div className="border border-blue-200 rounded-xl p-6 bg-blue-50 mb-8">
                <div className="flex items-center mb-6">
                    <div className="text-lg font-semibold text-blue-700 mr-4">Employment Details</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Occupation</label>
                        <input type="text" name="occupation" value={form.occupation || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Is Salaried?</label>
                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="isSalaried" value="Yes" checked={form.isSalaried === "Yes"} onChange={handleChange} /> Yes
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="isSalaried" value="No" checked={form.isSalaried === "No"} onChange={handleChange} /> No
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">Submit</button>
        </form>
    );
};

export default UserOnboardingForm;
