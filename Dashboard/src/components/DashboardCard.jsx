import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardCard = ({ title, value, subtitle, color = '#198ae6', trend }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
          {title}
        </CardTitle>
        <div 
          className="h-3 w-16 rounded-full"
          style={{ 
            backgroundColor: color,
          }}
        />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        {subtitle && (
          <div className="flex items-center space-x-1">
            {trend && (
              <span className={`text-xs font-medium ${
                trend.type === 'up' ? 'text-green-600' : 
                trend.type === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trend.type === 'up' ? '↗' : trend.type === 'down' ? '↘' : '→'} {trend.value}
              </span>
            )}
            <p className="text-xs text-gray-500">
              {subtitle}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
