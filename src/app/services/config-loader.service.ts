import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { StaticAppsConfig } from '../models/static-app.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigLoaderService {
  private readonly http = inject(HttpClient);
  private readonly appsConfig$ = this.http
    .get<StaticAppsConfig>('/apps.json')
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  getAppsConfig(): Observable<StaticAppsConfig> {
    return this.appsConfig$;
  }
}
