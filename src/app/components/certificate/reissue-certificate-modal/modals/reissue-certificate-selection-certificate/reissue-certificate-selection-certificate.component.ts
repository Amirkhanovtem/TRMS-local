import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatCalendar, MatDatepicker } from '@angular/material/datepicker';
import { CertificateDurationTypeEnum } from '@certificate-template-models/certificate-duration-type.enum';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { NewCertificateModel } from '@components/certificate/reissue-certificate-modal/models/new-certificate.model';
import { ReissueCertificateModel } from '@components/certificate/reissue-certificate-modal/models/reissue-certificate.model';
import { Moment } from 'moment';

import { delay } from '../../../../../utils/functions/delay-function';

@Component({
  selector: 'app-reissue-certificate-selection-certificate',
  templateUrl: './reissue-certificate-selection-certificate.component.html',
  styleUrls: ['./reissue-certificate-selection-certificate.component.scss'],
  standalone: false,
})
export class ReissueCertificateSelectionCertificateComponent
  extends CommonCreateUpdateComponents<ReissueCertificateModel>
  implements OnInit
{
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('datepickerDateOfExpire') expireDatePicker: MatDatepicker<any>;
  @Input() reissueCertificate: ReissueCertificateModel;

  getDurationTypeId = (): string =>
    this.reissueCertificate.newCertificateBySystem.certificateTemplate.certificateDurationSettings.durationType.id;

  displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'certificateTemplateName',
      colTitleLocKey: 'attendedTrainingCertificateColTable',
      modelPropertyPath: ['certificateTemplate', 'name'],
    },
    {
      colDef: 'trainingTemplateName',
      colTitleLocKey: 'personTrainingTableTrainingTemplateCol',
      modelPropertyPath: ['trainingTemplate', 'name'],
    },
    {
      colDef: 'certificateStatus',
      colTitleLocKey: 'personTrainingTableCertificateStatusCol',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'dateOfIssue',
      colTitleLocKey: 'certificateIssueDateColTable',
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'dateOfExpire',
      colTitleLocKey: 'certificateIssueExpireThroughColTable',
      colType: DisplayedColumnTypeEnum.DATE,
    },
  ];

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.createForm();
  }

  override ngAfterViewInit(): void {
    this.table.commonLoadTableHandler(this.reissueCertificate.certificatesForReissue);
    this.changePeriodPickerHandler();
    super.ngAfterViewInit();
  }

  changePeriodPickerHandler() {
    if (this.getDurationTypeId() !== CertificateDurationTypeEnum.BASE_MONTH) {
      return;
    }

    this.expireDatePicker.openedStream.subscribe(async data => {
      let calendar: MatCalendar<any>;

      while (!calendar) {
        await delay(100).then(() => (calendar = this.expireDatePicker['_componentRef']?.instance?._calendar));
      }

      calendar._calendarHeaderPortal['_attachedHost']._attachedRef.instance.currentPeriodClicked = () => {
        calendar.currentView = calendar.currentView === 'year' ? 'multi-year' : 'year';
      };
    });
  }

  get certificateData(): NewCertificateModel {
    return this.reissueCertificate.isCreateBySystem
      ? this.reissueCertificate.newCertificateBySystem
      : this.reissueCertificate.newCertificateByUser;
  }

  createForm(): void {
    switch (this.getDurationTypeId()) {
      case CertificateDurationTypeEnum.BASE_MONTH:
      case CertificateDurationTypeEnum.CERTAIN_PERIOD: {
        this.modalForm = this.formBuilder.group({
          numberOfSerialNumber: ['', [Validators.min(0)]],
          dateIssue: ['', [Validators.required]],
          dateExpire: ['', [Validators.required]],
        });

        this.modalForm.setValidators([this.expireBeforeStartValidator()]);
        break;
      }
      case CertificateDurationTypeEnum.INFINITE: {
        this.modalForm = this.formBuilder.group({
          numberOfSerialNumber: ['', [Validators.min(0)]],
          dateIssue: ['', [Validators.required]],
        });
        break;
      }
    }
  }

  expireBeforeStartValidator(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors => {
      if (this.getDurationTypeId() === CertificateDurationTypeEnum.INFINITE) {
        return null;
      }

      const dateIssueControl: AbstractControl = formGroup.controls['dateIssue'],
        dateExpireControl: AbstractControl = formGroup.controls['dateExpire'],
        dateIssue = dateIssueControl.value,
        dateExpire = dateExpireControl.value,
        someFieldEmpty: boolean = dateIssueControl.hasError('required') || dateExpireControl.hasError('required');

      const isInvalid: boolean = !someFieldEmpty && new Date(dateIssue).getTime() >= new Date(dateExpire).getTime();

      this.changeControlError(dateIssueControl, 'expireBeforeStart', isInvalid);
      this.changeControlError(dateExpireControl, 'expireBeforeStart', isInvalid);

      return null;
    };
  }

  updateValidators(offValidators: boolean): void {
    this.updateModalFormValidators(offValidators);
    this.updateValidatorByFormControlName('dateIssue', offValidators);
    this.updateValidatorByFormControlName('dateExpire', offValidators);
  }

  updateModalFormValidators(offValidators: boolean): void {
    const validators: Array<ValidatorFn> = offValidators ? [] : [this.expireBeforeStartValidator()];

    this.modalForm.setValidators(validators);
  }

  updateValidatorByFormControlName(formControlName: string, offValidators: boolean): void {
    const control: AbstractControl = this.getValidator(formControlName);

    if (offValidators) {
      control.clearValidators();
    } else {
      control.setValidators(Validators.required);
    }

    control.updateValueAndValidity();
  }

  getReissueCertificate(): ReissueCertificateModel {
    const result: ReissueCertificateModel = Object.assign(new ReissueCertificateModel(), this.reissueCertificate);

    result.certificatesForReissue = result.certificatesForReissue.filter(certificate => {
      return this.table.selection.selected.some(selectedCert => {
        return selectedCert.id === certificate.id;
      });
    });

    return result;
  }

  needShowExpireDatePicker(): boolean {
    return this.getDurationTypeId() !== CertificateDurationTypeEnum.INFINITE;
  }

  getExpireDatePickerView(): 'month' | 'multi-year' {
    return this.getDurationTypeId() === CertificateDurationTypeEnum.BASE_MONTH ? 'multi-year' : 'month';
  }

  setMonthAndYear(selectedDate: Moment, datepicker: MatDatepicker<Moment>) {
    if (CertificateDurationTypeEnum.BASE_MONTH !== this.getDurationTypeId()) {
      return;
    }

    selectedDate.date(selectedDate.daysInMonth());
    this.reissueCertificate.newCertificateByUser.dateOfExpire = selectedDate.toDate();
    datepicker.close();
  }

  checkDateOfExpireInputReadOnly(): boolean {
    return (
      this.reissueCertificate?.isCreateBySystem || this.getDurationTypeId() === CertificateDurationTypeEnum.BASE_MONTH
    );
  }
}
