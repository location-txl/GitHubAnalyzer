import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Key, X, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [token, setToken] = useState('');
  const [savedToken, setSavedToken] = useState('');
  const [showSettings, setShowSettings] = useState(false);

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
      setShowSettings(false);
      window.location.reload(); // Reload to apply new token
    }
  };

  const handleRemoveToken = () => {
    localStorage.removeItem('github_token');
    setSavedToken('');
    setShowSettings(false);
    window.location.reload(); // Reload to remove token
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveToken();
    }
  };

  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg border-b border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="bg-teal-500 p-2 rounded-lg mr-3">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('header.title')}</h1>
              <p className="text-sm text-slate-300 hidden md:block">{t('header.description')}</p>
            </div>
          </Link>
          
          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            
            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                  showSettings 
                    ? 'bg-slate-600 shadow-inner' 
                    : 'bg-slate-700 hover:bg-slate-600 shadow-sm'
                }`}
              >
                <Settings size={16} className="mr-2" />
                <span className="text-sm font-medium">{t('header.settings')}</span>
              </button>
              
              {/* Settings Dropdown Menu */}
              {showSettings && (
                <div className="absolute left-1/2 transform -translate-x-1/2 md:left-auto md:right-0 md:transform-none top-full mt-2 w-72 md:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">{t('header.settingsModal.title')}</h3>
                    <p className="text-sm text-slate-600">{t('header.settingsModal.description')}</p>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {/* Language Section - Mobile Only */}
                                          <div className="block sm:hidden">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-slate-700">{t('header.settingsModal.languageSettings')}</label>
                        </div>
                        <LanguageSwitcher />
                      </div>
                    
                    {/* Token Section */}
                                          <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-slate-700">{t('header.settingsModal.githubToken')}</label>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            savedToken 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {savedToken ? t('header.settingsModal.tokenConfigured') : t('header.settingsModal.tokenNotConfigured')}
                          </div>
                        </div>
                      
                      {!savedToken ? (
                        <div className="space-y-3">
                          <input
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={t('header.tokenModal.placeholder')}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          />
                          <button
                            onClick={handleSaveToken}
                            disabled={!token.trim()}
                            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg py-2 text-sm font-medium transition-colors"
                          >
                            <Key size={16} className="inline mr-2" />
                            {t('header.settingsModal.saveToken')}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center text-green-700">
                              <Key size={16} className="mr-2" />
                              <span className="text-sm font-medium">{t('header.settingsModal.tokenSaved')}</span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                              {t('header.settingsModal.tokenSavedDescription')}
                            </p>
                          </div>
                          <button
                            onClick={handleRemoveToken}
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                          >
                            <X size={16} className="inline mr-2" />
                            {t('header.settingsModal.removeToken')}
                          </button>
                        </div>
                      )}
                      
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700">
                          <strong>{t('header.settingsModal.tokenTip')}</strong>{t('header.settingsModal.tokenDescription')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Close Button */}
                  <div className="p-3 bg-slate-50 border-t border-slate-200">
                    <button
                      onClick={() => setShowSettings(false)}
                      className="w-full text-center text-sm text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      {t('header.settingsModal.closeSettings')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Click outside to close settings */}
      {showSettings && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSettings(false)}
        />
      )}
    </header>
  );
};

export default Header;