import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { AppService } from '../../../../services/app.service';

@Component({
  selector: 'app-app-detail-page',
  imports: [RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './app-detail.html',
  styleUrl: './app-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly appService = inject(AppService);

  readonly detail = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('appId') ?? ''),
      switchMap((appId) => {
        if (!appId) {
          return of(null);
        }

        return this.appService.getAppDetail(appId);
      }),
    ),
    { initialValue: null },
  );
}
