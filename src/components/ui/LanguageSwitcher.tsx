import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('language', languageCode);
    // 更新 HTML lang 属性
    document.documentElement.lang = languageCode;
    setIsOpen(false); // 选择后关闭菜单
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white">
        <Globe size={14} className="mr-1" />
        {languages.find(lang => lang.code === i18n.language)?.nativeName || 'English'}
      </button>
      
      {/* 透明桥接区域 */}
      {isOpen && (
        <div className="absolute right-0 top-full w-36 pt-2 z-50">
          <div className="bg-white rounded-md shadow-lg border border-slate-200">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    i18n.language === language.code
                      ? 'bg-teal-50 text-teal-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {language.nativeName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 