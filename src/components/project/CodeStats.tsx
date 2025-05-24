import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FileCode, AlertCircle } from 'lucide-react';
import { Language } from '../../types';
import LoadingCard from '../ui/LoadingCard';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface CodeStatsProps {
  languages: Language[];
  loading: boolean;
  error: string | null;
}

// Colors for language chart
const CHART_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
  '#6366F1', // indigo
  '#84CC16', // lime
];

const CodeStats: React.FC<CodeStatsProps> = ({ languages, loading, error }) => {
  const { t } = useTranslation();
  
  if (loading) {
    return <LoadingCard title={t('codeStats.title')} />;
  }
  
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-full">
        <div className="flex items-center text-red-500 mb-4">
          <AlertCircle size={20} className="mr-2" />
          <h3 className="text-lg font-medium">{t('codeStats.error')}</h3>
        </div>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }
  
  if (!languages || languages.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-full">
        <h2 className="text-xl font-semibold mb-4">{t('codeStats.title')}</h2>
        <div className="flex flex-col items-center justify-center py-8">
          <FileCode size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 text-center">{t('codeStats.noData')}</p>
        </div>
      </div>
    );
  }
  
  // Sort languages by bytes
  const sortedLanguages = [...languages].sort((a, b) => b.bytes - a.bytes);
  
  // Prepare chart data
  const chartData = {
    labels: sortedLanguages.map(lang => lang.name),
    datasets: [
      {
        data: sortedLanguages.map(lang => lang.percentage),
        backgroundColor: CHART_COLORS.slice(0, sortedLanguages.length),
        borderWidth: 1,
      },
    ],
  };
  
  // Chart options
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value.toFixed(2)}%`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };
  
  // Calculate total code size
  const totalBytes = languages.reduce((sum, lang) => sum + lang.bytes, 0);
  const formattedTotalSize = formatBytes(totalBytes);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-full">
      <h2 className="text-xl font-semibold mb-4">{t('codeStats.title')}</h2>
      
      <div className="mb-4">
        <p className="text-slate-600 mb-1">{t('codeStats.totalSize')}</p>
        <p className="text-2xl font-semibold">{formattedTotalSize}</p>
      </div>
      
      <div className="relative h-64 mb-4">
        <Pie data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-4">
        <h3 className="text-md font-medium mb-2">{t('codeStats.languageBreakdown')}</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {sortedLanguages.map((lang, index) => (
            <div key={lang.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                ></div>
                <span className="text-slate-700">{lang.name}</span>
              </div>
              <div className="flex space-x-4">
                <span className="text-slate-500 text-sm">{formatBytes(lang.bytes)}</span>
                <span className="text-slate-700 font-medium w-16 text-right">
                  {lang.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to format bytes
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default CodeStats;