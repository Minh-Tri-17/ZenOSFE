import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { AppResult } from '../../../core/models/app.model';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-import',
  imports: [Modal],
  templateUrl: './import.html',
  styleUrl: './import.scss',
})
export class Import {
  //#region //@ INPUTS

  importFn = input.required<(file: File) => Promise<AppResult<boolean>>>();
  acceptTypes = input<string>('.xlsx,.xls,.csv');
  maxSizeMB = input<number>(10);

  //#endregion

  //#region //@ OUTPUTS

  importSuccess = output<void>();

  //#endregion

  //#region //@ STATE

  selectedFile = signal<File | null>(null);
  isImporting = signal<boolean>(false);
  isDragOver = signal<boolean>(false);
  errorMessage = signal<string>('');
  showProgress = signal<boolean>(false);
  progress = signal<number>(0);
  progressStatus = signal<string>('Preparing import...');

  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  //#endregion

  //#region //@ HELPERS

  private handleFile(file: File) {
    this.errorMessage.set('');

    const acceptTypes = this.acceptTypes();
    if (acceptTypes) {
      const allowedExtensions = acceptTypes.split(',').map((ext) => ext.trim().toLowerCase());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        this.errorMessage.set(`Invalid file type. Accepted: ${acceptTypes}`);
        return;
      }
    }

    const maxBytes = this.maxSizeMB() * 1024 * 1024;
    if (file.size > maxBytes) {
      this.errorMessage.set(`File size exceeds limit of ${this.maxSizeMB()}MB`);
      return;
    }

    this.selectedFile.set(file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  }

  private animateProgress(target: number, status: string) {
    this.progress.set(target);
    this.progressStatus.set(status);
  }

  private closeModal() {
    const modalEl = document.getElementById('importModal');
    if (modalEl) {
      const modal = (window as any).bootstrap?.Modal?.getInstance(modalEl);
      modal?.hide();
    }

    this.resetState();
  }

  private resetState() {
    this.selectedFile.set(null);
    this.isImporting.set(false);
    this.errorMessage.set('');
    this.progress.set(0);
    this.progressStatus.set('Preparing import...');

    this.resetFileInput();
  }

  private resetFileInput() {
    const input = this.fileInput()?.nativeElement;
    if (input) input.value = '';
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //#endregion

  //#region //@ METHODS

  handleTriggerFileInput() {
    if (this.isImporting()) return;
    this.fileInput()?.nativeElement.click();
  }

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isImporting()) {
      this.isDragOver.set(true);
    }
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    if (this.isImporting()) return;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  handleRemoveFile(event: Event) {
    event.stopPropagation();

    this.selectedFile.set(null);
    this.errorMessage.set('');
    this.resetFileInput();
  }

  async handleConfirmImport() {
    const file = this.selectedFile();
    if (!file || this.isImporting()) return;

    this.isImporting.set(true);
    this.showProgress.set(true);
    this.progress.set(0);
    this.progressStatus.set('Preparing import...');
    this.errorMessage.set('');

    try {
      this.animateProgress(10, 'Reading file...');
      await this.delay(300);

      this.animateProgress(30, 'Uploading data...');

      const result = await this.importFn()(file);

      this.animateProgress(80, 'Processing...');
      await this.delay(400);

      if (result.isSuccess) {
        this.animateProgress(100, 'Import completed!');
        await this.delay(800);

        this.importSuccess.emit();
        this.closeModal();
      } else {
        this.animateProgress(0, 'Import failed!');
        this.errorMessage.set(
          result.message || 'Import failed. Please check your file and try again.',
        );
        await this.delay(500);
      }
    } catch (error) {
      this.progressStatus.set('Import failed');
      this.errorMessage.set('An unexpected error occurred. Please try again.');
      await this.delay(500);
    } finally {
      this.isImporting.set(false);
    }
  }

  //#endregion
}
