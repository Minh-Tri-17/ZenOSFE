import { Component, input, model, output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-filter',
  imports: [],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'collapse',
  },
})
export class Filter {
  isDeleted = model<boolean>(false);
  search = output<void>();
  clear = output<void>();

  handleIsDeleted(event: Event) {
    this.isDeleted.set((event.target as HTMLInputElement).checked);
    this.search.emit();
  }

  handleSearch() {
    this.search.emit();
  }

  handleClearFilter() {
    this.clear.emit();
  }
}
