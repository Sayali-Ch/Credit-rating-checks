import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const DashboardCard = ({ title, value, subtitle, color = '#198ae6', trend }) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white via-white to-gray-50/80 group hover:scale-105 transform-gpu">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3 z-10">
        <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
          {title}
        </CardTitle>
        <div className="relative">
          <div 
            className="h-3 w-16 rounded-full shadow-sm group-hover:shadow-md transition-shadow duration-300"
            style={{ 
              backgroundColor: color,
            }}
          />
          <div 
            className="absolute inset-0 h-3 w-16 rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-300 blur-sm"
            style={{ 
              backgroundColor: color,
            }}
          />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 group-hover:from-blue-900 group-hover:to-purple-900 transition-all duration-300">
          {value}
        </div>
        {subtitle && (
          <div className="flex items-center space-x-2">
            {trend && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                trend.type === 'up' ? 'bg-green-100 text-green-800 shadow-green-200/50' : 
                trend.type === 'down' ? 'bg-red-100 text-red-800 shadow-red-200/50' : 'bg-gray-100 text-gray-800 shadow-gray-200/50'
              } shadow-sm`}>
                <span className="mr-1">
                  {trend.type === 'up' ? '↗' : trend.type === 'down' ? '↘' : '→'}
                </span>
                {trend.value}
              </span>
            )}
            <p className="text-xs text-gray-500 font-medium">
              {subtitle}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
