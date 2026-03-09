import { GithubCommitSummary, GithubRepository } from './github.model';
import { ManagedApp } from './static-app.model';

export type HealthStatus = 'online' | 'offline' | 'unknown';

export interface AppDashboardItem {
  app: ManagedApp;
  repository: GithubRepository | null;
  latestCommit: GithubCommitSummary | null;
  healthStatus: HealthStatus;
  lastCheckedAt: string;
}

export interface AppDetailView {
  app: ManagedApp;
  repository: GithubRepository | null;
  latestCommit: GithubCommitSummary | null;
  recentCommits: GithubCommitSummary[];
  healthStatus: HealthStatus;
  lastCheckedAt: string;
}
