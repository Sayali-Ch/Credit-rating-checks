// Loan Application Service
// Handles submitting new loan applications to the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class LoanApplicationService {
  // Submit a new loan application
  static async submitLoanApplication(applicationData) {
    try {
      console.log('📝 Submitting loan application:', applicationData);
      
      const response = await fetch(`${API_BASE_URL}/loans/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Loan application submitted successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error submitting loan application:', error);
      throw error;
    }
  }

  // Get loan type templates with required fields
  static getLoanTypeTemplate(loanType) {
    const templates = {
      'home-loan': {
        title: 'Home Loan Application',
        fields: [
          { name: 'propertyValue', label: 'Property Value (₹)', type: 'number', required: true },
          { name: 'loanAmount', label: 'Loan Amount (₹)', type: 'number', required: true },
          { name: 'downPayment', label: 'Down Payment (₹)', type: 'number', required: true },
          { name: 'propertyType', label: 'Property Type', type: 'select', required: true, 
            options: ['apartment', 'house', 'villa', 'plot'] }
        ]
      },
      'car-loan': {
        title: 'Car Loan Application',
        fields: [
          { name: 'vehicleType', label: 'Vehicle Type', type: 'select', required: true,
            options: ['new', 'used'] },
          { name: 'vehicleValue', label: 'Vehicle Value (₹)', type: 'number', required: true },
          { name: 'loanAmount', label: 'Loan Amount (₹)', type: 'number', required: true },
          { name: 'downPayment', label: 'Down Payment (₹)', type: 'number', required: true }
        ]
      },
      'personal-loan': {
        title: 'Personal Loan Application', 
        fields: [
          { name: 'loanPurpose', label: 'Loan Purpose', type: 'select', required: true,
            options: ['debt-consolidation', 'home-renovation', 'medical-expenses', 'education', 'travel', 'other'] },
          { name: 'monthlyIncome', label: 'Monthly Income (₹)', type: 'number', required: true },
          { name: 'loanAmount', label: 'Loan Amount (₹)', type: 'number', required: true },
          { name: 'existingEMI', label: 'Existing EMI (₹)', type: 'number', required: false }
        ]
      },
      'education-loan': {
        title: 'Education Loan Application',
        fields: [
          { name: 'admissionStatus', label: 'Admission Status', type: 'select', required: true,
            options: ['confirmed', 'provisional', 'pending'] },
          { name: 'courseType', label: 'Course Type', type: 'select', required: true,
            options: ['engineering', 'medical', 'management', 'law', 'arts', 'science', 'other'] },
          { name: 'courseDuration', label: 'Course Duration (years)', type: 'number', required: true },
          { name: 'feeStructure', label: 'Fee Structure', type: 'select', required: true,
            options: ['complete', 'partial', 'semester-wise'] },
          { name: 'coApplicant', label: 'Co-Applicant', type: 'select', required: true,
            options: ['parent', 'spouse', 'guardian', 'other'] }
        ]
      },
      'business-loan': {
        title: 'Business Loan Application',
        fields: [
          { name: 'businessType', label: 'Business Type', type: 'select', required: true,
            options: ['software', 'retail', 'manufacturing', 'services', 'consultancy', 'other'] },
          { name: 'gstRegistered', label: 'GST Registered', type: 'select', required: true,
            options: [true, false] },
          { name: 'monthlyRevenue', label: 'Monthly Revenue (₹)', type: 'number', required: true },
          { name: 'loanAmount', label: 'Loan Amount (₹)', type: 'number', required: true },
          { name: 'businessAge', label: 'Business Age (years)', type: 'number', required: true }
        ]
      }
    };

    return templates[loanType] || null;
  }

  // Validate loan application data
  static validateLoanApplication(loanType, loanData) {
    const template = this.getLoanTypeTemplate(loanType);
    if (!template) {
      return { valid: false, errors: ['Invalid loan type'] };
    }

    const errors = [];
    const requiredFields = template.fields.filter(field => field.required);

    requiredFields.forEach(field => {
      if (!loanData.hasOwnProperty(field.name) || 
          loanData[field.name] === null || 
          loanData[field.name] === undefined || 
          loanData[field.name] === '') {
        errors.push(`${field.label} is required`);
      }
    });

    // Additional validations
    if (loanType === 'home-loan') {
      if (loanData.loanAmount > loanData.propertyValue) {
        errors.push('Loan amount cannot exceed property value');
      }
    }

    if (loanType === 'car-loan') {
      if (loanData.loanAmount > loanData.vehicleValue) {
        errors.push('Loan amount cannot exceed vehicle value');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default LoanApplicationService;
