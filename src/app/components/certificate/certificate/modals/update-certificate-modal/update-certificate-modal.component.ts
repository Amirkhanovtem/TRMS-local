import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatCalendar, MatDatepicker } from '@angular/material/datepicker';
import { CertificateDurationTypeEnum } from '@certificate-template-models/certificate-duration-type.enum';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { CertificateModel } from '@components/certificate/certificate/models/certificate.model';
import { CertificateService } from '@components/certificate/certificate/services/certificate.service';
import { Moment } from 'moment';

import { delay } from '../../../../../utils/functions/delay-function';

@Component({
  selector: 'app-update-certificate-modal',
  templateUrl: './update-certificate-modal.component.html',
  styleUrls: ['./update-certificate-modal.component.scss'],
  standalone: false,
})
export class UpdateCertificateModalComponent extends CommonCreateUpdateComponents<CertificateModel> implements OnInit {
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChild('datepickerDateOfExpire') expireDatePicker: MatDatepicker<any>;

  certificate: CertificateModel = new CertificateModel();
  getDurationTypeId = (): string => this.certificate?.certificateDurationSettings?.durationType?.id;

  constructor(
    private certificateService: CertificateService,
    injector: Injector,
  ) {
    super(injector);
    this.createDefaultFormBeforeLoad();
  }

  ngOnInit(): void {
    this.loadCertificateDetail();
  }

  loadCertificateDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.certificateService.getCertificateForUpdate(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.certificateSuccessLoadHandler(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  certificateSuccessLoadHandler(data: CertificateModel): void {
    this.certificate = data;
    this.createForm();
    this.changePeriodPickerHandler();
  }

  isBaseMonthDurationType(): boolean {
    return this.getDurationTypeId() === CertificateDurationTypeEnum.BASE_MONTH;
  }

  isInfiniteDurationType(): boolean {
    return this.getDurationTypeId() === CertificateDurationTypeEnum.INFINITE;
  }

  getExpireDatePickerView(): 'month' | 'multi-year' {
    return this.isBaseMonthDurationType() ? 'multi-year' : 'month';
  }

  setMonthAndYear(selectedDate: Moment, datepicker: MatDatepicker<Moment>) {
    if (CertificateDurationTypeEnum.BASE_MONTH !== this.getDurationTypeId()) {
      return;
    }

    selectedDate.date(selectedDate.daysInMonth());
    this.certificate.dateOfExpire = selectedDate.toDate();
    datepicker.close();
  }

  createDefaultFormBeforeLoad(): void {
    this.modalForm = this.formBuilder.group({
      numberOfSerialNumber: ['', [Validators.required, Validators.min(0)]],
      dateIssue: ['', []],
      dateExpire: ['', []],
    });
  }

  createForm(): void {
    switch (this.getDurationTypeId()) {
      case CertificateDurationTypeEnum.BASE_MONTH:
      case CertificateDurationTypeEnum.CERTAIN_PERIOD: {
        this.modalForm = this.formBuilder.group({
          numberOfSerialNumber: ['', [Validators.required, Validators.min(0)]],
          dateIssue: ['', [Validators.required]],
          dateExpire: ['', [Validators.required]],
        });

        this.modalForm.setValidators([this.expireBeforeStartValidator()]);
        break;
      }
      case CertificateDurationTypeEnum.INFINITE: {
        this.modalForm = this.formBuilder.group({
          numberOfSerialNumber: ['', [Validators.required, Validators.min(0)]],
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

  saveCertificate(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.update();
    }
  }

  update(): void {
    this.certificateService
      .update(this.certificate)
      .subscribe({
        next: data => {
          this.successResponseHandler('saveSuccessfulMessage');
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }
}
