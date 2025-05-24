import React from 'react';
import { Users, AlertCircle, ExternalLink } from 'lucide-react';
import { Contributor } from '../../types';
import LoadingCard from '../ui/LoadingCard';
import { useTranslation } from 'react-i18next';

interface ContributorsListProps {
  contributors: Contributor[];
  loading: boolean;
  error: string | null;
}

const ContributorsList: React.FC<ContributorsListProps> = ({ contributors, loading, error }) => {
  const { t } = useTranslation();
  if (loading) {
    return <LoadingCard title={t('contributors.loading')} />;
  }
  
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-full">
        <div className="flex items-center text-red-500 mb-4">
          <AlertCircle size={20} className="mr-2" />
          <h3 className="text-lg font-medium">{t('contributors.error')}</h3>
        </div>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }
  
  if (!contributors || contributors.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-full">
        <h2 className="text-xl font-semibold mb-4">{t('contributors.title')}</h2>
        <div className="flex flex-col items-center justify-center py-8">
          <Users size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 text-center">{t('contributors.noData')}</p>
        </div>
      </div>
    );
  }
  
  // Calculate total contributions
  const totalContributions = contributors.reduce((sum, contributor) => sum + contributor.contributions, 0);
  
  // Sort contributors by contributions
  const sortedContributors = [...contributors]
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 10); // Show only top 10
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-full">
      <h2 className="text-xl font-semibold mb-4">{t('contributors.title')}</h2>
      
      <div className="mb-4">
        <p className="text-slate-600 mb-1">{t('contributors.totalContributors')}</p>
        <p className="text-2xl font-semibold">{contributors.length}</p>
      </div>
      
      <div className="space-y-4 mt-6">
        {sortedContributors.map((contributor) => {
          // Calculate percentage of total contributions
          const percentage = (contributor.contributions / totalContributions) * 100;
          
          return (
            <div key={contributor.id} className="flex items-center">
              <img
                src={contributor.avatar_url}
                alt={contributor.login}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <p className="font-medium text-slate-800">{contributor.login}</p>
                    <a
                      href={contributor.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-slate-400 hover:text-teal-600"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <p className="text-sm font-medium">
                    {contributor.contributions} commits
                  </p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
        
        {contributors.length > 10 && (
          <p className="text-sm text-slate-500 text-center mt-4">
            + {contributors.length - 10} {t('contributors.moreContributors')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContributorsList;