import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationService from "../services/applicationService";
import AuthService from "../services/authService";

function Dashboard() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [creditScore, setCreditScore] = useState(null);
    const [creditStatus, setCreditStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedLoanType, setSelectedLoanType] = useState("");
    const [eligibilityResult, setEligibilityResult] = useState(null);
    const [showParameterForm, setShowParameterForm] = useState(false);
    const [loanParameters, setLoanParameters] = useState({});
    const [parameterFormValid, setParameterFormValid] = useState(false);

    // Define loan eligibility criteria
    const loanCriteria = {
        "car-loan": {
            name: "Car Loan",
            minCreditScore: 650,
            description: "Finance your dream car with competitive interest rates"
        },
        "personal-loan": {
            name: "Personal Loan",
            minCreditScore: 700,
            description: "Meet your personal financial needs with flexible terms"
        },
        "education-loan": {
            name: "Education Loan",
            minCreditScore: 600,
            description: "Invest in your future with education financing"
        },
        "business-loan": {
            name: "Business Loan",
            minCreditScore: 720,
            description: "Grow your business with tailored financing solutions"
        },
        "home-loan": {
            name: "Home Loan",
            minCreditScore: 750,
            description: "Make your dream home a reality"
        }
    };

    // Define additional parameters required for each loan type
    const loanParameterRequirements = {
        "car-loan": {
            fields: [
                { name: "age", label: "Age", type: "number", required: true, min: 21, max: 65, placeholder: "Enter your age (21-65 years)" },
                { name: "workExperience", label: "Work Experience (years)", type: "number", required: true, min: 1, placeholder: "Years of work experience" },
                { name: "jobDuration", label: "Current Job Duration (months)", type: "number", required: true, min: 6, placeholder: "Months in current job" },
                { name: "vehicleModel", label: "Vehicle Model", type: "text", required: true, placeholder: "e.g., Honda City, Toyota Corolla" },
                { name: "vehiclePrice", label: "Vehicle Price (₹)", type: "number", required: true, min: 100000, placeholder: "Expected vehicle price" },
                { name: "hasRegistrationPapers", label: "Registration Papers", type: "select", required: true, options: [
                    { value: "yes", label: "Yes, I have all registration papers" },
                    { value: "pending", label: "Pending - Will arrange" },
                    { value: "new-vehicle", label: "New vehicle purchase" }
                ]}
            ]
        },
        "personal-loan": {
            fields: [
                { name: "existingDebts", label: "Existing Debts/EMIs (₹/month)", type: "number", required: true, min: 0, placeholder: "Total monthly EMI obligations" },
                { name: "employmentType", label: "Employment Type", type: "select", required: true, options: [
                    { value: "salaried", label: "Salaried Employee" },
                    { value: "self-employed", label: "Self Employed" },
                    { value: "business", label: "Business Owner" },
                    { value: "professional", label: "Professional (Doctor/CA/Lawyer)" }
                ]},
                { name: "residencyStatus", label: "Residency Status", type: "select", required: true, options: [
                    { value: "owned", label: "Own House" },
                    { value: "rented", label: "Rented" },
                    { value: "family", label: "Family Owned" },
                    { value: "company", label: "Company Provided" }
                ]},
                { name: "addressProof", label: "Address Proof Available", type: "select", required: true, options: [
                    { value: "yes", label: "Yes, I have valid address proof" },
                    { value: "partial", label: "Some documents available" },
                    { value: "no", label: "Need to arrange" }
                ]}
            ]
        },
        "home-loan": {
            fields: [
                { name: "propertyOwnership", label: "Property Ownership Status", type: "select", required: true, options: [
                    { value: "identified", label: "Property Identified" },
                    { value: "booked", label: "Property Booked" },
                    { value: "registered", label: "Property Registered" },
                    { value: "searching", label: "Still Searching" }
                ]},
                { name: "titleDocuments", label: "Title Documents Status", type: "select", required: true, options: [
                    { value: "clear", label: "Clear title documents available" },
                    { value: "pending", label: "Under verification" },
                    { value: "issues", label: "Some issues to resolve" },
                    { value: "na", label: "Not applicable yet" }
                ]},
                { name: "legalClearance", label: "Legal Clearances", type: "select", required: true, options: [
                    { value: "approved", label: "All approvals in place" },
                    { value: "pending", label: "Some approvals pending" },
                    { value: "na", label: "Will be arranged" }
                ]},
                { name: "propertyValue", label: "Property Value (₹)", type: "number", required: true, min: 1000000, placeholder: "Estimated property value" },
                { name: "loanAmount", label: "Required Loan Amount (₹)", type: "number", required: true, min: 500000, placeholder: "Loan amount needed" }
            ]
        },
        "business-loan": {
            fields: [
                { name: "gstNumber", label: "GST Registration Number", type: "text", required: true, placeholder: "Enter GST number" },
                { name: "msmeRegistration", label: "MSME Registration", type: "select", required: true, options: [
                    { value: "registered", label: "MSME Registered" },
                    { value: "applied", label: "Application Submitted" },
                    { value: "not-applicable", label: "Not Applicable" },
                    { value: "will-apply", label: "Will Apply" }
                ]},
                { name: "businessYears", label: "Years in Business", type: "number", required: true, min: 1, placeholder: "Number of years in operation" },
                { name: "businessType", label: "Business Type", type: "select", required: true, options: [
                    { value: "manufacturing", label: "Manufacturing" },
                    { value: "trading", label: "Trading" },
                    { value: "services", label: "Services" },
                    { value: "retail", label: "Retail" },
                    { value: "other", label: "Other" }
                ]},
                { name: "hasProjectPlan", label: "Business/Project Plan", type: "select", required: true, options: [
                    { value: "detailed", label: "Detailed project plan ready" },
                    { value: "basic", label: "Basic plan available" },
                    { value: "will-prepare", label: "Will prepare with bank guidance" }
                ]},
                { name: "cashFlowProjection", label: "Cash Flow Projections", type: "select", required: true, options: [
                    { value: "available", label: "12-month projections ready" },
                    { value: "partial", label: "6-month projections available" },
                    { value: "need-help", label: "Need assistance in preparation" }
                ]}
            ]
        },
        "education-loan": {
            fields: [
                { name: "admissionStatus", label: "Admission Status", type: "select", required: true, options: [
                    { value: "confirmed", label: "Admission Confirmed" },
                    { value: "provisional", label: "Provisional Admission" },
                    { value: "applied", label: "Applied - Awaiting Result" },
                    { value: "planning", label: "Planning to Apply" }
                ]},
                { name: "feeStructure", label: "Fee Structure Clarity", type: "select", required: true, options: [
                    { value: "complete", label: "Complete fee structure available" },
                    { value: "partial", label: "Partial information available" },
                    { value: "estimated", label: "Estimated fees only" }
                ]},
                { name: "coApplicant", label: "Co-applicant Details", type: "select", required: true, options: [
                    { value: "parent", label: "Parent as Co-applicant" },
                    { value: "guardian", label: "Guardian as Co-applicant" },
                    { value: "spouse", label: "Spouse as Co-applicant" },
                    { value: "other", label: "Other Family Member" }
                ]},
                { name: "courseDuration", label: "Course Duration (years)", type: "number", required: true, min: 1, max: 10, placeholder: "Duration of the course" },
                { name: "courseType", label: "Course Type", type: "select", required: true, options: [
                    { value: "engineering", label: "Engineering/Technical" },
                    { value: "medical", label: "Medical" },
                    { value: "management", label: "Management (MBA/PGDM)" },
                    { value: "foreign", label: "Foreign Studies" },
                    { value: "other", label: "Other Professional Course" }
                ]},
                { name: "employmentProspects", label: "Employment Prospects", type: "select", required: true, options: [
                    { value: "excellent", label: "Excellent (High-demand field)" },
                    { value: "good", label: "Good (Stable career prospects)" },
                    { value: "average", label: "Average" },
                    { value: "uncertain", label: "Uncertain" }
                ]}
            ]
        }
    };

    const checkEligibility = (loanType) => {
        if (!loanType || !creditScore) return;
        
        const criteria = loanCriteria[loanType];
        const isEligible = creditScore >= criteria.minCreditScore;
        
        setEligibilityResult({
            loanType: criteria.name,
            isEligible,
            minRequired: criteria.minCreditScore,
            currentScore: creditScore,
            description: criteria.description
        });
    };

    const handleLoanTypeChange = (e) => {
        const loanType = e.target.value;
        setSelectedLoanType(loanType);
        setShowParameterForm(false);
        setLoanParameters({});
        setEligibilityResult(null);
        setParameterFormValid(false);
        
        if (loanType) {
            setShowParameterForm(true);
        }
    };

    const handleParameterChange = (fieldName, value) => {
        const newParameters = {
            ...loanParameters,
            [fieldName]: value
        };
        setLoanParameters(newParameters);
        
        // Validate form completeness
        if (selectedLoanType && loanParameterRequirements[selectedLoanType]) {
            const requiredFields = loanParameterRequirements[selectedLoanType].fields.filter(field => field.required);
            const isValid = requiredFields.every(field => {
                const paramValue = newParameters[field.name];
                return paramValue !== undefined && paramValue !== null && paramValue !== '';
            });
            setParameterFormValid(isValid);
        }
    };

    const handleParameterFormSubmit = (e) => {
        e.preventDefault();
        if (parameterFormValid && selectedLoanType) {
            checkEligibility(selectedLoanType);
        }
    };

    const renderParameterForm = () => {
        if (!selectedLoanType || !loanParameterRequirements[selectedLoanType]) return null;

        const requirements = loanParameterRequirements[selectedLoanType];
        
        return (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-blue-800">
                        Additional Information Required for {loanCriteria[selectedLoanType].name}
                    </h3>
                </div>
                
                <form onSubmit={handleParameterFormSubmit} className="space-y-4">
                    {requirements.fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            
                            {field.type === 'select' ? (
                                <select
                                    value={loanParameters[field.name] || ''}
                                    onChange={(e) => handleParameterChange(field.name, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required={field.required}
                                >
                                    <option value="">Select an option...</option>
                                    {field.options.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    value={loanParameters[field.name] || ''}
                                    onChange={(e) => handleParameterChange(field.name, e.target.value)}
                                    placeholder={field.placeholder}
                                    min={field.min}
                                    max={field.max}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required={field.required}
                                />
                            )}
                        </div>
                    ))}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                        <div className="text-sm text-blue-600">
                            Please fill all required fields to proceed with eligibility check
                        </div>
                        <button
                            type="submit"
                            disabled={!parameterFormValid}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                parameterFormValid
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Check Eligibility
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    useEffect(() => {
        // Check if user is authenticated
        if (!AuthService.isAuthenticated()) {
            // Redirect to home page (which has AuthPage) if not authenticated
            navigate('/');
            return;
        }

        // Get user data from JWT token first
        const tokenUser = AuthService.getUserFromToken();
        if (tokenUser) {
            setUserData(tokenUser);
            // Try to get additional user data from server
            AuthService.getUserProfile()
                .then(serverUser => {
                    setUserData(serverUser);
                    setCreditScore(serverUser.credit_score || serverUser.Credit_Score);
                    
                    // Set credit status based on score
                    const score = serverUser.credit_score || serverUser.Credit_Score;
                    if (score >= 750) setCreditStatus("Excellent");
                    else if (score >= 700) setCreditStatus("Good");
                    else if (score >= 650) setCreditStatus("Fair");
                    else setCreditStatus("Poor");
                })
                .catch(error => {
                    console.error('Error fetching user profile:', error);
                    // Use token data as fallback
                    setCreditScore(750); // Default for demo
                    setCreditStatus("Good");
                })
                .finally(() => setLoading(false));
        } else {
            // Fallback to localStorage (legacy support)
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
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
            setLoading(false);
        }
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

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

                {/* Loan Eligibility Section */}
                <div className="bg-white rounded-2xl shadow p-8 mt-10 mb-20">
                    <div className="flex items-center mb-6">
                        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800">Loan Eligibility</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[400px]">
                        {/* Loan Type Selection */}
                        <div className="space-y-4">
                            <div className="loan-select-container">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Which loan type do you want to apply for?
                                </label>
                                <select
                                    value={selectedLoanType}
                                    onChange={handleLoanTypeChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white appearance-none"
                                    style={{ 
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '2.5rem'
                                    }}
                                >
                                    <option value="">Select loan type...</option>
                                    <option value="car-loan">Car Loan</option>
                                    <option value="personal-loan">Personal Loan</option>
                                    <option value="education-loan">Education Loan</option>
                                    <option value="business-loan">Business Loan</option>
                                    <option value="home-loan">Home Loan</option>
                                </select>
                            </div>

                            {/* Parameter Input Form */}
                            {showParameterForm && renderParameterForm()}

                            {/* Loan Criteria Display */}
                            {selectedLoanType && !showParameterForm && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">
                                        {loanCriteria[selectedLoanType].name} Requirements
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Minimum Credit Score:</span>
                                            <span className="font-semibold">{loanCriteria[selectedLoanType].minCreditScore}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Your Current Score:</span>
                                            <span className={`font-semibold ${creditScore >= loanCriteria[selectedLoanType].minCreditScore ? 'text-green-600' : 'text-red-600'}`}>
                                                {creditScore}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Eligibility Result */}
                        {applicationMessage && (
                            <div className={`rounded-lg p-4 border ${applicationMessage.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} mb-4`}>
                                <div className="flex items-center">
                                    {applicationMessage.type === 'success' ? (
                                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    <p className={`text-sm font-medium ${applicationMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                        {applicationMessage.text}
                                    </p>
                                </div>
                            </div>
                        )}

                        {eligibilityResult && (
                            <div className={`rounded-lg p-6 border-2 ${eligibilityResult.isEligible ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                <div className="flex items-center mb-4">
                                    {eligibilityResult.isEligible ? (
                                        <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8 text-red-600 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    <div>
                                        <h3 className={`text-xl font-bold ${eligibilityResult.isEligible ? 'text-green-800' : 'text-red-800'}`}>
                                            {eligibilityResult.isEligible ? 'You are Eligible!' : 'Not Eligible'}
                                        </h3>
                                        <p className={`text-sm ${eligibilityResult.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                                            {eligibilityResult.loanType}
                                        </p>
                                    </div>
                                </div>
                                
                                <p className={`mb-4 ${eligibilityResult.isEligible ? 'text-green-700' : 'text-red-700'}`}>
                                    {eligibilityResult.description}
                                </p>

                                {eligibilityResult.isEligible ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm text-green-700">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Your credit score ({eligibilityResult.currentScore}) meets the minimum requirement ({eligibilityResult.minRequired})
                                        </div>
                                        <div className="w-full bg-green-100 border border-green-300 text-green-800 font-semibold py-3 px-6 rounded-lg text-center">
                                            ✅ You are eligible for {eligibilityResult.loanType}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm text-red-700">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Your credit score ({eligibilityResult.currentScore}) is below the minimum requirement ({eligibilityResult.minRequired})
                                        </div>
                                        <div className="text-sm text-red-600">
                                            Improve your credit score by {eligibilityResult.minRequired - eligibilityResult.currentScore} points to become eligible.
                                        </div>
                                        <div className="w-full bg-red-100 border border-red-300 text-red-800 font-semibold py-3 px-6 rounded-lg text-center">
                                            ❌ Not Eligible - Improve Credit Score
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {!selectedLoanType && (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    <p>Select a loan type to check your eligibility</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            </div>
        </div>
    );
}

export default Dashboard;
