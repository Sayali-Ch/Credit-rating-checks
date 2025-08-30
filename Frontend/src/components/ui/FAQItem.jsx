import React, { useState } from 'react';

export default function FAQItem({ 
  question, 
  answer, 
  isOpen = false,
  onToggle,
  className = ''
}) {
  const [internalOpen, setInternalOpen] = useState(isOpen);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  const isExpanded = onToggle ? isOpen : internalOpen;

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      <button 
        className="w-full text-left px-6 py-4 focus:outline-none hover:bg-gray-50 transition-colors"
        onClick={handleToggle}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 pr-4">{question}</h3>
          <span 
            className={`text-gray-500 transform transition-transform duration-200 text-xl flex-shrink-0 ${
              isExpanded ? 'rotate-45' : ''
            }`}
          >
            +
          </span>
        </div>
      </button>
      {isExpanded && (
        <div className="px-6 pb-4 text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}
