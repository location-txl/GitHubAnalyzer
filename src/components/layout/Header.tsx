import React, { useState, useEffect } from 'react';
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
          <div className="flex items-center">
            <div className="bg-teal-500 p-2 rounded-lg mr-3">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('header.title')}</h1>
              <p className="text-sm text-slate-300 hidden md:block">{t('header.description')}</p>
            </div>
          </div>
          
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
                <span className="text-sm font-medium">设置</span>
              </button>
              
              {/* Settings Dropdown Menu */}
              {showSettings && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">设置选项</h3>
                    <p className="text-sm text-slate-600">配置您的GitHub访问和语言偏好</p>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {/* Language Section - Mobile Only */}
                    <div className="block sm:hidden">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">语言设置</label>
                      </div>
                      <LanguageSwitcher />
                    </div>
                    
                    {/* Token Section */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-slate-700">GitHub访问令牌</label>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          savedToken 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {savedToken ? '已配置' : '未配置'}
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
                            保存令牌
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center text-green-700">
                              <Key size={16} className="mr-2" />
                              <span className="text-sm font-medium">令牌已配置</span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                              令牌已保存，可以访问更多API功能
                            </p>
                          </div>
                          <button
                            onClick={handleRemoveToken}
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                          >
                            <X size={16} className="inline mr-2" />
                            移除令牌
                          </button>
                        </div>
                      )}
                      
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700">
                          <strong>提示：</strong>GitHub令牌可以提高API请求限制并访问私有仓库。
                          令牌仅存储在本地浏览器中。
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
                      关闭设置
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