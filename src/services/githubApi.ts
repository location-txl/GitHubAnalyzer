import axios from 'axios';
import { Repository, Contributor, Language, ActivityEvent } from '../types';

// GitHub API base URL
const BASE_URL = 'https://api.github.com';

// Create axios instance with dynamic token handling
const createApiInstance = () => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  // Get token from localStorage
  const token = localStorage.getItem('github_token');
  if (token) {
    instance.defaults.headers.common['Authorization'] = `token ${token}`;
  }

  return instance;
};

// Function to handle errors
const handleError = (error: any) => {
  const message = error.response?.data?.message || 'An error occurred with the GitHub API';
  const status = error.response?.status;
  
  // Check for rate limiting
  if (status === 403 && error.response?.data?.message.includes('rate limit')) {
    return { 
      error: 'GitHub API rate limit exceeded. Please add a GitHub token to increase the limit.',
      status,
    };
  }
  
  return { error: message, status };
};

export const getRepository = async (owner: string, repo: string): Promise<Repository | { error: string, status?: number }> => {
  try {
    const api = createApiInstance();
    const response = await api.get(`/repos/${owner}/${repo}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getLanguages = async (owner: string, repo: string): Promise<Language[] | { error: string, status?: number }> => {
  try {
    const api = createApiInstance();
    const response = await api.get(`/repos/${owner}/${repo}/languages`);
    
    // Convert language data to array format
    const languages = Object.entries(response.data).map(([name, bytes]) => ({
      name,
      bytes: bytes as number,
      percentage: 0, // Calculate this after
    }));
    
    // Calculate percentages
    const total = languages.reduce((sum, lang) => sum + lang.bytes, 0);
    return languages.map(lang => ({
      ...lang,
      percentage: total > 0 ? (lang.bytes / total) * 100 : 0,
    }));
  } catch (error) {
    return handleError(error);
  }
};

export const getContributors = async (owner: string, repo: string): Promise<Contributor[] | { error: string, status?: number }> => {
  try {
    const api = createApiInstance();
    const response = await api.get(`/repos/${owner}/${repo}/contributors`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getRecentActivity = async (owner: string, repo: string): Promise<ActivityEvent[] | { error: string, status?: number }> => {
  try {
    const api = createApiInstance();
    const response = await api.get(`/repos/${owner}/${repo}/events?per_page=30`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const searchRepositories = async (query: string): Promise<Repository[] | { error: string, status?: number }> => {
  try {
    const api = createApiInstance();
    const response = await api.get(`/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc`);
    return response.data.items;
  } catch (error) {
    return handleError(error);
  }
};

export const parseRepoUrl = (url: string): { owner: string, repo: string } | null => {
  // Handle full GitHub URLs
  const githubUrlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
  const githubMatch = url.match(githubUrlPattern);
  
  if (githubMatch) {
    return {
      owner: githubMatch[1],
      repo: githubMatch[2].replace('.git', '')
    };
  }
  
  // Handle owner/repo format
  const simplePattern = /^([^\/]+)\/([^\/]+)$/;
  const simpleMatch = url.match(simplePattern);
  
  if (simpleMatch) {
    return {
      owner: simpleMatch[1],
      repo: simpleMatch[2].replace('.git', '')
    };
  }
  
  return null;
};

export const analyzeReadme = async (owner: string, repo: string): Promise<string | { error: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-readme`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ owner, repo }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze README');
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    return { error: error.message };
  }
};