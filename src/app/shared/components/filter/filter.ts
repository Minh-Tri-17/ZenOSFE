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
  //#region //@ INPUTS

  isDeleted = model<boolean>(false);

  //#endregion

  //#region //@ OUTPUTS

  search = output<void>();
  clear = output<void>();

  //#endregion

  //#region //@ METHODS

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

  //#endregion
}
