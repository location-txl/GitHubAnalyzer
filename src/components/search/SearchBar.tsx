import React, { useState, FormEvent } from 'react';
import { Search, History } from 'lucide-react';
import { Repository } from '../../types';

interface SearchBarProps {
  onSearch: (repoUrl: string) => void;
  recentRepositories: Repository[];
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, recentRepositories, isLoading }) => {
  const [searchInput, setSearchInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setShowHistory(false);
    }
  };
  
  const handleHistoryClick = (fullName: string) => {
    setSearchInput(fullName);
    onSearch(fullName);
    setShowHistory(false);
  };
  
  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full p-3 pl-10 pr-20 text-sm text-slate-900 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Enter repository URL or owner/name (e.g., facebook/react)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => recentRepositories.length > 0 && setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          />
          <button
            type="button"
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-teal-600"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History size={18} />
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 px-3 py-1.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </form>
      
      {/* Recent repositories dropdown */}
      {showHistory && recentRepositories.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg">
          <ul className="py-1 max-h-60 overflow-y-auto">
            {recentRepositories.map((repo) => (
              <li
                key={repo.id}
                className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                onClick={() => handleHistoryClick(repo.full_name)}
              >
                <div className="flex items-center">
                  <img
                    src={repo.owner.avatar_url}
                    alt={repo.owner.login}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="font-medium">{repo.full_name}</span>
                </div>
                {repo.description && (
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {repo.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;