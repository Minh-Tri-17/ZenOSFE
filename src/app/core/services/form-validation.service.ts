import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  //#region //@ HELPERS

  private findControlCaseInsensitive(form: FormGroup, controlName: string): AbstractControl | null {
    let control = form.get(controlName);
    if (control) return control;

    //* Object.keys(obj) trả về 1 mảng các property name (key) của object
    const foundKey = Object.keys(form.controls).find(
      (k) => k.toLowerCase() === controlName.toLowerCase(),
    );

    if (foundKey) return form.get(foundKey);

    return null;
  }

  //#endregion

  //#region //@ METHODS

  mapServerValidationErrors(error: any, form: FormGroup): boolean {
    if (!error) return false;

    const errorResponse = error instanceof HttpErrorResponse ? error.error : error;

    const serverErrors =
      errorResponse?.errors || errorResponse?.validationErrors || error?.error?.errors;

    if (!serverErrors || typeof serverErrors !== 'object') return false;

    //* Object.keys(obj) trả về 1 mảng các property name (key) của object
    Object.keys(serverErrors).forEach((key) => {
      const control = this.findControlCaseInsensitive(form, key);
      if (control) {
        const errorMessages = serverErrors[key];
        const errorMessage = Array.isArray(errorMessages)
          ? errorMessages[0]
          : typeof errorMessages === 'string'
            ? errorMessages
            : '';

        if (errorMessage) control.setErrors({ serverError: errorMessage });
      }
    });

    return true;
  }

  getServerErrors(form: FormGroup, controlName: string): string[] {
    const control = form.get(controlName);
    if (!control) return [];

    const errors: string[] = [];

    if (control.hasError('serverError')) errors.push(control.getError('serverError'));

    return errors;
  }

  clearServerErrors(form: FormGroup): void {
    //* Object.keys(obj) trả về 1 mảng các property name (key) của object
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control && control.errors && control.errors['serverError']) {
        const { serverError, ...otherErrors } = control.errors;

        //* Object.keys(obj) trả về 1 mảng các property name (key) của object
        control.setErrors(Object.keys(otherErrors).length > 0 ? otherErrors : null);
      }
    });
  }

  //#endregion
}
