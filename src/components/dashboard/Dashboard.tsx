import React from 'react';
import { useGithubData } from '../../hooks/useGithubData';
import SearchBar from '../search/SearchBar';
import RepositoryInfo from '../project/RepositoryInfo';
import CodeStats from '../project/CodeStats';
import ContributorsList from '../project/ContributorsList';
import ActivityFeed from '../project/ActivityFeed';
import ComparisonView from '../comparison/ComparisonView';
import EmptyState from '../ui/EmptyState';

const Dashboard: React.FC = () => {
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
  
  const isAnyLoading = Object.values(loading).some(state => state);
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">Search GitHub Repository</h2>
        <SearchBar 
          onSearch={fetchRepositoryData} 
          recentRepositories={repositories}
          isLoading={isAnyLoading}
        />
      </div>
      
      {!currentRepository && !isAnyLoading ? (
        <EmptyState onRepositorySelect={fetchRepositoryData} />
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

export default Dashboard;