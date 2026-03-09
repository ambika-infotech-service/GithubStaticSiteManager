import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, of, shareReplay, switchMap, timer } from 'rxjs';
import { AppDashboardItem, AppDetailView } from '../models/dashboard.model';
import { ManagedApp, StaticAppConfig } from '../models/static-app.model';
import { ConfigLoaderService } from './config-loader.service';
import { GithubService } from './github.service';
import { HealthCheckService } from './health-check.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly configLoader = inject(ConfigLoaderService);
  private readonly githubService = inject(GithubService);
  private readonly healthCheckService = inject(HealthCheckService);

  private readonly apps$ = this.configLoader.getAppsConfig().pipe(
    map((config) => config.apps.map((app) => this.normalizeApp(app))),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  watchDashboardApps(intervalMs = 60_000): Observable<AppDashboardItem[]> {
    return timer(0, intervalMs).pipe(
      switchMap(() =>
        this.apps$.pipe(
          switchMap((apps) => {
            if (apps.length === 0) {
              return of([]);
            }

            return forkJoin(apps.map((app) => this.buildDashboardItem(app)));
          }),
        ),
      ),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  getAppDetail(appId: string): Observable<AppDetailView | null> {
    return this.apps$.pipe(
      map((apps) => apps.find((app) => app.id === appId) ?? null),
      switchMap((app) => {
        if (!app) {
          return of(null);
        }

        return forkJoin({
          repository: this.githubService.getRepositorySafe(app.owner, app.repo),
          latestCommit: this.githubService.getLatestCommitSafe(app.owner, app.repo),
          recentCommits: this.githubService.getLatestCommitsSafe(app.owner, app.repo, 8),
          healthStatus: this.healthCheckService.checkSite(app.siteUrl),
        }).pipe(
          map((payload) => ({
            app,
            repository: payload.repository,
            latestCommit: payload.latestCommit,
            recentCommits: payload.recentCommits,
            healthStatus: payload.healthStatus,
            lastCheckedAt: new Date().toISOString(),
          })),
        );
      }),
    );
  }

  private buildDashboardItem(app: ManagedApp): Observable<AppDashboardItem> {
    return forkJoin({
      repository: this.githubService.getRepositorySafe(app.owner, app.repo),
      latestCommit: this.githubService.getLatestCommitSafe(app.owner, app.repo),
      healthStatus: this.healthCheckService.checkSite(app.siteUrl),
    }).pipe(
      map((payload) => ({
        app,
        repository: payload.repository,
        latestCommit: payload.latestCommit,
        healthStatus: payload.healthStatus,
        lastCheckedAt: new Date().toISOString(),
      })),
    );
  }

  private normalizeApp(app: StaticAppConfig): ManagedApp {
    const { owner, repo } = this.extractGithubParts(app.githubRepoUrl, app.repo);
    const siteUrl = this.normalizeDomainToUrl(app.domain);
    const isUsedInRealWorld = app.isUsedInRealWorld ?? false;

    return {
      ...app,
      cssFramework: app.cssFramework ?? 'other',
      isMobileResponsive: app.isMobileResponsive ?? false,
      isSinglePage: app.isSinglePage ?? false,
      isUsedInRealWorld,
      isDemoSite: app.isDemoSite ?? !isUsedInRealWorld,
      id: this.slugify(app.name),
      owner,
      repo,
      siteUrl,
    };
  }

  private normalizeDomainToUrl(domain: string): string {
    if (domain.startsWith('http://') || domain.startsWith('https://')) {
      return domain;
    }

    return `https://${domain}`;
  }

  private extractGithubParts(githubRepoUrl: string, fallbackRepo: string): { owner: string; repo: string } {
    const parts = githubRepoUrl
      .replace('https://github.com/', '')
      .replace('http://github.com/', '')
      .split('/')
      .filter((part) => part.length > 0);

    const owner = parts.at(0) ?? 'unknown-owner';
    const repo = (parts.at(1) ?? fallbackRepo).replace('.git', '');
    return { owner, repo };
  }

  private slugify(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
