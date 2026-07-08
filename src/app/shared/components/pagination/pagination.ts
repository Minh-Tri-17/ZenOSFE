import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  //#region //@ INPUTS

  pageIndex = input<number>(1);
  pageSize = input<number>(10);
  totalRecord = input<number>(0);
  recordRange = input<string>();
  pageCount = input<number>(0);

  //#endregion

  //#region //@ OUTPUTS

  pageSizeChange = output<number>();
  pageIndexChange = output<number>();

  //#endregion

  //#region //@ METHODS

  //* computed() dùng để tính toán giá trị dựa trên state khác
  pages = computed(() => {
    const list = [];

    for (let i = 1; i <= this.pageCount(); i++) {
      list.push(i);
    }

    return list;
  });

  handlePageSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pageSizeChange.emit(Number(select.value));
  }

  handlePageIndexChange(index: number) {
    this.pageIndexChange.emit(index);
  }

  //#endregion
}
