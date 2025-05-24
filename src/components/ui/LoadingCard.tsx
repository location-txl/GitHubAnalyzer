import React from 'react';

interface LoadingCardProps {
  title?: string;
  height?: 'sm' | 'md' | 'lg';
}

const LoadingCard: React.FC<LoadingCardProps> = ({ 
  title = 'Loading...',
  height = 'md'
}) => {
  const heightClass = 
    height === 'sm' ? 'h-64' : 
    height === 'lg' ? 'h-96' : 
    'h-80';
  
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-slate-200 ${heightClass}`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="h-20 bg-slate-200 rounded"></div>
          <div className="h-20 bg-slate-200 rounded"></div>
          <div className="h-20 bg-slate-200 rounded"></div>
        </div>
        
        <div className="space-y-2 mt-6">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingCard;