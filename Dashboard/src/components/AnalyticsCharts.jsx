import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsCharts = ({ creditScoreData, loanTypeData }) => {
  // Use consistent colors for pie chart from the data
  const PIE_COLORS = ['#198ae6', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">{`${label}`}</p>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#198ae6' }}></div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Users:</span> {payload[0].value}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">{payload[0].name}</p>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].color }}></div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Share:</span> {payload[0].value}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Credit Score Distribution */}
      <Card className="shadow-md border-0 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="h-1 w-12 rounded-full bg-blue-500"></div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Credit Score Distribution</CardTitle>
              <p className="text-sm text-gray-600 mt-1">User distribution across credit score ranges</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-6">
          <div className="h-[320px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={creditScoreData} margin={{ top: 20, right: 30, left: 30, bottom: 70 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#198ae6" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#198ae6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={{ stroke: '#E5E7EB' }}
                  textAnchor="middle"
                  height={60}
                  interval={0}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={{ stroke: '#E5E7EB' }}
                  label={{ 
                    value: 'Users', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { textAnchor: 'middle', fill: '#6B7280', fontSize: '11px' } 
                  }}
                  tickFormatter={(value) => Math.floor(value)}
                  domain={[0, 'dataMax']}
                  allowDecimals={false}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                  strokeWidth={0}
                  maxBarSize={80}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Loan Type Breakdown */}
      <Card className="shadow-md border-0 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="h-1 w-12 rounded-full bg-purple-500"></div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Loan Type Breakdown</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Distribution of loan applications by type</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-6">
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  outerRadius={85}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="white"
                  strokeWidth={2}
                >
                  {loanTypeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCharts;
