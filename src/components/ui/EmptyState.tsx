import React, { useState, useEffect } from 'react';
import { GitBranch, Search, Star, GitFork, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTrendingRepositories } from '../../services/githubApi';
import { Repository } from '../../types';

interface EmptyStateProps {
  onRepositorySelect?: (repoFullName: string) => void;
}

// 备用热门项目数据
const fallbackTrendingRepos: Repository[] = [
  {
    id: 1,
    name: 'react',
    full_name: 'facebook/react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    stargazers_count: 227000,
    forks_count: 46000,
    language: 'JavaScript',
    owner: { 
      login: 'facebook', 
      avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
      html_url: 'https://github.com/facebook'
    },
    created_at: '2013-05-24T16:15:54Z',
    updated_at: '2024-01-01T00:00:00Z',
    pushed_at: '2024-01-01T00:00:00Z',
    html_url: 'https://github.com/facebook/react',
    open_issues_count: 679,
    watchers_count: 227000,
    topics: ['react', 'javascript', 'ui', 'frontend'],
    default_branch: 'main'
  },
  {
    id: 2,
    name: 'vue',
    full_name: 'vuejs/vue',
    description: 'Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.',
    stargazers_count: 207000,
    forks_count: 33000,
    language: 'TypeScript',
    owner: { 
      login: 'vuejs', 
      avatar_url: 'https://avatars.githubusercontent.com/u/6128107?v=4',
      html_url: 'https://github.com/vuejs'
    },
    created_at: '2013-07-29T03:24:51Z',
    updated_at: '2024-01-01T00:00:00Z',
    pushed_at: '2024-01-01T00:00:00Z',
    html_url: 'https://github.com/vuejs/vue',
    open_issues_count: 385,
    watchers_count: 207000,
    topics: ['vue', 'javascript', 'framework', 'frontend'],
    default_branch: 'main'
  },
  {
    id: 3,
    name: 'angular',
    full_name: 'angular/angular',
    description: 'The modern web developer\'s platform',
    stargazers_count: 95000,
    forks_count: 25000,
    language: 'TypeScript',
    owner: { 
      login: 'angular', 
      avatar_url: 'https://avatars.githubusercontent.com/u/139426?v=4',
      html_url: 'https://github.com/angular'
    },
    created_at: '2010-09-03T22:26:26Z',
    updated_at: '2024-01-01T00:00:00Z',
    pushed_at: '2024-01-01T00:00:00Z',
    html_url: 'https://github.com/angular/angular',
    open_issues_count: 1634,
    watchers_count: 95000,
    topics: ['angular', 'typescript', 'framework', 'frontend'],
    default_branch: 'main'
  }
];

const EmptyState: React.FC<EmptyStateProps> = ({ onRepositorySelect }) => {
  const { t } = useTranslation();
  const [trendingRepos, setTrendingRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingRepos = async () => {
      try {
        const result = await getTrendingRepositories();
        if ('error' in result) {
          console.error('Failed to fetch trending repositories:', result.error);
          // 使用备用数据
          setTrendingRepos(fallbackTrendingRepos);
        } else {
          setTrendingRepos(result.length > 0 ? result : fallbackTrendingRepos);
        }
      } catch (error) {
        console.error('Error fetching trending repositories:', error);
        // 使用备用数据
        setTrendingRepos(fallbackTrendingRepos);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingRepos();
  }, []);

  const handleRepoClick = (repo: Repository) => {
    if (onRepositorySelect) {
      onRepositorySelect(repo.full_name);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="bg-slate-100 p-4 rounded-full mb-6">
          <GitBranch size={48} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          {t('emptyState.title')}
        </h2>
        <p className="text-slate-600 text-center max-w-md mb-6">
          {t('emptyState.subtitle')}
        </p>
        <div className="flex items-center text-teal-600 bg-teal-50 px-4 py-3 rounded-lg">
          <Search size={20} className="mr-2" />
          <p className="text-sm">{t('emptyState.searchPrompt')}</p>
        </div>
        
        {/* 热门项目推荐 */}
        <div className="mt-8 w-full max-w-4xl">
          <div className="flex items-center mb-4">
            <TrendingUp size={20} className="text-orange-500 mr-2" />
            <h3 className="text-lg font-semibold text-slate-800">{t('emptyState.trending')}</h3>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="animate-pulse">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded mb-3 w-3/4"></div>
                    <div className="flex space-x-4">
                      <div className="h-3 bg-slate-200 rounded w-12"></div>
                      <div className="h-3 bg-slate-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingRepos.map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => handleRepoClick(repo)}
                  className="border border-slate-200 rounded-lg p-4 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <h4 className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors mb-1">
                    {repo.name}
                  </h4>
                  <p className="text-xs text-slate-500 mb-2">{repo.owner.login}</p>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {repo.description || t('common.noDescription')}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Star size={12} className="mr-1" />
                        {formatNumber(repo.stargazers_count)}
                      </div>
                      <div className="flex items-center">
                        <GitFork size={12} className="mr-1" />
                        {formatNumber(repo.forks_count)}
                      </div>
                    </div>
                    {repo.language && (
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                        {repo.language}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && trendingRepos.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">Unable to fetch trending projects at the moment</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">{t('emptyState.features.statistics.title')}</h3>
            <p className="text-sm text-slate-600">{t('emptyState.features.statistics.description')}</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">{t('emptyState.features.codeAnalysis.title')}</h3>
            <p className="text-sm text-slate-600">{t('emptyState.features.codeAnalysis.description')}</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">{t('emptyState.features.contributors.title')}</h3>
            <p className="text-sm text-slate-600">{t('emptyState.features.contributors.description')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;