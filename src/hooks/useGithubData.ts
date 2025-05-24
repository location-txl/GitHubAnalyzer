import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
  getRepository, 
  getLanguages, 
  getContributors, 
  getRecentActivity,
  parseRepoUrl
} from '../services/githubApi';
import { Repository, Language, Contributor, ActivityEvent, AnalysisState } from '../types';

const initialState: AnalysisState = {
  repositories: [],
  currentRepository: null,
  languages: [],
  contributors: [],
  activity: [],
  comparisonList: [],
  loading: {
    repository: false,
    languages: false,
    contributors: false,
    activity: false,
  },
  error: {
    repository: null,
    languages: null,
    contributors: null,
    activity: null,
  }
};

export function useGithubData() {
  const [state, setState] = useState<AnalysisState>(initialState);
  
  // Reset all data
  const resetData = useCallback(() => {
    setState({
      ...initialState,
      repositories: state.repositories, // Keep search history
      comparisonList: state.comparisonList, // Keep comparison list
    });
  }, [state.repositories, state.comparisonList]);
  
  // Fetch repository data
  const fetchRepositoryData = useCallback(async (repoUrl: string) => {
    // Reset current data
    resetData();
    
    // Parse repo URL
    const repoInfo = parseRepoUrl(repoUrl);
    if (!repoInfo) {
      toast.error('Invalid repository format. Use owner/repo or full GitHub URL');
      return;
    }
    
    const { owner, repo } = repoInfo;
    
    // Set loading state
    setState(prev => ({
      ...prev,
      loading: {
        repository: true,
        languages: true,
        contributors: true,
        activity: true,
      }
    }));
    
    // Fetch repository
    const repoData = await getRepository(owner, repo);
    
    if ('error' in repoData) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, repository: false },
        error: { ...prev.error, repository: repoData.error }
      }));
      toast.error(repoData.error);
      return;
    }
    
    // Update repository state
    setState(prev => ({
      ...prev,
      currentRepository: repoData as Repository,
      repositories: [repoData as Repository, ...prev.repositories.filter(r => r.id !== repoData.id)].slice(0, 10),
      loading: { ...prev.loading, repository: false }
    }));
    
    // Fetch languages
    const languageData = await getLanguages(owner, repo);
    
    if ('error' in languageData) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, languages: false },
        error: { ...prev.error, languages: languageData.error }
      }));
    } else {
      setState(prev => ({
        ...prev,
        languages: languageData as Language[],
        loading: { ...prev.loading, languages: false }
      }));
    }
    
    // Fetch contributors
    const contributorData = await getContributors(owner, repo);
    
    if ('error' in contributorData) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, contributors: false },
        error: { ...prev.error, contributors: contributorData.error }
      }));
    } else {
      setState(prev => ({
        ...prev,
        contributors: contributorData as Contributor[],
        loading: { ...prev.loading, contributors: false }
      }));
    }
    
    // Fetch activity
    const activityData = await getRecentActivity(owner, repo);
    
    if ('error' in activityData) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, activity: false },
        error: { ...prev.error, activity: activityData.error }
      }));
    } else {
      setState(prev => ({
        ...prev,
        activity: activityData as ActivityEvent[],
        loading: { ...prev.loading, activity: false }
      }));
    }
  }, [resetData]);
  
  // Add repository to comparison list
  const addToComparison = useCallback(() => {
    const { currentRepository, contributors } = state;
    
    if (!currentRepository) return;
    
    // Check if already in comparison list
    if (state.comparisonList.some(repo => repo.id === currentRepository.id)) {
      toast.error('This repository is already in the comparison list');
      return;
    }
    
    // Limit to 3 repositories
    if (state.comparisonList.length >= 3) {
      toast.error('You can compare up to 3 repositories. Remove one to add another.');
      return;
    }
    
    const comparableRepo = {
      id: currentRepository.id,
      name: currentRepository.name,
      full_name: currentRepository.full_name,
      stars: currentRepository.stargazers_count,
      forks: currentRepository.forks_count,
      issues: currentRepository.open_issues_count,
      language: currentRepository.language,
      contributors: contributors.length,
      lastUpdate: currentRepository.updated_at,
      created_at: currentRepository.created_at
    };
    
    setState(prev => ({
      ...prev,
      comparisonList: [...prev.comparisonList, comparableRepo]
    }));
    
    toast.success('Added to comparison list');
  }, [state]);
  
  // Remove repository from comparison list
  const removeFromComparison = useCallback((repoId: number) => {
    setState(prev => ({
      ...prev,
      comparisonList: prev.comparisonList.filter(repo => repo.id !== repoId)
    }));
    
    toast.success('Removed from comparison list');
  }, []);
  
  // Clear comparison list
  const clearComparison = useCallback(() => {
    setState(prev => ({
      ...prev,
      comparisonList: []
    }));
    
    toast.success('Comparison list cleared');
  }, []);
  
  return {
    ...state,
    fetchRepositoryData,
    addToComparison,
    removeFromComparison,
    clearComparison,
    resetData
  };
}