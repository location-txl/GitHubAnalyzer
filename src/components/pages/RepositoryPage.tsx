import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGithubData } from '../../hooks/useGithubData';
import SearchBar from '../search/SearchBar';
import RepositoryInfo from '../project/RepositoryInfo';
import CodeStats from '../project/CodeStats';
import ContributorsList from '../project/ContributorsList';
import ActivityFeed from '../project/ActivityFeed';
import ComparisonView from '../comparison/ComparisonView';
import EmptyState from '../ui/EmptyState';

const RepositoryPage: React.FC = () => {
  const { t } = useTranslation();
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const navigate = useNavigate();
  const currentRepoRef = useRef<string>('');
  
  const { 
    currentRepository,
    repositories,
    languages,
    contributors,
    activity,
    comparisonList,
    loading,
    error,
    fetchRepositoryData,
    addToComparison,
    removeFromComparison,
    clearComparison
  } = useGithubData();
  
  // Auto-load repository data when route parameters change
  useEffect(() => {
    if (owner && repo) {
      const repoIdentifier = `${owner}/${repo}`;
      
      // 避免重复请求同一个仓库
      if (currentRepoRef.current === repoIdentifier) {
        return;
      }
      
      // 检查当前仓库是否已经是我们想要的仓库
      if (currentRepository && currentRepository.full_name === repoIdentifier) {
        currentRepoRef.current = repoIdentifier;
        return;
      }
      
      currentRepoRef.current = repoIdentifier;
      fetchRepositoryData(repoIdentifier);
    }
  }, [owner, repo, fetchRepositoryData, currentRepository?.full_name]);
  
  const isAnyLoading = Object.values(loading).some(state => state);
  
  // Handle search with URL update
  const handleSearch = (repoUrl: string) => {
    // Parse repo URL to extract owner and repo
    const match = repoUrl.match(/(?:github\.com\/)?([^\/]+)\/([^\/\s]+)/);
    if (match) {
      const [, newOwner, newRepo] = match;
      // Clean repo name from .git suffix if present
      const cleanRepo = newRepo.replace(/\.git$/, '');
      // Navigate to the new URL
      navigate(`/${newOwner}/${cleanRepo}`);
    } else {
      // If it's not a valid format, still try to fetch the data
      fetchRepositoryData(repoUrl);
    }
  };
  
  const handleRepositorySelect = (repoUrl: string) => {
    handleSearch(repoUrl);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">{t('search.title', 'Search GitHub Repository')}</h2>
        <SearchBar 
          onSearch={handleSearch} 
          recentRepositories={repositories}
          isLoading={isAnyLoading}
        />
      </div>
      
      {!currentRepository && !isAnyLoading ? (
        <EmptyState onRepositorySelect={handleRepositorySelect} />
      ) : (
        <>
          {/* Repository Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RepositoryInfo 
                repository={currentRepository} 
                loading={loading.repository}
                error={error.repository}
                onAddToComparison={addToComparison}
              />
            </div>
            
            <div>
              <CodeStats 
                languages={languages} 
                loading={loading.languages}
                error={error.languages}
              />
            </div>
          </div>
          
          {/* Contributors and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ContributorsList 
                contributors={contributors} 
                loading={loading.contributors}
                error={error.contributors}
              />
            </div>
            
            <div className="lg:col-span-2">
              <ActivityFeed 
                activities={activity} 
                loading={loading.activity}
                error={error.activity}
              />
            </div>
          </div>
        </>
      )}
      
      {/* Comparison View */}
      {comparisonList.length > 0 && (
        <ComparisonView 
          repositories={comparisonList}
          onRemoveRepository={removeFromComparison}
          onClearAll={clearComparison}
        />
      )}
    </div>
  );
};

export default RepositoryPage; 