import { Repository, Language, Contributor, ActivityEvent, ComparableRepository } from '../types';

// Format data for export
export const formatRepositoryData = (
  repository: Repository | null,
  languages: Language[],
  contributors: Contributor[],
  activity: ActivityEvent[]
) => {
  if (!repository) return null;
  
  return {
    repository: {
      name: repository.name,
      full_name: repository.full_name,
      description: repository.description,
      url: repository.html_url,
      created_at: repository.created_at,
      updated_at: repository.updated_at,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      issues: repository.open_issues_count,
      watchers: repository.watchers_count,
      language: repository.language,
      topics: repository.topics,
      license: repository.license?.name || 'No license',
      size: repository.size,
    },
    languages: languages.map(lang => ({
      name: lang.name,
      bytes: lang.bytes,
      percentage: lang.percentage.toFixed(2),
    })),
    topContributors: contributors.slice(0, 20).map(contributor => ({
      username: contributor.login,
      contributions: contributor.contributions,
      profile: contributor.html_url,
    })),
    recentActivity: activity.slice(0, 30).map(event => ({
      type: event.type,
      user: event.actor.login,
      date: event.created_at,
      details: getEventDetails(event),
    })),
  };
};

// Format comparison data
export const formatComparisonData = (repos: ComparableRepository[]) => {
  return repos.map(repo => ({
    name: repo.name,
    full_name: repo.full_name,
    stars: repo.stars,
    forks: repo.forks,
    issues: repo.issues,
    language: repo.language,
    contributors: repo.contributors,
    last_update: repo.lastUpdate,
    created_at: repo.created_at,
  }));
};

// Helper to get event details
const getEventDetails = (event: ActivityEvent) => {
  switch (event.type) {
    case 'PushEvent':
      return `Pushed ${event.payload.commits?.length || 0} commits`;
    case 'PullRequestEvent':
      return `${event.payload.action} pull request #${event.payload.pull_request?.number}`;
    case 'IssuesEvent':
      return `${event.payload.action} issue #${event.payload.issue?.number}`;
    case 'IssueCommentEvent':
      return `Commented on issue #${event.payload.issue?.number}`;
    case 'CreateEvent':
      return `Created ${event.payload.ref_type} ${event.payload.ref || ''}`;
    case 'DeleteEvent':
      return `Deleted ${event.payload.ref_type} ${event.payload.ref || ''}`;
    case 'WatchEvent':
      return 'Starred the repository';
    case 'ForkEvent':
      return 'Forked the repository';
    default:
      return event.type;
  }
};

// Export as JSON
export const exportAsJson = (
  data: any,
  filename = 'github-analysis'
) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `${filename}.json`);
};

// Export as CSV
export const exportAsCSV = (
  data: any,
  filename = 'github-analysis'
) => {
  // Flatten nested objects for CSV
  const flattenedData = flattenObject(data);
  
  // Convert to CSV
  const csvContent = convertToCSV(flattenedData);
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
};

// Helper to download blob
const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
};

// Helper to flatten nested objects
const flattenObject = (obj: any, prefix = '') => {
  const result: Record<string, string> = {};
  
  // Handle arrays
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      if (typeof item === 'object' && item !== null) {
        const flatItem = flattenObject(item, `${prefix}${index}_`);
        Object.assign(result, flatItem);
      } else {
        result[`${prefix}${index}`] = String(item);
      }
    });
    return result;
  }
  
  // Handle objects
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const flattened = flattenObject(value, newKey);
      Object.assign(result, flattened);
    } else if (Array.isArray(value)) {
      // For arrays, we'll create indexed properties
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          const flatItem = flattenObject(item, `${newKey}[${index}]_`);
          Object.assign(result, flatItem);
        } else {
          result[`${newKey}[${index}]`] = String(item);
        }
      });
    } else {
      result[newKey] = String(value);
    }
  }
  
  return result;
};

// Helper to convert to CSV
const convertToCSV = (obj: Record<string, string>) => {
  const keys = Object.keys(obj);
  const headers = keys.join(',');
  const values = keys.map(key => {
    const value = obj[key];
    // Handle values with commas or quotes
    return value.includes(',') || value.includes('"') 
      ? `"${value.replace(/"/g, '""')}"` 
      : value;
  }).join(',');
  
  return `${headers}\n${values}`;
};