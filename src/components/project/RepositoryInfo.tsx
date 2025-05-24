import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
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
  const { t } = useTranslation();
  const [readmeAnalysis, setReadmeAnalysis] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAnalyzeReadme = async () => {
    if (!repository) return;
    
    setAnalysisLoading(true);
    setAnalysisError(null);
    setReadmeAnalysis(''); // Clear previous content for streaming
    
    const [owner, repo] = repository.full_name.split('/');
    
    // Handle streaming content
    const handleStreamChunk = (chunk: string) => {
      setReadmeAnalysis(prev => (prev || '') + chunk);
    };
    
    const result = await analyzeReadme(owner, repo, handleStreamChunk);
    
    if (typeof result === 'object' && result !== null && 'error' in result) {
      setAnalysisError(result.error);
      setReadmeAnalysis(''); // Clear any partial content on error
    }
    // Note: We don't set the final result here since it's already set via streaming
    
    setAnalysisLoading(false);
  };

  // Reset analysis state when repository changes and auto-analyze
  useEffect(() => {
    if (repository) {
      // Reset previous analysis state
      setReadmeAnalysis('');
      setAnalysisError(null);
      setAnalysisLoading(false);
      
      // Auto-analyze the new repository
      handleAnalyzeReadme();
    }
  }, [repository]);

  if (loading) {
    return <LoadingCard title={t('repository.title')} />;
  }
  
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center text-red-500 mb-4">
          <AlertCircle size={20} className="mr-2" />
          <h3 className="text-lg font-medium">{t('common.error')}</h3>
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
        <h2 className="text-xl font-semibold">{t('repository.title')}</h2>
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
            {t('repository.reAnalyze')}
          </button>
          <button
            onClick={onAddToComparison}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <BarChart size={16} className="mr-1" />
            {t('repository.compare')}
          </button>
          <div className="relative group">
            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">
              <Download size={16} className="mr-1" />
              {t('repository.export')}
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
              <div className="py-1">
                <button
                  onClick={handleExportJson}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {t('repository.exportJson')}
                </button>
                <button
                  onClick={handleExportCsv}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {t('repository.exportCsv')}
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
          <p className="text-slate-600 mt-1">{repository.description || t('common.noDescription')}</p>
          
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
      {(readmeAnalysis || analysisError || analysisLoading) && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            README Analysis
            {analysisLoading && (
              <Loader size={16} className="ml-2 animate-spin text-blue-600" />
            )}
          </h3>
          {analysisError ? (
            <p className="text-red-600">{analysisError}</p>
          ) : (
            <div className="text-slate-700">
              {readmeAnalysis && (
                <ReactMarkdown 
                  components={{
                    h1: ({children}) => <h1 className="text-xl font-bold mt-4 mb-2 text-slate-800">{children}</h1>,
                    h2: ({children}) => <h2 className="text-lg font-semibold mt-3 mb-2 text-slate-800">{children}</h2>,
                    h3: ({children}) => <h3 className="text-base font-medium mt-2 mb-1 text-slate-800">{children}</h3>,
                    p: ({children}) => <p className="mb-2 text-slate-700">{children}</p>,
                    ul: ({children}) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                    li: ({children}) => <li className="text-slate-700">{children}</li>,
                    code: ({children, className}) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
                      ) : (
                        <code className="block bg-slate-100 text-slate-800 p-3 rounded text-sm font-mono overflow-x-auto">{children}</code>
                      );
                    },
                    pre: ({children}) => <pre className="bg-slate-100 p-3 rounded overflow-x-auto mb-2">{children}</pre>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 mb-2">{children}</blockquote>,
                    strong: ({children}) => <strong className="font-semibold text-slate-800">{children}</strong>,
                    em: ({children}) => <em className="italic">{children}</em>,
                  }}
                >
                  {readmeAnalysis}
                </ReactMarkdown>
              )}
              {analysisLoading && !readmeAnalysis && (
                <p className="text-slate-500 italic">开始分析...</p>
              )}
              {analysisLoading && readmeAnalysis && (
                <span className="inline-block w-2 h-5 bg-blue-600 animate-pulse ml-1">│</span>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Star size={18} className="text-amber-500 mr-2" />
            <span className="text-slate-700">{t('repository.stats.stars')}</span>
          </div>
          <p className="text-2xl font-semibold mt-1">{repository.stargazers_count.toLocaleString()}</p>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center">
            <GitFork size={18} className="text-indigo-500 mr-2" />
            <span className="text-slate-700">{t('repository.stats.forks')}</span>
          </div>
          <p className="text-2xl font-semibold mt-1">{repository.forks_count.toLocaleString()}</p>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Eye size={18} className="text-emerald-500 mr-2" />
            <span className="text-slate-700">{t('repository.stats.watchers')}</span>
          </div>
          <p className="text-2xl font-semibold mt-1">{repository.watchers_count.toLocaleString()}</p>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center">
            <AlertCircle size={18} className="text-rose-500 mr-2" />
            <span className="text-slate-700">{t('repository.stats.issues')}</span>
          </div>
          <p className="text-2xl font-semibold mt-1">{repository.open_issues_count.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">{t('repository.details.createdOn')}</p>
            <p className="font-medium">
              {format(new Date(repository.created_at), 'PPP')}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">{t('repository.details.lastUpdated')}</p>
            <p className="font-medium">
              {format(new Date(repository.updated_at), 'PPP')}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">{t('repository.details.defaultBranch')}</p>
            <p className="font-medium">{repository.default_branch}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">{t('repository.details.license')}</p>
            <p className="font-medium">{repository.license?.name || t('repository.details.noLicense')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryInfo; 