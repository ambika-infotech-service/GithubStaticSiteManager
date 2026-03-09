import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-card',
  imports: [CommonModule],
  templateUrl: './skeleton-card.html',
  styleUrl: './skeleton-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonCard {
  // readonly count = input<number>(3);
  // protected readonly items = Array.from({ length: this.count() }, (_, i) => i);

  constructor() {
    // Update items when count changes
    // this.items = Array.from({ length: this.count() }, (_, i) => i);
  }
}
