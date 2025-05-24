import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Star, 
  GitFork, 
  Eye, 
  AlertCircle, 
  ExternalLink, 
  BarChart,
  Download,
  FileText,
  Loader
} from 'lucide-react';
import { Repository } from '../../types';
import { formatRepositoryData, exportAsJson, exportAsCSV } from '../../utils/exportHelpers';
import { analyzeReadme } from '../../services/githubApi';
import LoadingCard from '../ui/LoadingCard';

interface RepositoryInfoProps {
  repository: Repository | null;
  loading: boolean;
  error: string | null;
  onAddToComparison: () => void;
}

const RepositoryInfo: React.FC<RepositoryInfoProps> = ({ 
  repository, 
  loading,
  error,
  onAddToComparison
}) => {
  const [readmeAnalysis, setReadmeAnalysis] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAnalyzeReadme = async () => {
    if (!repository) return;
    
    setAnalysisLoading(true);
    setAnalysisError(null);
    
    const [owner, repo] = repository.full_name.split('/');
    const result = await analyzeReadme(owner, repo);
    
    if (typeof result === 'object' && result !== null && 'error' in result) {
      setAnalysisError(result.error);
    } else {
      setReadmeAnalysis(result as string);
    }
    
    setAnalysisLoading(false);
  };

  // Reset analysis state when repository changes and auto-analyze
  useEffect(() => {
    if (repository) {
      // Reset previous analysis state
      setReadmeAnalysis(null);
      setAnalysisError(null);
      setAnalysisLoading(false);
      
      // Auto-analyze the new repository
      handleAnalyzeReadme();
    }
  }, [repository]);

  if (loading) {
    return <LoadingCard title="Repository Information" />;
  }
  
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center text-red-500 mb-4">
          <AlertCircle size={20} className="mr-2" />
          <h3 className="text-lg font-medium">Error Loading Repository</h3>
        </div>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }
  
  if (!repository) {
    return null;
  }
  
  const handleExportJson = () => {
    const data = formatRepositoryData(repository, [], [], []);
    if (data) {
      exportAsJson(data, `${repository.name}-analysis`);
    }
  };
  
  const handleExportCsv = () => {
    const data = formatRepositoryData(repository, [], [], []);
    if (data) {
      exportAsCSV(data, `${repository.name}-analysis`);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold">Repository Information</h2>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button
            onClick={handleAnalyzeReadme}
            disabled={analysisLoading}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {analysisLoading ? (
              <Loader size={16} className="mr-1 animate-spin" />
            ) : (
              <FileText size={16} className="mr-1" />
            )}
            Re-analyze
          </button>
          <button
            onClick={onAddToComparison}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <BarChart size={16} className="mr-1" />
            Compare
          </button>
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
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row mb-6">
        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
          <img 
            src={repository.owner.avatar_url} 
            alt={repository.owner.login}
            className="w-16 h-16 rounded-full border border-slate-200"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold flex items-center">
            {repository.full_name}
            <a 
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-slate-500 hover:text-teal-600"
            >
              <ExternalLink size={16} />
            </a>
          </h3>
          <p className="text-slate-600 mt-1">{repository.description || 'No description provided'}</p>
          
          {repository.topics && repository.topics.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {repository.topics.map(topic => (
                <span 
                  key={topic} 
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* README Analysis Section */}
      {(readmeAnalysis || analysisError) && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">README Analysis</h3>
          {analysisError ? (
            <p className="text-red-600">{analysisError}</p>
          ) : (
            <p className="text-slate-700 whitespace-pre-wrap">{readmeAnalysis}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Star size={18} className="text-amber-500 mr-2" />
            <span className="text-slate-700">Stars</span>
          </div>
          <p className="text-2xl font-semibold mt-1">{repository.stargazers_count.toLocaleString()}</p>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center">
            <GitFork size={18} className="text-indigo-500 mr-2" />
            <span className="text-slate-700">Forks</span>
          </div>
          <p className="text-2xl font-semibold mt-1">{repository.forks_count.toLocaleString()}</p>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Eye size={18} className="text-emerald-500 mr-2" />
            <span className="text-slate-700">Watchers</span>
          </div>
          <p className="text-2xl font-semibold mt-1">{repository.watchers_count.toLocaleString()}</p>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center">
            <AlertCircle size={18} className="text-rose-500 mr-2" />
            <span className="text-slate-700">Issues</span>
          </div>
          <p className="text-2xl font-semibold mt-1">{repository.open_issues_count.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="border-t border-slate-200 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Created on</p>
            <p className="font-medium">
              {format(new Date(repository.created_at), 'PPP')}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Last updated</p>
            <p className="font-medium">
              {format(new Date(repository.updated_at), 'PPP')}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Default branch</p>
            <p className="font-medium">{repository.default_branch}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">License</p>
            <p className="font-medium">{repository.license?.name || 'No license'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryInfo;