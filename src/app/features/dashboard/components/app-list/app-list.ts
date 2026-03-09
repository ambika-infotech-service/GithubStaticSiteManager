import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCard } from '../../../../shared/components/app-card/app-card';
import { AppDashboardItem } from '../../../../models/dashboard.model';

@Component({
  selector: 'app-app-list',
  imports: [CommonModule, AppCard],
  templateUrl: './app-list.html',
  styleUrl: './app-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppList {
  readonly items = input<AppDashboardItem[]>([]);
}
