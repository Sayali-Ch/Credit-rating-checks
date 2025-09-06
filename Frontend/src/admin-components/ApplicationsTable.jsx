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
    navigate(`/admin-dashboard/profile/${customerId}`);
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
          disabled={updatingStatus === application._id || !isEditable}
          className={`${currentStatusObj.color} font-bold px-4 py-2 text-xs rounded-full border-0 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2 ${
            isEditable ? 'hover:shadow-xl hover:scale-105 cursor-pointer transform' : 'cursor-not-allowed opacity-75'
          }`}
        >
          <div className={`w-2 h-2 rounded-full shadow-sm ${
            currentStatus === 'Approved' ? 'bg-green-600' :
            currentStatus === 'Rejected' ? 'bg-red-600' : 'bg-yellow-600'
          }`}></div>
          <span className="font-semibold">
            {updatingStatus === application._id ? 'Updating...' : currentStatus}
          </span>
          {isEditable && (
            <svg className="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
        
        {isOpen && isEditable && (
          <div className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl z-50 min-w-[160px] overflow-hidden border-t-4 border-t-blue-500">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  if (status.value !== currentStatus) {
                    handleStatusChange(application._id, status.value);
                  }
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-xs hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 flex items-center space-x-3 font-medium ${
                  status.value === currentStatus ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 font-bold' : 'text-gray-700 bg-white hover:text-gray-900'
                }`}
              >
                <div className={`w-2 h-2 rounded-full shadow-sm ${
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
    <Card className="relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 backdrop-blur-sm">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #3b82f6 2px, transparent 0), radial-gradient(circle at 75px 75px, #8b5cf6 2px, transparent 0)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>
      
      <CardHeader className="relative pb-6 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-3 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg"></div>
              <div className="absolute inset-0 h-3 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-50 blur-sm"></div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Loan Applications
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                Recent applications sorted by submission date • Live updates enabled
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border border-white/50">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-xs font-semibold text-gray-700">Live</span>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
              {applications.length} Total
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative pt-0">
        <div className="overflow-x-auto rounded-xl bg-white/60 backdrop-blur-sm shadow-inner">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/50">
                <TableHead className="text-gray-700 font-bold text-xs uppercase tracking-wider min-w-[120px] py-4">Customer ID</TableHead>
                <TableHead className="text-gray-700 font-bold text-xs uppercase tracking-wider py-4">Applicant</TableHead>
                <TableHead className="text-gray-700 font-bold text-xs uppercase tracking-wider py-4">Credit Score</TableHead>
                <TableHead className="text-gray-700 font-bold text-xs uppercase tracking-wider py-4">Category</TableHead>
                <TableHead className="text-gray-700 font-bold text-xs uppercase tracking-wider py-4">Loan Type</TableHead>
                <TableHead className="text-gray-700 font-bold text-xs uppercase tracking-wider py-4">Required</TableHead>
                <TableHead className="text-gray-700 font-bold text-xs uppercase tracking-wider py-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentApplications.map((application, index) => (
                <TableRow 
                  key={application._id} 
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border-gray-50 group hover:shadow-md"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-mono text-sm font-medium text-gray-900 min-w-[120px] py-4">
                    <div className="flex items-center">
                      <div className="relative group-hover:scale-105 transition-transform duration-200">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-10 group-hover:opacity-20 transition-opacity duration-200"></div>
                        <span className="relative px-4 py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 text-xs font-bold text-gray-800 whitespace-nowrap shadow-sm border border-gray-200/50">
                          {application.customerId || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {(application.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span
                            onClick={() => handleUserClick(application.customerId)}
                            className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer hover:underline transition-all duration-200 decoration-2 underline-offset-2"
                            title="Click to view profile"
                          >
                            {application.name || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          {application.creditScore || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Score</div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full rounded-full shadow-sm transition-all duration-300 ${
                              application.creditScore >= (application.requiredScore || 650) 
                                ? 'bg-gradient-to-r from-green-400 to-green-600' :
                              application.creditScore >= (application.requiredScore || 650) - 50 
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 
                                'bg-gradient-to-r from-red-400 to-red-600'
                            }`}
                            style={{ width: `${Math.min(((application.creditScore || 0) / 900) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">300</span>
                          <span className="text-gray-500 font-medium">900</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-900">
                          {application.creditCategory || 'Standard'}
                        </span>
                      </div>
                      {application.lendingOutlook && (
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full inline-block w-fit">
                          {application.lendingOutlook}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 rounded-full text-xs font-bold border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 transform inline-flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full shadow-sm"></div>
                      <span className="font-semibold">{application.loanType}</span>
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="text-center">
                      <div className="inline-flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 shadow-sm border border-gray-200/50">
                        <span className="text-lg font-bold text-gray-900">{application.requiredScore || 650}</span>
                        <div className="text-xs text-gray-500 font-medium">minimum</div>
                      </div>
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
