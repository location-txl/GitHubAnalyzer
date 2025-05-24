import React from 'react';
import { Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { X, Download } from 'lucide-react';
import { ComparableRepository } from '../../types';
import { formatComparisonData, exportAsJson, exportAsCSV } from '../../utils/exportHelpers';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ComparisonViewProps {
  repositories: ComparableRepository[];
  onRemoveRepository: (id: number) => void;
  onClearAll: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ 
  repositories, 
  onRemoveRepository,
  onClearAll
}) => {
  // Chart colors
  const colors = ['#3B82F6', '#10B981', '#F97316'];
  
  // Prepare chart data for stars, forks, and issues
  const prepareChartData = (metric: 'stars' | 'forks' | 'issues') => {
    return {
      labels: repositories.map(repo => repo.name),
      datasets: [
        {
          label: metric === 'stars' ? 'Stars' : metric === 'forks' ? 'Forks' : 'Issues',
          data: repositories.map(repo => repo[metric]),
          backgroundColor: repositories.map((_, i) => colors[i % colors.length]),
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  const handleExportJson = () => {
    exportAsJson(formatComparisonData(repositories), 'github-comparison');
  };
  
  const handleExportCsv = () => {
    exportAsCSV(formatComparisonData(repositories), 'github-comparison');
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Repository Comparison</h2>
        <div className="flex space-x-2">
          <div className="relative group">
            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">
              <Download size={16} className="mr-1" />
              Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
              <div className="py-1">
                <button
                  onClick={handleExportJson}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as JSON
                </button>
                <button
                  onClick={handleExportCsv}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as CSV
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={onClearAll}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-slate-600 rounded-lg hover:bg-slate-700"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {repositories.map((repo, index) => (
          <div 
            key={repo.id} 
            className="p-4 rounded-lg border-2"
            style={{ borderColor: colors[index % colors.length] }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg truncate" title={repo.full_name}>{repo.full_name}</h3>
              <button 
                onClick={() => onRemoveRepository(repo.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <p className="text-xs text-slate-500">Stars</p>
                <p className="font-semibold">{repo.stars.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Forks</p>
                <p className="font-semibold">{repo.forks.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">Issues</p>
                <p className="font-semibold">{repo.issues.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Main language:</span>
                <span className="font-medium">{repo.language || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contributors:</span>
                <span className="font-medium">{repo.contributors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Created:</span>
                <span className="font-medium">{format(new Date(repo.created_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3 text-center">Stars Comparison</h3>
          <div className="h-64">
            <Bar data={prepareChartData('stars')} options={chartOptions} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-3 text-center">Forks Comparison</h3>
          <div className="h-64">
            <Bar data={prepareChartData('forks')} options={chartOptions} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-3 text-center">Issues Comparison</h3>
          <div className="h-64">
            <Bar data={prepareChartData('issues')} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;