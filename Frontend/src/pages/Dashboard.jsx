import React, { useEffect, useState } from "react";

function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [creditScore, setCreditScore] = useState(null);
    const [creditStatus, setCreditStatus] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            try {
                const user = JSON.parse(storedUserData);
                setUserData(user);
                setCreditScore(user.credit_score || user.Credit_Score);
                
                // Set credit status based on score
                const score = user.credit_score || user.Credit_Score;
                if (score >= 750) setCreditStatus("Excellent");
                else if (score >= 700) setCreditStatus("Good");
                else if (score >= 650) setCreditStatus("Fair");
                else setCreditStatus("Poor");
                
                setLoading(false);
            } catch (error) {
                console.error('Error parsing user data:', error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-2">
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 text-center">
                    {userData?.name ? `Welcome, ${userData.name}` : 'Dashboard'}
                </h1>
                <p className="text-lg text-gray-500 text-center mt-1">Monitor your credit score and loan applications</p>
            </div>

            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Credit Score Card */}
                    <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center min-h-[420px] border border-gray-200">
                        <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center"><svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 0 1 4-4h2m-6 6h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" /></svg>Credit Score Analysis</h2>
                        <p className="text-gray-500 mb-6 text-center">Your current credit standing</p>
                        <div className="mb-4">
                            {/* Speedometer SVG */}
                            <svg width="140" height="80" viewBox="0 0 140 80">
                                <path d="M20,70 A50,50 0 0,1 120,70" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                                <path d="M20,70 A50,50 0 0,1 120,70" fill="none" stroke="#a78bfa" strokeWidth="12" strokeDasharray="100" strokeDashoffset="20" />
                                <line x1="70" y1="70" x2="105" y2="35" stroke="#a78bfa" strokeWidth="4" />
                                <circle cx="70" cy="70" r="6" fill="#a78bfa" />
                            </svg>
                        </div>
                        <div className="text-5xl font-bold text-purple-400 text-center">
                            {loading ? "..." : (creditScore !== null ? creditScore : "N/A")}
                        </div>
                        <div className="mt-2 text-center">
                            <span className="bg-purple-100 text-purple-600 rounded-xl px-4 py-1 font-semibold text-lg">
                                {loading ? "" : (creditStatus || "No Data")}
                            </span>
                        </div>
                    </div>
                    {/* Document Verification Card */}
                    <div className="bg-white rounded-2xl shadow p-8 flex flex-col min-h-[420px] border border-gray-200">
                        <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center"><svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 0 1 4-4h2m-6 6h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" /></svg>Document Verification</h2>
                        <p className="text-gray-500 mb-6 text-center">Complete your profile for better loan terms</p>
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 0 1 4-4h2m-6 6h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" /></svg>
                                    <div>
                                        <div className="font-semibold text-gray-800">ID Verification</div>
                                        <div className="text-sm text-gray-400">Identity</div>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-600 rounded-xl px-4 py-1 font-semibold">Verified</span>
                            </div>
                            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 0 1 4-4h2m-6 6h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" /></svg>
                                    <div>
                                        <div className="font-semibold text-gray-800">Income Statement</div>
                                        <div className="text-sm text-gray-400">Financial</div>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-600 rounded-xl px-4 py-1 font-semibold">Verified</span>
                            </div>
                            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 0 1 4-4h2m-6 6h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" /></svg>
                                    <div>
                                        <div className="font-semibold text-gray-800">Bank Statement</div>
                                        <div className="text-sm text-gray-400">Financial</div>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-600 rounded-xl px-4 py-1 font-semibold">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Credit Improvement Tips Section */}
                <div className="bg-white rounded-2xl shadow p-8 mt-10">
                    <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 text-purple-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17v-2a4 4 0 0 1 4-4h2m6 6h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" /></svg>
                        <h2 className="text-2xl font-bold text-gray-800">Customer Credit Summary</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Tip 1 */}
                        <div className="border rounded-xl p-6 bg-white flex flex-col justify-between">
                            <div className="flex items-center mb-2">
                                <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
                                <span className="font-semibold text-lg text-gray-800">Positive Summary</span>
                            </div>
                            <p className="text-gray-500 mb-4">
                                {userData?.positive_summary || "Payment history is the most important factor in your credit score."}
                            </p>
                            
                        </div>
                        {/* Tip 2 */}
                        <div className="border rounded-xl p-6 bg-white flex flex-col justify-between">
                            <div className="flex items-center mb-2">
                                <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
                                <span className="font-semibold text-lg text-gray-800">Negative Summary</span>
                            </div>
                            <p className="text-gray-500 mb-4">
                                {userData?.negative_summary || "Try to use less than 30% of your available credit limit."}
                            </p>
                    
                        </div>
                        {/* Tip 3 */}
                        <div className="border rounded-xl p-6 bg-white flex flex-col justify-between">
                            <div className="flex items-center mb-2">
                                <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
                                <span className="font-semibold text-lg text-gray-800">Credit Improvement Tips</span>
                            </div>
                            <p className="text-gray-500 mb-4">
                                {userData?.recommendation_tips || "Review your credit report regularly for errors and discrepancies."}
                            </p>
                    
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            </div>
        </div>
    );
}

export default Dashboard;
