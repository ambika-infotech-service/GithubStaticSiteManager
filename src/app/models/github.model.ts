export interface GithubRepository {
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  open_issues_count: number;
  pushed_at: string;
  default_branch: string;
}

export interface GithubCommitApiResponse {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    committer: {
      name: string;
      date: string;
    };
  };
}

export interface GithubCommitSummary {
  sha: string;
  shortSha: string;
  message: string;
  date: string;
  htmlUrl: string;
  committerName: string;
}
