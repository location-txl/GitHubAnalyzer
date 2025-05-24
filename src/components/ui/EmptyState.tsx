import React from 'react';
import { GitBranch, Search } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="bg-slate-100 p-4 rounded-full mb-6">
          <GitBranch size={48} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Welcome to GitHub Analyzer
        </h2>
        <p className="text-slate-600 text-center max-w-md mb-6">
          Enter a GitHub repository URL or owner/name (e.g., facebook/react) in the search bar above to start analyzing.
        </p>
        <div className="flex items-center text-teal-600 bg-teal-50 px-4 py-3 rounded-lg">
          <Search size={20} className="mr-2" />
          <p className="text-sm">Search for a repository to get started</p>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Project Statistics</h3>
            <p className="text-sm text-slate-600">Analyze stars, forks, issues, and more</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Code Analysis</h3>
            <p className="text-sm text-slate-600">View language distribution and code metrics</p>
          </div>
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Contributor Insights</h3>
            <p className="text-sm text-slate-600">See who contributes to the project</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;