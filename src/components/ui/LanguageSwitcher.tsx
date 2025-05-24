import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    // 更新 HTML lang 属性
    document.documentElement.lang = languageCode;
    setIsOpen(false); // 选择后关闭菜单
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-200 text-white border border-slate-600 hover:border-slate-500"
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      >
        <Globe size={16} className="mr-2 text-slate-300" />
        <span className="text-sm font-medium mr-1">{currentLanguage.nativeName}</span>
        <ChevronDown 
          size={14} 
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      {/* Language Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`block w-full text-left px-4 py-3 text-sm transition-all duration-150 ${
                  i18n.language === language.code
                    ? 'bg-teal-50 text-teal-700 font-medium border-r-2 border-teal-500'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">{language.flag}</span>
                  <div>
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-xs text-slate-500">{language.name}</div>
                  </div>
                  {i18n.language === language.code && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 