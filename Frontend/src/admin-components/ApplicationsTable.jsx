import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ApplicationsTable = ({ applications, onStatusChange }) => {
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Calculate pagination
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = applications.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to page 1 when applications data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [applications.length]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    try {
      if (onStatusChange) {
        await onStatusChange(applicationId, newStatus);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleUserClick = (customerId) => {
    navigate(`/profile/${customerId}`);
  };

  const StatusDropdown = ({ application }) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentStatus = application.status || 'Under Scrutiny';
    
    const statuses = [
      { value: 'Under Scrutiny', label: 'Under Scrutiny', color: 'bg-yellow-100 text-yellow-800' },
      { value: 'Approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
      { value: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
    ];

    const currentStatusObj = statuses.find(s => s.value === currentStatus) || statuses[0];
    
    // Disable dropdown if status is not "Under Scrutiny"
    const isEditable = currentStatus === 'Under Scrutiny';

    return (
      <div className="relative">
        <button
          onClick={() => isEditable && setIsOpen(!isOpen)}
          disabled={updatingStatus === application.id || !isEditable}
          className={`${currentStatusObj.color} font-medium px-3 py-1.5 text-xs rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 flex items-center space-x-2 ${
            isEditable ? 'hover:shadow-sm cursor-pointer' : 'cursor-not-allowed opacity-75'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${
            currentStatus === 'Approved' ? 'bg-green-600' :
            currentStatus === 'Rejected' ? 'bg-red-600' : 'bg-yellow-600'
          }`}></div>
          <span>{updatingStatus === application.id ? 'Updating...' : currentStatus}</span>
          {isEditable && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        
        {isOpen && isEditable && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] overflow-hidden">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  if (status.value !== currentStatus) {
                    handleStatusChange(application.id, status.value);
                  }
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                  status.value === currentStatus ? 'bg-blue-50 text-blue-800' : 'text-gray-700 bg-white'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${
                  status.value === 'Approved' ? 'bg-green-600' :
                  status.value === 'Rejected' ? 'bg-red-600' : 'bg-yellow-600'
                }`}></div>
                <span>{status.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getCreditScoreColor = (score, requiredScore = 650) => {
    if (score >= requiredScore) {
      return 'text-green-600 font-semibold';
    } else if (score >= requiredScore - 50) {
      return 'text-yellow-600 font-semibold';
    } else {
      return 'text-red-600 font-semibold';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-1 w-12 rounded-full" style={{ backgroundColor: '#198ae6' }}></div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Loan Applications</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Recent applications sorted by submission date (newest first)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100">
                <TableHead className="text-gray-700 font-semibold text-xs uppercase tracking-wider min-w-[120px]">Customer ID</TableHead>
                <TableHead className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Applicant</TableHead>
                <TableHead className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Credit Score</TableHead>
                <TableHead className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Category</TableHead>
                <TableHead className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Loan Type</TableHead>
                <TableHead className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Required</TableHead>
                <TableHead className="text-gray-700 font-semibold text-xs uppercase tracking-wider">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentApplications.map((application, index) => (
                <TableRow 
                  key={application.id} 
                  className="hover:bg-blue-50/50 transition-colors border-gray-50 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-mono text-sm font-medium text-gray-900 min-w-[120px]">
                    <div className="flex items-center">
                      <span className="px-3 py-2 rounded-lg bg-gray-100 text-xs font-bold text-gray-700 whitespace-nowrap">
                        {application.customerId || 'N/A'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div>
                        <span
                          onClick={() => handleUserClick(application.customerId)}
                          className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer hover:underline transition-colors duration-200"
                          title="Click to view profile"
                        >
                          {application.name || 'Unknown'}
                        </span>
                        <div className="text-xs text-gray-500">
                          <div>Customer ID: {application.customerId}</div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getCreditScoreColor(application.creditScore, application.requiredScore || 650)}`}>
                        {application.creditScore || 'N/A'}
                      </span>
                      <div className="flex flex-col">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              application.creditScore >= (application.requiredScore || 650) ? 'bg-green-500' :
                              application.creditScore >= (application.requiredScore || 650) - 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(((application.creditScore || 0) / 900) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-0.5">out of 900</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {application.creditCategory || 'Standard'}
                      </span>
                      {application.lendingOutlook && (
                        <span className="text-xs text-gray-500">
                          {application.lendingOutlook}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
                      {application.loanType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-700 font-medium">
                      <span className="text-sm">{application.requiredScore || 650}</span>
                      <div className="text-xs text-gray-500">minimum</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusDropdown application={application} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {applications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
            <p className="text-gray-500 text-lg font-medium">No applications found</p>
            <p className="text-gray-400 text-sm mt-1">Applications will appear here when users submit them</p>
          </div>
        )}
        
        {/* Pagination Controls */}
        {applications.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Showing</span>
              <span className="font-medium">{startIndex + 1}</span>
              <span>to</span>
              <span className="font-medium">{Math.min(endIndex, applications.length)}</span>
              <span>of</span>
              <span className="font-medium">{applications.length}</span>
              <span>applications</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationsTable;
