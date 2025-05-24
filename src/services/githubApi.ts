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
  const token = localStorage.getItem('github_token') ?? import.meta.env.VITE_APP_GITHUB_DEF_TOKEN;
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

export const getTrendingRepositories = async (): Promise<Repository[] | { error: string, status?: number }> => {
  try {
    const api = createApiInstance();
    // Get repositories with high stars created in the last month, sorted by stars
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const dateStr = lastMonth.toISOString().split('T')[0];
    
    const response = await api.get(`/search/repositories?q=created:>${dateStr} stars:>100&sort=stars&order=desc&per_page=3`);
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

// Function to get browser language and create appropriate system message
const getSystemMessage = (): string => {
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  
  // Map common language codes to instructions
  const languageInstructions: { [key: string]: string } = {
    'zh': '你是一个专门分析GitHub仓库的技术分析师。基于README内容提供简洁而全面的仓库总结。请用中文回答，重点关注主要功能、用途和技术方面。',
    'zh-CN': '你是一个专门分析GitHub仓库的技术分析师。基于README内容提供简洁而全面的仓库总结。请用中文回答，重点关注主要功能、用途和技术方面。',
    'zh-TW': '你是一個專門分析GitHub儲存庫的技術分析師。基於README內容提供簡潔而全面的儲存庫總結。請用繁體中文回答，重點關注主要功能、用途和技術方面。',
    'ja': 'あなたはGitHubリポジトリの分析を専門とする技術アナリストです。READMEの内容に基づいて、簡潔で包括的なリポジトリの要約を提供してください。日本語で回答し、主要な機能、目的、技術的側面に焦点を当ててください。',
    'ko': '당신은 GitHub 리포지토리 분석을 전문으로 하는 기술 분석가입니다. README 내용을 바탕으로 간결하면서도 포괄적인 리포지토리 요약을 제공해주세요. 한국어로 답변하시고, 주요 기능, 목적, 기술적 측면에 중점을 두세요.',
    'es': 'Eres un analista técnico especializado en analizar repositorios de GitHub. Proporciona un resumen conciso pero completo del repositorio basado en el contenido del README. Responde en español, enfócate en las características clave, el propósito y los aspectos técnicos.',
    'fr': 'Vous êtes un analyste technique spécialisé dans l\'analyse des dépôts GitHub. Fournissez un résumé concis mais complet du dépôt basé sur le contenu du README. Répondez en français, en vous concentrant sur les fonctionnalités clés, l\'objectif et les aspects techniques.',
    'de': 'Sie sind ein technischer Analyst, der sich auf die Analyse von GitHub-Repositories spezialisiert hat. Geben Sie eine prägnante, aber umfassende Zusammenfassung des Repositories basierend auf dem README-Inhalt. Antworten Sie auf Deutsch und konzentrieren Sie sich auf die wichtigsten Funktionen, den Zweck und die technischen Aspekte.',
    'ru': 'Вы технический аналитик, специализирующийся на анализе GitHub репозиториев. Предоставьте краткое, но всестороннее резюме репозитория на основе содержимого README. Отвечайте на русском языке, сосредоточьтесь на ключевых функциях, назначении и технических аспектах.',
    'pt': 'Você é um analista técnico especializado em analisar repositórios do GitHub. Forneça um resumo conciso, mas abrangente do repositório baseado no conteúdo do README. Responda em português, focando nas principais funcionalidades, propósito e aspectos técnicos.',
    'it': 'Sei un analista tecnico specializzato nell\'analisi dei repository GitHub. Fornisci un riassunto conciso ma completo del repository basato sul contenuto del README. Rispondi in italiano, concentrandoti sulle caratteristiche principali, lo scopo e gli aspetti tecnici.'
  };

  // Get language code (first two characters)
  const langCode = browserLang.toLowerCase().substring(0, 2);
  
  // Return specific instruction or default English
  return languageInstructions[browserLang.toLowerCase()] || 
         languageInstructions[langCode] || 
         'You are a technical analyst specializing in analyzing GitHub repositories. Provide a concise but comprehensive summary of the repository based on its README content. Focus on the key features, purpose, and technical aspects.';
};

export const analyzeReadme = async (
  owner: string, 
  repo: string, 
  onProgress?: (chunk: string) => void
): Promise<string | { error: string }> => {
  try {
    // First, get the README content using the configured API instance with token
    const api = createApiInstance();
    const readmeResponse = await api.get(`/repos/${owner}/${repo}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
      },
      timeout: 5000, // 5 second timeout for README fetch
    });

    if (!readmeResponse.data) {
      throw new Error('README not found');
    }

    const readmeContent = readmeResponse.data;

    // Get system message based on browser language
    const systemMessage = getSystemMessage();

    // Use fetch for streaming instead of axios
    const response = await fetch(`${import.meta.env.VITE_APP_AI_API_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_APP_AI_API_TOKEN}`,
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_APP_AI_MODEL,
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: readmeContent
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        stream: true, // Enable streaming
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    let fullContent = '';
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullContent += content;
                // Call progress callback if provided
                if (onProgress) {
                  onProgress(content);
                }
              }
            } catch (parseError) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (!fullContent) {
      throw new Error('No content received from analysis service');
    }

    return fullContent;
  } catch (error: any) {
    // Handle GitHub API errors first
    if (error.response) {
      const gitHubError = handleError(error);
      return gitHubError;
    }
    
    // Handle other errors
    if (error.name === 'AbortError') {
      return { error: 'Request was cancelled.' };
    }
    if (error.message?.includes('timeout')) {
      return { error: 'Request timed out. Please try again.' };
    }
    if (error.message?.includes('404')) {
      return { error: 'README not found in this repository.' };
    }
    return { error: error.message || 'Failed to analyze README' };
  }
};