import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="flex items-center text-sm">
              Made with <Heart size={14} className="mx-1 text-red-400" /> for GitHub developers
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/location-txl/GitHubAnalyzer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-teal-400 transition-colors flex items-center"
            >
              <Github size={16} className="mr-1" />
              GitHub
            </a>
            <span className="text-sm">
              GitHub API &copy; {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;