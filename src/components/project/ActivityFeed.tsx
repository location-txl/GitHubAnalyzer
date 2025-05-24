import React, { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  ActivitySquare, 
  GitPullRequest, 
  GitMerge,
  GitBranch,
  GitCommit,
  Star,
  AlertCircle,
  MessageSquare,
  MoreHorizontal,
  GitFork
} from 'lucide-react';
import { ActivityEvent } from '../../types';
import LoadingCard from '../ui/LoadingCard';

interface ActivityFeedProps {
  activities: ActivityEvent[];
  loading: boolean;
  error: string | null;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, loading, error }) => {
  const [filter, setFilter] = useState<string>('all');
  
  if (loading) {
    return <LoadingCard title="Recent Activity" height="lg" />;
  }
  
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center text-red-500 mb-4">
          <AlertCircle size={20} className="mr-2" />
          <h3 className="text-lg font-medium">Error Loading Activity</h3>
        </div>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }
  
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="flex flex-col items-center justify-center py-8">
          <ActivitySquare size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-500 text-center">No recent activity available</p>
        </div>
      </div>
    );
  }
  
  // Get unique event types for filter
  const eventTypes = ['all', ...new Set(activities.map(event => event.type))];
  
  // Filter activities
  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(activity => activity.type === filter);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        
        <div className="mt-2 sm:mt-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="py-1 px-3 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Activities' : formatEventType(type)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="space-y-4 mt-4 max-h-[500px] overflow-y-auto pr-2">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="flex">
            <div className="mr-4 flex-shrink-0">
              {getEventIcon(activity.type)}
            </div>
            <div className="flex-grow pb-4 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-800">
                    <span className="font-medium">{activity.actor.login}</span>{' '}
                    {formatEventAction(activity)}
                  </p>
                  {activity.payload.commits && activity.payload.commits.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {activity.payload.commits.slice(0, 3).map((commit) => (
                        <div key={commit.sha} className="flex items-start text-sm">
                          <GitCommit size={14} className="text-slate-400 mr-1 mt-1 flex-shrink-0" />
                          <p className="text-slate-600 truncate">
                            {commit.message}
                          </p>
                        </div>
                      ))}
                      {activity.payload.commits.length > 3 && (
                        <p className="text-xs text-slate-500 ml-5">
                          + {activity.payload.commits.length - 3} more commits
                        </p>
                      )}
                    </div>
                  )}
                  {activity.payload.pull_request && (
                    <p className="mt-1 text-sm text-slate-600 truncate">
                      {activity.payload.pull_request.title}
                    </p>
                  )}
                  {activity.payload.issue && (
                    <p className="mt-1 text-sm text-slate-600 truncate">
                      {activity.payload.issue.title}
                    </p>
                  )}
                </div>
                <div className="text-xs text-slate-500 whitespace-nowrap ml-4" title={format(new Date(activity.created_at), 'PPpp')}>
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper to get icon based on event type
const getEventIcon = (type: string) => {
  const iconClasses = "p-2 rounded-full bg-slate-100";
  
  switch (type) {
    case 'PushEvent':
      return <GitCommit size={16} className={`${iconClasses} text-emerald-600`} />;
    case 'PullRequestEvent':
      return <GitPullRequest size={16} className={`${iconClasses} text-purple-600`} />;
    case 'IssuesEvent':
      return <AlertCircle size={16} className={`${iconClasses} text-amber-600`} />;
    case 'IssueCommentEvent':
      return <MessageSquare size={16} className={`${iconClasses} text-blue-600`} />;
    case 'CreateEvent':
      return <GitBranch size={16} className={`${iconClasses} text-teal-600`} />;
    case 'DeleteEvent':
      return <GitBranch size={16} className={`${iconClasses} text-red-600`} />;
    case 'WatchEvent':
      return <Star size={16} className={`${iconClasses} text-amber-500`} />;
    case 'ForkEvent':
      return <GitFork size={16} className={`${iconClasses} text-indigo-600`} />;
    default:
      return <MoreHorizontal size={16} className={`${iconClasses} text-slate-600`} />;
  }
};

// Helper to format event type for display
const formatEventType = (type: string): string => {
  return type
    .replace('Event', '')
    .replace(/([A-Z])/g, ' $1')
    .trim();
};

// Helper to format event action for display
const formatEventAction = (event: ActivityEvent): string => {
  switch (event.type) {
    case 'PushEvent':
      return `pushed ${event.payload.commits?.length || 0} commits`;
    case 'PullRequestEvent':
      return `${event.payload.action} pull request #${event.payload.pull_request?.number}`;
    case 'IssuesEvent':
      return `${event.payload.action} issue #${event.payload.issue?.number}`;
    case 'IssueCommentEvent':
      return `commented on issue #${event.payload.issue?.number}`;
    case 'CreateEvent':
      return `created ${event.payload.ref_type} ${event.payload.ref || ''}`;
    case 'DeleteEvent':
      return `deleted ${event.payload.ref_type} ${event.payload.ref || ''}`;
    case 'WatchEvent':
      return 'starred the repository';
    case 'ForkEvent':
      return 'forked the repository';
    default:
      return event.type.replace('Event', '').toLowerCase();
  }
};

export default ActivityFeed;