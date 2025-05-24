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
    // First, get the README content
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
      },
    });

    if (!response.ok) {
      throw new Error('README not found');
    }

    const readmeContent = await response.text();

    // Then, analyze it with OpenAI
    const openaiResponse = await fetch('https://api.v3.cm/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-bjVyHrUs47OXpZ6n2d058d0337E4469eB7F01948D730B0Cd`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a technical analyst specializing in analyzing GitHub repositories. Provide a concise but comprehensive summary of the repository based on its README content. Focus on the key features, purpose, and technical aspects.'
          },
          {
            role: 'user',
            content: readmeContent
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error('Failed to analyze README');
    }

    const data = await openaiResponse.json();
    return data.choices[0].message.content;
  } catch (error) {
    return { error: error.message };
  }
};