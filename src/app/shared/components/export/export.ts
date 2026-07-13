import { Component, computed, input, signal } from '@angular/core';
import { Modal } from '../modal/modal';
import { PagingRequest } from '../../../core/models/paging.model';
import { BASE_CONSTANTS } from '../../../core/constants/base.constant';
import { FilterOperator, FilterType } from '../../../core/enums/filter.enum';

export type ExportOption =
  | typeof BASE_CONSTANTS.exportOptionAll
  | typeof BASE_CONSTANTS.exportOptionCurrent
  | typeof BASE_CONSTANTS.exportOptionSelect;

@Component({
  selector: 'app-export',
  imports: [Modal],
  templateUrl: './export.html',
  styleUrl: './export.scss',
})
export class Export {
  //#region //@ INPUTS

  exportFn = input.required<(filter: PagingRequest) => Promise<Blob>>();
  fileName = input<string>('export');
  pageIndex = input<number>(1);
  pageSize = input<number>(10);
  currentFilters = input<PagingRequest>({});
  selectedIds = input<Set<string>>(new Set());

  //#endregion

  //#region //@ STATE

  exportOption = signal<ExportOption>(BASE_CONSTANTS.exportOptionAll);
  isExporting = signal<boolean>(false);
  progress = signal(0);
  progressStatus = signal('Preparing export...');
  showProgress = signal(false);

  //#endregion

  //#region //@ HELPERS

  //* computed() dùng để tính toán giá trị dựa trên state khác
  canExportSelectItems = computed(() => this.selectedIds().size > 0);

  private buildExportFilter(option: ExportOption): PagingRequest {
    const baseFilter = { ...this.currentFilters() };

    switch (option) {
      case BASE_CONSTANTS.exportOptionAll:
        return {
          ...baseFilter,
          allowPaging: false,
        };
      case BASE_CONSTANTS.exportOptionCurrent:
        return {
          ...baseFilter,
          pageIndex: this.pageIndex(),
          pageSize: this.pageSize(),
        };
      case BASE_CONSTANTS.exportOptionSelect:
        return {
          ...baseFilter,
          allowPaging: false,
          filters: [
            ...(baseFilter.filters || []),
            {
              filterName: BASE_CONSTANTS.ids,
              filterValue: Array.from(this.selectedIds()).join(','),
              filterType: FilterType.Guid,
              filterOperator: FilterOperator.Contains,
            },
          ],
        };
    }
  }

  private downloadBlob(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;

    const timestamp = new Date().toISOString().slice(0, 10);
    const extension = this.getFileExtension(blob.type);
    anchor.download = `${this.fileName()}_${timestamp}${extension}`;

    document.body.appendChild(anchor);
    anchor.click();

    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }

  private getFileExtension(mimeType: string): string {
    //* mimeMap bảng tra cứu giúp quy đổi định dạng MIME type sang đuôi file (extension) tương ứng.
    const mimeMap: Record<string, string> = {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'application/vnd.ms-excel': '.xls',
      'text/csv': '.csv',
      'application/pdf': '.pdf',
      'application/json': '.json',
    };

    return mimeMap[mimeType] || '.xlsx';
  }

  private animateProgress(target: number, status: string) {
    this.progress.set(target);
    this.progressStatus.set(status);
  }

  private closeModal() {
    const modalEl = document.getElementById('exportModal');
    if (modalEl) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalEl);
      bootstrapModal?.hide();
    }
  }

  private resetState() {
    this.isExporting.set(false);
    this.showProgress.set(false);
    this.progress.set(0);
    this.progressStatus.set('Preparing export...');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //#endregion

  //#region //@ METHODS

  handleOptionChange(option: ExportOption) {
    this.exportOption.set(option);
  }

  async handleConfirmExport() {
    if (this.isExporting()) return;

    const option = this.exportOption();

    if (option === BASE_CONSTANTS.exportOptionSelect && this.selectedIds().size === 0) return;

    this.isExporting.set(true);
    this.showProgress.set(true);
    this.progress.set(0);
    this.progressStatus.set('Preparing export...');

    try {
      const filter = this.buildExportFilter(option);

      this.animateProgress(10, 'Building request...');
      await this.delay(300);

      this.animateProgress(30, 'Requesting data...');

      const blob = await this.exportFn()(filter);

      this.animateProgress(80, 'Processing file...');
      await this.delay(400);

      this.downloadBlob(blob);

      this.animateProgress(100, 'Export completed!');
      await this.delay(800);

      this.closeModal();
    } catch (error) {
      this.progressStatus.set('Export failed. Please try again.');
      await this.delay(2000);
    } finally {
      this.resetState();
    }
  }

  //#endregion
}
