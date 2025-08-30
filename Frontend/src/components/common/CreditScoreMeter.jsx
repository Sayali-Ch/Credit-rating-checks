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
      width: 'w-32',
      height: 'h-16',
      strokeWidth: '8',
      textSize: 'text-xs',
      scoreSize: 'text-lg',
      radius: 60
    },
    medium: {
      width: 'w-48',
      height: 'h-24',
      strokeWidth: '12',
      textSize: 'text-sm',
      scoreSize: 'text-2xl',
      radius: 90
    },
    large: {
      width: 'w-64',
      height: 'h-32',
      strokeWidth: '16',
      textSize: 'text-sm',
      scoreSize: 'text-4xl',
      radius: 120
    }
  };

  const config = sizeConfig[size] || sizeConfig.large;
  
  // Calculate arc paths for different score ranges
  const centerX = config.radius + 20;
  const centerY = config.radius + 10;
  const radius = config.radius;
  
  // Helper function to calculate arc path
  const getArcPath = (startAngle, endAngle, outerRadius, innerRadius = outerRadius - parseInt(config.strokeWidth)) => {
    const start = {
      x: centerX + outerRadius * Math.cos((startAngle - 90) * Math.PI / 180),
      y: centerY + outerRadius * Math.sin((startAngle - 90) * Math.PI / 180)
    };
    const end = {
      x: centerX + outerRadius * Math.cos((endAngle - 90) * Math.PI / 180),
      y: centerY + outerRadius * Math.sin((endAngle - 90) * Math.PI / 180)
    };
    const startInner = {
      x: centerX + innerRadius * Math.cos((startAngle - 90) * Math.PI / 180),
      y: centerY + innerRadius * Math.sin((startAngle - 90) * Math.PI / 180)
    };
    const endInner = {
      x: centerX + innerRadius * Math.cos((endAngle - 90) * Math.PI / 180),
      y: centerY + innerRadius * Math.sin((endAngle - 90) * Math.PI / 180)
    };
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 1, end.x, end.y,
      "L", endInner.x, endInner.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 0, startInner.x, startInner.y,
      "Z"
    ].join(" ");
  };

  // Calculate needle position
  const needleAngle = angle - 90; // Adjust for SVG coordinate system
  const needleLength = radius - 10;
  const needleX = centerX + needleLength * Math.cos(needleAngle * Math.PI / 180);
  const needleY = centerY + needleLength * Math.sin(needleAngle * Math.PI / 180);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Speedometer SVG */}
      <div className={`${config.width} ${config.height} relative`}>
        <svg 
          width={centerX * 2 + 40} 
          height={centerY + 40} 
          className="overflow-visible"
        >
          {/* Background arc */}
          <path
            d={getArcPath(0, 180, radius)}
            fill="#e5e7eb"
          />
          
          {/* Poor range (300-579) - Red */}
          <path
            d={getArcPath(0, ((579 - 300) / scoreRange) * 180, radius)}
            fill="#ef4444"
          />
          
          {/* Fair range (580-669) - Yellow */}
          <path
            d={getArcPath(((579 - 300) / scoreRange) * 180, ((669 - 300) / scoreRange) * 180, radius)}
            fill="#eab308"
          />
          
          {/* Good range (670-739) - Light Green */}
          <path
            d={getArcPath(((669 - 300) / scoreRange) * 180, ((739 - 300) / scoreRange) * 180, radius)}
            fill="#22c55e"
          />
          
          {/* Excellent range (740-850) - Dark Green */}
          <path
            d={getArcPath(((739 - 300) / scoreRange) * 180, 180, radius)}
            fill="#16a34a"
          />
          
          {/* Score markers */}
          {showLabels && [300, 579, 669, 739, 850].map((markerScore, index) => {
            const markerAngle = ((markerScore - 300) / scoreRange) * 180 - 90;
            const markerX = centerX + (radius + 5) * Math.cos(markerAngle * Math.PI / 180);
            const markerY = centerY + (radius + 5) * Math.sin(markerAngle * Math.PI / 180);
            
            return (
              <g key={index}>
                <line
                  x1={centerX + (radius - 5) * Math.cos(markerAngle * Math.PI / 180)}
                  y1={centerY + (radius - 5) * Math.sin(markerAngle * Math.PI / 180)}
                  x2={centerX + radius * Math.cos(markerAngle * Math.PI / 180)}
                  y2={centerY + radius * Math.sin(markerAngle * Math.PI / 180)}
                  stroke="#374151"
                  strokeWidth="2"
                />
                <text
                  x={markerX}
                  y={markerY}
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
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
            stroke="#1f2937"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="8"
            fill="#1f2937"
          />
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
