import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppDashboardItem } from '../../../../models/dashboard.model';
import { AppService } from '../../../../services/app.service';
import { AppCard } from '../../../../shared/components/app-card/app-card';
import { SkeletonCard } from '../../../../shared/components/skeleton-card/skeleton-card';

interface FilterState {
  framework: string;
  cssFramework: string;
  healthStatus: string;
  isMobileResponsive: boolean | null;
  isSinglePage: boolean | null;
  isUsedInRealWorld: boolean | null;
  isDemoSite: boolean | null;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, AppCard, SkeletonCard, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly appService = inject(AppService);
  private readonly document = inject(DOCUMENT);

  protected readonly apps = signal<AppDashboardItem[] | null>(null);
  protected readonly copyAllSuccess = signal(false);
  protected readonly showFilters = signal(false);

  protected readonly filters = signal<FilterState>({
    framework: '',
    cssFramework: '',
    healthStatus: '',
    isMobileResponsive: null,
    isSinglePage: null,
    isUsedInRealWorld: null,
    isDemoSite: null,
  });

  readonly isLoading = computed(() => this.apps() === null);

  protected readonly filteredApps = computed(() => {
    const apps = this.apps();
    if (!apps) return null;

    const filterState = this.filters();

    return apps.filter((item) => {
      // Framework filter
      if (filterState.framework && item.app.framework !== filterState.framework) {
        return false;
      }

      // CSS Framework filter
      if (filterState.cssFramework && item.app.cssFramework !== filterState.cssFramework) {
        return false;
      }

      // Health Status filter
      if (filterState.healthStatus && item.healthStatus !== filterState.healthStatus) {
        return false;
      }

      // Mobile Responsive filter
      if (filterState.isMobileResponsive !== null && item.app.isMobileResponsive !== filterState.isMobileResponsive) {
        return false;
      }

      // Single Page filter
      if (filterState.isSinglePage !== null && item.app.isSinglePage !== filterState.isSinglePage) {
        return false;
      }

      // Used in Real World filter
      if (filterState.isUsedInRealWorld !== null && item.app.isUsedInRealWorld !== filterState.isUsedInRealWorld) {
        return false;
      }

      // Demo Site filter
      if (filterState.isDemoSite !== null && item.app.isDemoSite !== filterState.isDemoSite) {
        return false;
      }

      return true;
    });
  });

  protected readonly hasActiveFilters = computed(() => {
    const filterState = this.filters();
    return !!(filterState.framework ||
      filterState.cssFramework ||
      filterState.healthStatus ||
      filterState.isMobileResponsive !== null ||
      filterState.isSinglePage !== null ||
      filterState.isUsedInRealWorld !== null ||
      filterState.isDemoSite !== null);
  });

  constructor() {
    this.appService.watchDashboardApps().subscribe((apps) => {
      this.apps.set(apps);
    });
  }

  protected toggleFilters(): void {
    this.showFilters.update(v => !v);
  }

  protected clearFilters(): void {
    this.filters.set({
      framework: '',
      cssFramework: '',
      healthStatus: '',
      isMobileResponsive: null,
      isSinglePage: null,
      isUsedInRealWorld: null,
      isDemoSite: null,
    });
  }

  protected updateFilter(key: keyof FilterState, value: any): void {
    this.filters.update(current => ({
      ...current,
      [key]: value === '' ? (key.startsWith('is') ? null : '') : value
    }));
  }

  protected shareAllApps(): void {
    const apps = this.filteredApps();
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
