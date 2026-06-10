import { Injector } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';

export class CommonCreateUpdateComponents<M> extends CommonComponent {
  public readonly DEFAULT_MIN_NUM_VALUE: number = 1;
  public readonly DEFAULT_MAX_NUM_VALUE: number = 999;

  public formBuilder: FormBuilder;
  public modalForm: FormGroup;
  public dialogParams: {
    model: M;
    isUpdate?: boolean;
    isView?: boolean;
  };
  public blockBtn: boolean = false;

  constructor(injector: Injector) {
    super(injector);
    this.formBuilder = injector.get(FormBuilder);
    this.dialogParams = injector.get(MAT_DIALOG_DATA);
  }

  getValidator(formControlName: string): AbstractControl {
    return this.modalForm.get(formControlName);
  }

  changeControlError(control: AbstractControl, errorCode: string, isInvalid: boolean): void {
    if (isInvalid) {
      control.setErrors({ [errorCode]: true });
      control.markAsTouched();
    } else if (control.hasError(errorCode)) {
      if (Object.keys(control.errors).length === 1) {
        control.setErrors(null);
      } else {
        delete control.errors[errorCode];
      }
    }
  }

  validateForm(): boolean {
    return this.modalForm.valid;
  }

  isFieldInvalid(formControlName: string): boolean {
    const validator = this.getValidator(formControlName);

    if (!validator) {
      return false;
    }

    return validator.invalid && (validator.touched || validator.dirty);
  }

  public noWhitespaceValidator(control: FormControl) {
    return (control.value || '').trim().length ? null : { 'whitespace': true };
  }

  isFieldEmpty(formControlName: string): boolean {
    return this.controlHasError(formControlName, 'required') || this.controlHasError(formControlName, 'whitespace');
  }

  isFieldInvalidEmail(formControlName: string): boolean {
    return this.controlHasError(formControlName, 'email');
  }

  isFieldLessThenZero(formControlName: string): boolean {
    return this.controlHasError(formControlName, 'min');
  }

  isFieldOutOfTheRange(formControlName: string): boolean {
    return this.controlHasError(formControlName, 'min') || this.controlHasError(formControlName, 'max');
  }

  fieldOutOfTheRangeErrorMessage(min, max): string {
    const templateTextMap = new Map<string, string>([
      ['min', min],
      ['max', max],
    ]);

    return this.localization.getLocalFormattedTextFromKey('validatorsOutOfRangeFieldMessage', templateTextMap);
  }

  isFieldNotUnique(formControlName: string): boolean {
    return this.controlHasError(formControlName, 'UNIQUENESS_CHECK_EXCEPTION_CONTENT');
  }

  setErrorOnValidator(formControlName: string, errorType: string) {
    this.getValidator(formControlName)?.setErrors({ [errorType]: true });
  }

  startCreateHandler(): void {
    this.showLoadPage();
    this.blockBtn = true;
  }

  standardCompleteHandler(): void {
    this.hideLoadPage();
    this.blockBtn = false;
  }

  disableValidator(controlName: string): void {
    this.modalForm.removeControl(controlName);
    this.modalForm.updateValueAndValidity();
  }

  enableValidator(controlName: string, control: AbstractControl): void {
    this.modalForm.addControl(controlName, control);
    this.modalForm.updateValueAndValidity();
  }

  controlHasError(formControlName: string, error: string): boolean {
    const validatorErrors = this.getValidator(formControlName)?.errors;
    return this.isFieldInvalid(formControlName) && validatorErrors?.[error];
  }
}
