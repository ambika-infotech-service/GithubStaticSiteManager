import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppDashboardItem } from '../../../models/dashboard.model';

@Component({
  selector: 'app-app-card',
  imports: [RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './app-card.html',
  styleUrl: './app-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCard {
  readonly item = input.required<AppDashboardItem>();

  protected readonly statusClass = computed(() => {
    const status = this.item().healthStatus;
    if (status === 'online') {
      return 'text-bg-success';
    }

    if (status === 'offline') {
      return 'text-bg-danger';
    }

    return 'text-bg-secondary';
  });
}
