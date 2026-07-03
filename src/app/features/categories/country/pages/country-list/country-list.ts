import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { Pagination } from '../../../../../shared/components/pagination/pagination';
import { Table } from '../../../../../shared/components/table/table';
import { Filter } from '../../../../../shared/components/filter/filter';
import { ActionBar } from '../../../../../shared/components/action-bar/action-bar';
import { HeaderSection } from '../../../../../shared/components/header-section/header-section';
import { Import } from '../../../../../shared/components/import/import';
import { Export } from '../../../../../shared/components/export/export';
import { CountryForm } from '../country-form/country-form';
import {
  CountryFields,
  CountryModel,
} from '../../../../../domain/categories/country/models/country.model';
import { PagingRequest } from '../../../../../core/models/paging.model';
import { FilterOperator, FilterType } from '../../../../../core/enums/filter.enum';
import { CountryFacade } from '../../country.facade';
import { FormsModule } from '@angular/forms';
import { BASE_CONSTANTS } from '../../../../../core/constants/base.constant';

@Component({
  selector: 'app-country-list',
  imports: [
    Table,
    Filter,
    ActionBar,
    HeaderSection,
    Import,
    Export,
    CountryForm,
    FormsModule,
    KeyValuePipe,
    DatePipe,
  ],
  host: { class: 'page-container' },
  templateUrl: './country-list.html',
  styleUrl: './country-list.scss',
})
export class CountryList {
  private facade = inject(CountryFacade);
  private cdr = inject(ChangeDetectorRef);

  //#region //@ STATE

  pageIndex = signal<number>(1);
  pageSize = signal<number>(10);
  fromRecord = signal<number>(1);
  toRecord = signal<number>(10);
  recordRange = signal<string>('');
  totalRecord = signal<number>(0);
  pageCount = signal<number>(0);

  countries = signal<CountryModel[]>([]);
  searchCountryName = signal<string>('');
  searchCountryCode = signal<string>('');
  searchIsDeleted = signal<boolean>(false);

  selectedIds = signal<Set<string>>(new Set());

  readonly countryFields = CountryFields;
  returnZero() {
    return 0;
  }

  //#endregion

  //#region //@ HELPERS

  buildFilter(): PagingRequest {
    const filter: PagingRequest = {
      allowPaging: true,
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
    };

    const searchVal = this.searchCountryName().trim();
    const searchCodeVal = this.searchCountryCode().trim();
    const searchIsDeleted = this.searchIsDeleted();

    filter.filters = [];

    filter.filters.push({
      filterName: BASE_CONSTANTS.isDelete,
      filterValue: searchIsDeleted.toString(),
      filterType: FilterType.Boolean,
    });

    if (searchVal)
      filter.filters.push({
        filterName: CountryFields.countryName,
        filterValue: searchVal,
        filterType: FilterType.String,
        filterOperator: FilterOperator.Like,
      });

    if (searchCodeVal)
      filter.filters.push({
        filterName: CountryFields.countryCode,
        filterValue: searchCodeVal,
        filterType: FilterType.String,
        filterOperator: FilterOperator.Like,
      });

    return filter;
  }

  //#endregion

  //#region //@ METHODS

  displayCount = computed(() => {
    const size = this.selectedIds().size;
    return size > 0 ? `(${size})` : '';
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const filter = this.buildFilter();

    this.facade.getPaging(filter).then((res) => {
      this.countries.set(res.result?.items || []);
      this.totalRecord.set(res.result?.totalRecord || 0);
      this.recordRange.set(res.result?.recordRange || '');
      this.fromRecord.set(res.result?.fromRecord || 0);
      this.toRecord.set(res.result?.toRecord || 0);
      this.pageCount.set(res.result?.pageCount || 0);
      this.cdr.detectChanges();
      this.selectedIds.set(new Set());
    });
  }

  handlePageIndexChange(index: number) {
    this.pageIndex.set(index);
    this.loadData();
  }

  handlePageSizeChange(size: number) {
    this.pageSize.set(size);
    this.pageIndex.set(1);
    this.loadData();
  }

  handleSearch() {
    this.pageIndex.set(1);
    this.loadData();
  }

  handleClearFilter() {
    this.searchCountryName.set('');
    this.searchCountryCode.set('');
    this.searchIsDeleted.set(false);
    this.pageIndex.set(1);
    this.loadData();
  }

  handleToggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const currentIds = new Set(this.selectedIds());

    if (checked) this.countries().forEach((item) => currentIds.add(item.id));
    else this.countries().forEach((item) => currentIds.delete(item.id));

    this.selectedIds.set(currentIds);
  }

  handleToggleSelect(id: string, event: Event) {
    event.stopPropagation();

    const checked = (event.target as HTMLInputElement).checked;
    const currentIds = new Set(this.selectedIds());

    checked ? currentIds.add(id) : currentIds.delete(id);

    this.selectedIds.set(currentIds);
  }

  handleToggleRowSelection(id: string): void {
    const currentIds = new Set(this.selectedIds());

    currentIds.has(id) ? currentIds.delete(id) : currentIds.add(id);

    this.selectedIds.set(currentIds);
  }

  handleDeleteSelected() {
    const idsArray = Array.from(this.selectedIds());
    if (idsArray.length === 0) return;

    if (this.searchIsDeleted())
      this.facade.hardDelete(idsArray.join(',')).then(() => {
        this.loadData();
      });
    else
      this.facade.softDelete(idsArray.join(',')).then(() => {
        this.loadData();
      });
  }

  isAllSelected(): boolean {
    const list = this.countries();
    return list.length > 0 && list.every((item) => this.selectedIds().has(item.id));
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  getSelectedCountry(): CountryModel {
    const idsArray = Array.from(this.selectedIds());
    if (idsArray.length !== 1) return {} as CountryModel;

    const selectedId = idsArray[0];
    return this.countries().find((item) => item.id === selectedId) || ({} as CountryModel);
  }

  exportFn = (filter: PagingRequest): Promise<Blob> => {
    return this.facade.export(filter);
  };

  importFn = (file: File): Promise<any> => {
    return this.facade.import(file);
  };

  //#endregion
}
