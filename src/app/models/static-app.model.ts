export type AppFramework = 'angular' | 'react' | 'other' | string;

export interface StaticAppConfig {
  name: string;
  repo: string;
  framework: AppFramework;
  domain: string;
  githubRepoUrl: string;
}

export interface StaticAppsConfig {
  apps: StaticAppConfig[];
}

export interface ManagedApp extends StaticAppConfig {
  id: string;
  owner: string;
  repo: string;
  siteUrl: string;
}
