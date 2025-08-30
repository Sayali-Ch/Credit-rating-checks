import React from 'react';

export default function CreditScoreSpeedometer({ 
  score = 750, 
  size = 'large', 
  showLabels = true 
}) {
  // Calculate the angle for the score indicator (semi-circle from 0 to 180 degrees)
  const minScore = 300;
  const maxScore = 850;
  const scoreRange = maxScore - minScore;
  const normalizedScore = Math.max(0, Math.min(scoreRange, score - minScore));
  const angle = (normalizedScore / scoreRange) * 180; // 0 to 180 degrees
  
  // Determine the score category and color
  const getScoreCategory = (score) => {
    if (score >= 740) return { category: 'Excellent', color: 'text-green-700' };
    if (score >= 670) return { category: 'Good', color: 'text-green-500' };
    if (score >= 580) return { category: 'Fair', color: 'text-yellow-600' };
    return { category: 'Poor', color: 'text-red-600' };
  };

  const { category, color } = getScoreCategory(score);
  
  // Size configurations
  const sizeConfig = {
    small: {
      strokeWidth: '8',
      textSize: 'text-xs',
      scoreSize: 'text-lg',
      radius: 50
    },
    medium: {
      strokeWidth: '12',
      textSize: 'text-sm',
      scoreSize: 'text-2xl',
      radius: 80
    },
    large: {
      strokeWidth: '16',
      textSize: 'text-sm',
      scoreSize: 'text-4xl',
      radius: 100
    }
  };

  const config = sizeConfig[size] || sizeConfig.large;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Speedometer SVG */}
      <div className="relative flex items-center justify-center">
        <svg 
          width={config.radius * 2 + 80} 
          height={config.radius + 60} 
          className="block mx-auto"
        >
          <g transform={`translate(${(config.radius * 2 + 80) / 2}, ${config.radius + 20})`}>
            {/* Background arc */}
            <path
              d={`M -${config.radius} 0 A ${config.radius} ${config.radius} 0 0 1 ${config.radius} 0`}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
            />
            
            {/* Poor range (300-579) - Red */}
            <path
              d={`M -${config.radius} 0 A ${config.radius} ${config.radius} 0 0 1 -${config.radius * 0.31} -${config.radius * 0.95}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
            />
            
            {/* Fair range (580-669) - Yellow */}
            <path
              d={`M -${config.radius * 0.31} -${config.radius * 0.95} A ${config.radius} ${config.radius} 0 0 1 ${config.radius * 0.31} -${config.radius * 0.95}`}
              fill="none"
              stroke="#eab308"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
            />
            
            {/* Good range (670-739) - Light Green */}
            <path
              d={`M ${config.radius * 0.31} -${config.radius * 0.95} A ${config.radius} ${config.radius} 0 0 1 ${config.radius * 0.71} -${config.radius * 0.71}`}
              fill="none"
              stroke="#22c55e"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
            />
            
            {/* Excellent range (740-850) - Dark Green */}
            <path
              d={`M ${config.radius * 0.71} -${config.radius * 0.71} A ${config.radius} ${config.radius} 0 0 1 ${config.radius} 0`}
              fill="none"
              stroke="#16a34a"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
            />
            
            {/* Score markers */}
            {showLabels && [300, 579, 669, 739, 850].map((markerScore, index) => {
              const markerAngle = ((markerScore - 300) / scoreRange) * 180;
              const markerX = -config.radius * Math.cos(markerAngle * Math.PI / 180);
              const markerY = -config.radius * Math.sin(markerAngle * Math.PI / 180);
              const labelX = -(config.radius + 20) * Math.cos(markerAngle * Math.PI / 180);
              const labelY = -(config.radius + 20) * Math.sin(markerAngle * Math.PI / 180);
              
              return (
                <g key={index}>
                  <line
                    x1={markerX * 0.9}
                    y1={markerY * 0.9}
                    x2={markerX}
                    y2={markerY}
                    stroke="#374151"
                    strokeWidth="2"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`${config.textSize} font-medium fill-gray-700`}
                  >
                    {markerScore}
                  </text>
                </g>
              );
            })}
            
            {/* Needle */}
            <line
              x1="0"
              y1="0"
              x2={-(config.radius - 20) * Math.cos(angle * Math.PI / 180)}
              y2={-(config.radius - 20) * Math.sin(angle * Math.PI / 180)}
              stroke="#1f2937"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Center circle */}
            <circle
              cx="0"
              cy="0"
              r="8"
              fill="#1f2937"
            />
          </g>
        </svg>
      </div>
      
      {/* Score display */}
      <div className="text-center mt-4">
        <div className={`${config.scoreSize} font-bold text-gray-900`}>{score}</div>
        <div className={`${config.textSize} ${color} font-semibold`}>{category}</div>
        {showLabels && (
          <div className="text-xs text-gray-500 mt-1">Credit Score</div>
        )}
      </div>
      
      {/* Zone labels */}
      {showLabels && size === 'large' && (
        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-red-500 rounded mb-1"></div>
            <div className="text-xs font-medium text-red-600">Poor</div>
            <div className="text-xs text-gray-500">300-579</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mb-1"></div>
            <div className="text-xs font-medium text-yellow-600">Fair</div>
            <div className="text-xs text-gray-500">580-669</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-green-500 rounded mb-1"></div>
            <div className="text-xs font-medium text-green-500">Good</div>
            <div className="text-xs text-gray-500">670-739</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-green-600 rounded mb-1"></div>
            <div className="text-xs font-medium text-green-700">Excellent</div>
            <div className="text-xs text-gray-500">740-850</div>
          </div>
        </div>
      )}
    </div>
  );
}
