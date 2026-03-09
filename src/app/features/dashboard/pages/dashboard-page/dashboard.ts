import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../../../services/app.service';
import { AppCard } from '../../../../shared/components/app-card/app-card';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, AppCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly appService = inject(AppService);

  protected readonly apps = signal<any[] | null>(null);
  readonly isLoading = computed(() => this.apps() === null);

  constructor() {
    this.appService.watchDashboardApps().subscribe((apps) => {
      this.apps.set(apps);
    });
  }
}
