// GitHub API Types

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  topics: string[];
  default_branch: string;
  license?: {
    key: string;
    name: string;
    url: string;
  };
  subscribers_count?: number;
  network_count?: number;
  size?: number;
}

export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

export interface Language {
  name: string;
  bytes: number;
  percentage: number;
}

export interface ActivityEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
    url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    master_branch?: string;
    description?: string;
    pusher_type?: string;
    push_id?: number;
    size?: number;
    distinct_size?: number;
    commits?: Array<{
      sha: string;
      message: string;
      author: {
        name: string;
        email: string;
      };
      url: string;
      distinct: boolean;
    }>;
    pull_request?: {
      url: string;
      id: number;
      number: number;
      state: string;
      title: string;
      body: string;
      created_at: string;
      updated_at: string;
    };
    issue?: {
      url: string;
      id: number;
      number: number;
      title: string;
      state: string;
    };
    comment?: {
      url: string;
      html_url: string;
      id: number;
      body: string;
    };
  };
  created_at: string;
  public: boolean;
}

export interface ComparableRepository {
  id: number;
  name: string;
  full_name: string;
  stars: number;
  forks: number;
  issues: number;
  language: string;
  contributors: number;
  lastUpdate: string;
  created_at: string;
}

export interface AnalysisState {
  repositories: Repository[];
  currentRepository: Repository | null;
  languages: Language[];
  contributors: Contributor[];
  activity: ActivityEvent[];
  comparisonList: ComparableRepository[];
  loading: {
    repository: boolean;
    languages: boolean;
    contributors: boolean;
    activity: boolean;
  };
  error: {
    repository: string | null;
    languages: string | null;
    contributors: string | null;
    activity: string | null;
  };
}