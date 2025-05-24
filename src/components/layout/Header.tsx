import React, { useState, useEffect } from 'react';
import { Activity, Key, X } from 'lucide-react';

const Header: React.FC = () => {
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [token, setToken] = useState('');
  const [savedToken, setSavedToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('github_token');
    if (storedToken) {
      setSavedToken(storedToken);
    }
  }, []);

  const handleSaveToken = () => {
    if (token) {
      localStorage.setItem('github_token', token);
      setSavedToken(token);
      setToken('');
      setShowTokenInput(false);
      window.location.reload(); // Reload to apply new token
    }
  };

  const handleRemoveToken = () => {
    localStorage.removeItem('github_token');
    setSavedToken('');
    window.location.reload(); // Reload to remove token
  };

  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Activity size={28} className="text-teal-400 mr-2" />
            <h1 className="text-2xl font-bold">GitHub Analyzer</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-300">
              Comprehensive analysis for GitHub repositories
            </div>
            <div className="relative">
              {!showTokenInput && !savedToken && (
                <button
                  onClick={() => setShowTokenInput(true)}
                  className="flex items-center px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <Key size={14} className="mr-1" />
                  Add Token
                </button>
              )}
              
              {showTokenInput && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-50">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-slate-800 font-medium">GitHub Token</h3>
                    <button
                      onClick={() => setShowTokenInput(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your GitHub token"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-800 text-sm mb-2"
                  />
                  <button
                    onClick={handleSaveToken}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md py-2 text-sm"
                  >
                    Save Token
                  </button>
                  <p className="text-xs text-slate-500 mt-2">
                    Token will be stored locally and used for API requests
                  </p>
                </div>
              )}
              
              {savedToken && (
                <button
                  onClick={handleRemoveToken}
                  className="flex items-center px-3 py-1.5 text-sm bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                >
                  <X size={14} className="mr-1" />
                  Remove Token
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;