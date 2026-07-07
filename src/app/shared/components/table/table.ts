import { Component, input, output } from '@angular/core';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-table',
  imports: [Pagination],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
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
}
