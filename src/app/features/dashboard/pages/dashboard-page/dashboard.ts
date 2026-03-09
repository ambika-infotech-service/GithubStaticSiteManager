import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AppService } from '../../../../services/app.service';
import { AppCard } from '../../../../shared/components/app-card/app-card';
import { AppDashboardItem } from '../../../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, AppCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly appService = inject(AppService);
  private readonly document = inject(DOCUMENT);

  protected readonly apps = signal<AppDashboardItem[] | null>(null);
  protected readonly copyAllSuccess = signal(false);
  readonly isLoading = computed(() => this.apps() === null);

  constructor() {
    this.appService.watchDashboardApps().subscribe((apps) => {
      this.apps.set(apps);
    });
  }

  protected shareAllApps(): void {
    const apps = this.apps();
    if (!apps || apps.length === 0) {
      return;
    }

    const shareText = this.generateShareTextForAll(apps);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(
        () => {
          this.copyAllSuccess.set(true);
          setTimeout(() => this.copyAllSuccess.set(false), 2000);
        },
        (err) => {
          console.error('Failed to copy text: ', err);
          this.fallbackCopy(shareText);
        },
      );
    } else {
      this.fallbackCopy(shareText);
    }
  }

  private generateShareTextForAll(apps: AppDashboardItem[]): string {
    const appTexts = apps.map((item) => {
      const app = item.app;
      const lines: string[] = [];

      // Title and link
      lines.push(`${app.name}: ${app.domain}`);

      // Real world / Demo
      if (app.isUsedInRealWorld) {
        lines.push('Used by real Businessman');
      }

      if (app.isDemoSite) {
        lines.push('For demo purpose');
      }

      // Mobile responsive
      if (app.isMobileResponsive) {
        lines.push('Mobile responsive');
      }

      // Single/Multi page
      lines.push(app.isSinglePage ? 'Single Page Application' : 'Multi Page Application');

      return lines.join('\n');
    });

    return appTexts.join('\n\n---\n\n');
  }

  private fallbackCopy(text: string): void {
    const textArea = this.document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    this.document.body.appendChild(textArea);
    textArea.select();
    try {
      this.document.execCommand('copy');
      this.copyAllSuccess.set(true);
      setTimeout(() => this.copyAllSuccess.set(false), 2000);
    } catch (err) {
      console.error('Fallback copy failed: ', err);
    }
    this.document.body.removeChild(textArea);
  }
}
