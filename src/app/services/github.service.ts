import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import {
  GithubCommitApiResponse,
  GithubCommitSummary,
  GithubRepository,
} from '../models/github.model';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly http = inject(HttpClient);
  private readonly githubApiBase = 'https://api.github.com';

  getRepository(owner: string, repo: string): Observable<GithubRepository> {
    return this.http.get<GithubRepository>(
      `${this.githubApiBase}/repos/${owner}/${repo}`,
    );
  }

  getRepositorySafe(
    owner: string,
    repo: string,
  ): Observable<GithubRepository | null> {
    return this.getRepository(owner, repo).pipe(catchError(() => of(null)));
  }

  getLatestCommits(
    owner: string,
    repo: string,
    limit = 5,
  ): Observable<GithubCommitSummary[]> {
    return this.http
      .get<GithubCommitApiResponse[]>(
        `${this.githubApiBase}/repos/${owner}/${repo}/commits?per_page=${limit}`,
      )
      .pipe(map((commits) => commits.map((commit) => this.mapCommit(commit))));
  }

  getLatestCommitsSafe(
    owner: string,
    repo: string,
    limit = 5,
  ): Observable<GithubCommitSummary[]> {
    return this.getLatestCommits(owner, repo, limit).pipe(catchError(() => of([])));
  }

  getLatestCommitSafe(
    owner: string,
    repo: string,
  ): Observable<GithubCommitSummary | null> {
    return this.getLatestCommitsSafe(owner, repo, 1).pipe(
      map((commits) => commits.at(0) ?? null),
    );
  }

  private mapCommit(commit: GithubCommitApiResponse): GithubCommitSummary {
    return {
      sha: commit.sha,
      shortSha: commit.sha.slice(0, 7),
      message: commit.commit.message,
      date: commit.commit.committer.date,
      htmlUrl: commit.html_url,
      committerName: commit.commit.committer.name,
    };
  }
}
