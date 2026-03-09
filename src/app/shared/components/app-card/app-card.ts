import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppDashboardItem } from '../../../models/dashboard.model';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-app-card',
  imports: [RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './app-card.html',
  styleUrl: './app-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppCard {
  private readonly document = inject(DOCUMENT);
  readonly item = input.required<AppDashboardItem>();
  protected readonly copySuccess = signal(false);

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

  protected shareApp(): void {
    const app = this.item().app;
    const shareText = this.generateShareText();

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(
        () => {
          this.copySuccess.set(true);
          setTimeout(() => this.copySuccess.set(false), 2000);
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

  private generateShareText(): string {
    const app = this.item().app;
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
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    } catch (err) {
      console.error('Fallback copy failed: ', err);
    }
    this.document.body.removeChild(textArea);
  }
}
