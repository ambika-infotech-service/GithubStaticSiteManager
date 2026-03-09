import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of, switchMap, timer } from 'rxjs';
import { HealthStatus } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class HealthCheckService {
  checkSite(url: string): Observable<HealthStatus> {
    return from(this.performReachabilityCheck(this.normalizeUrl(url))).pipe(
      map((isReachable): HealthStatus => (isReachable ? 'online' : 'offline')),
      catchError(() => of<HealthStatus>('offline')),
    );
  }

  monitorSite(url: string, intervalMs = 60_000): Observable<HealthStatus> {
    return timer(0, intervalMs).pipe(switchMap(() => this.checkSite(url)));
  }

  private normalizeUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `https://${url}`;
  }

  private async performReachabilityCheck(url: string): Promise<boolean> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8_000);

    try {
      await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });

      return true;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
