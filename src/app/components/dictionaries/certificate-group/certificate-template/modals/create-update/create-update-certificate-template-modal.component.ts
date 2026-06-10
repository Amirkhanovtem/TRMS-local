import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CertificateDurationTypeEnum } from '@certificate-template-models/certificate-duration-type.enum';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { FileExceptionEnum } from '@common-models/response-exceptions/file-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CertificateHistoryTemplateFilesModalComponent } from '@components/certificate/certificate-history-template-files-modal/certificate-history-template-files-modal.component';
import { CertificateTemplateModel } from '@components/dictionaries/certificate-group/certificate-template/models/certificate-template.model';
import { CertificateTemplateService } from '@components/dictionaries/certificate-group/certificate-template/services/certificate-template.service';
import { CertificateTemplateGroupChildTableComponent } from '@components/dictionaries/certificate-group/certificate-template-group/modals/child-table/certificate-template-group-child-table/certificate-template-group-child-table.component';
import { CertificateTemplateGroupService } from '@components/dictionaries/certificate-group/certificate-template-group/services/certificate-template-group.service';
import { Config } from '@config/config';

@Component({
  selector: 'app-create-update-certificate-modal',
  templateUrl: './create-update-certificate-template-modal.component.html',
  styleUrls: ['./create-update-certificate-template-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateCertificateTemplateModalComponent
  extends CommonCreateUpdateComponents<CertificateTemplateModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChild(CertificateTemplateGroupChildTableComponent)
  certificateTemplateGroupChildTable: CertificateTemplateGroupChildTableComponent;

  public certificateTemplate: CertificateTemplateModel = new CertificateTemplateModel();
  public loadedExpireThrough: number;
  public allCertificateTemplateTypes: Array<StandardEnumModel>;
  public allCertificateDurationTypes: Array<StandardEnumModel>;

  constructor(
    private certificateTemplateService: CertificateTemplateService,
    injector: Injector,
    private certificateTemplateGroupService: CertificateTemplateGroupService,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCertificateTemplateDetail();
    this.loadAllCertificateTemplateTypes();
    this.loadAllCertificateDurationTypes();
  }

  loadAllCertificateTemplateTypes(): void {
    this.certificateTemplateService.getAllCertificateTemplateTypes().subscribe({
      next: data => {
        this.allCertificateTemplateTypes = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAllCertificateDurationTypes(): void {
    this.certificateTemplateService.getAllCertificateDurationTypes().subscribe({
      next: data => {
        this.allCertificateDurationTypes = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadCertificateTemplateDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.certificateTemplateService.getCertificateTemplate(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.loadCertificateTemplateDetailSuccessHandler(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  loadCertificateTemplateDetailSuccessHandler(data: CertificateTemplateModel): void {
    this.certificateTemplate = data;
    this.loadedExpireThrough = this.certificateTemplate.certificateDurationSettings.expireThrough;
    this.loadCertificateTemplateGroups();
    this.updateValidatorsByDurationType();
  }

  loadCertificateTemplateGroups(): void {
    this.certificateTemplateGroupService.getGroupsByCertificateTemplateId(this.certificateTemplate.id).subscribe({
      next: data => {
        this.certificateTemplateGroupChildTable.updateCertificateTemplateGroupDataSource(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  expireThroughChangeHandler(): void {
    if (!this.dialogParams.isUpdate) {
      return;
    }

    const expireThroughChanged: boolean =
      Number(this.certificateTemplate.certificateDurationSettings.expireThrough) !== Number(this.loadedExpireThrough);

    if (expireThroughChanged) {
      const message = this.localization.getLocalTextFromKey('certificateTemplateExpireThroughChangedMessage');
      this.showSnackBarWithMessage(message, SnackBarTypeEnum.WARNING);
    }
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      code: ['', [Validators.required, this.noWhitespaceValidator]],
      prefixCode: ['', [Validators.required, this.noWhitespaceValidator]],
      description: ['', []],
      type: ['', [Validators.required]],
      durationType: ['', [Validators.required]],
      expireThrough: ['', [Validators.required, Validators.min(1), this.afterChangeValidBaseMonthPeriod()]],
      baseMonthPeriod: ['', [Validators.required, Validators.min(1), this.maxBaseMonthPeriodValidator()]],
      certainPeriodDelta: ['', [Validators.required, Validators.min(-28), Validators.max(28)]],
    });
  }

  afterChangeValidBaseMonthPeriod(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      control.parent?.controls['baseMonthPeriod']?.updateValueAndValidity();

      return null;
    };
  }

  maxBaseMonthPeriodValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const formGroup: FormGroup | FormArray = control.parent;

      if (!formGroup) {
        return null;
      }

      const baseMonthPeriodControl: AbstractControl = formGroup.controls['baseMonthPeriod'],
        expireThroughControl = formGroup.controls['expireThrough'];

      const isInvalid: boolean = Number(baseMonthPeriodControl.value) >= Number(expireThroughControl.value);

      return isInvalid ? { baseMonthMoreThenDuration: true } : null;
    };
  }

  changeDurationType(certificateDurationType: StandardEnumModel): void {
    const valueChanged: boolean =
      this.certificateTemplate.certificateDurationSettings?.durationType?.id !== certificateDurationType.id;

    if (this.dialogParams?.isView || !valueChanged) {
      return;
    }

    this.certificateTemplate.certificateDurationSettings.durationType = certificateDurationType;

    this.updateValidatorsByDurationType();
  }

  updateValidatorsByDurationType(): void {
    const selectedDurationTypeId: string = this.certificateTemplate.certificateDurationSettings.durationType.id;

    switch (selectedDurationTypeId) {
      case CertificateDurationTypeEnum.INFINITE: {
        this.changeValidators(['expireThrough', 'baseMonthPeriod', 'certainPeriodDelta'], true);
        break;
      }
      case CertificateDurationTypeEnum.CERTAIN_PERIOD: {
        this.changeValidators(['baseMonthPeriod'], true);
        this.changeValidators(['expireThrough', 'certainPeriodDelta'], false);
        break;
      }
      case CertificateDurationTypeEnum.BASE_MONTH: {
        this.changeValidators(['certainPeriodDelta'], true);
        this.changeValidators(['expireThrough', 'baseMonthPeriod'], false);
        break;
      }
    }
  }

  changeValidators(formControlNames: Array<string>, off: boolean): void {
    formControlNames.forEach(formControlName => {
      const validator: AbstractControl = this.getValidator(formControlName);

      if (off) {
        validator.disable();
        validator.setValue(null);
      } else {
        validator.enable();
        validator.value ?? validator.setValue(0);
      }
    });

    this.cdref.detectChanges();
  }

  openFileHistoricalModal(): void {
    this.newModal.open(CertificateHistoryTemplateFilesModalComponent, {
      data: {
        certificate: this.certificateTemplate,
        isTemplate: true,
      },
    });
  }

  createOrSaveCertificateTemplate(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create(): void {
    this.certificateTemplateService
      .create(this.certificateTemplate)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  update(): void {
    this.certificateTemplateService
      .update(this.certificateTemplate)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  errorHandler(error): void {
    const errorBody = error.error,
      contents = errorBody.contents;

    if (!contents || contents.length <= 0) {
      this.errorResponseHandler(error);
      return;
    }

    contents.forEach(content => {
      switch (content.type) {
        case EntityExceptionEnum.UNIQUENESS_CHECK_EXCEPTION_CONTENT: {
          this.uniquenessErrorHandler(content);
          break;
        }
        case FileExceptionEnum.FILE_SIZE_CHECK_EXCEPTION_CONTENT: {
          this.fileSizeCheckExceptionHandler(content);
          break;
        }
        default:
          this.errorResponseHandler(error);
      }
    });
  }

  fileSizeCheckExceptionHandler(content): void {
    const maxAvailableSize: string = content.errorCauses[0].maxAvailableSize,
      message: string = this.localization
        .getLocalTextFromKey('loadAttachmentsMaxFileSizeErrorMessage')
        .replace('${fileMaxSize}', maxAvailableSize);

    this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);
  }

  uniquenessErrorHandler(content): void {
    content.errorCauses.forEach(errorCause => {
      switch (errorCause.field) {
        case 'code': {
          this.setErrorOnValidator('code', content.type);
          break;
        }
      }
    });
  }

  getAllowedFileFormats(): string {
    return Config.ALLOWED_WORD_FILE_FORMATS;
  }

  showExpireThroughField(): boolean {
    return [
      CertificateDurationTypeEnum.BASE_MONTH.toString(),
      CertificateDurationTypeEnum.CERTAIN_PERIOD.toString(),
    ].includes(this.certificateTemplate?.certificateDurationSettings?.durationType?.id);
  }

  showBaseMonthPeriodField(): boolean {
    return [CertificateDurationTypeEnum.BASE_MONTH.toString()].includes(
      this.certificateTemplate?.certificateDurationSettings?.durationType?.id,
    );
  }

  showDayCountField(): boolean {
    return [CertificateDurationTypeEnum.CERTAIN_PERIOD.toString()].includes(
      this.certificateTemplate?.certificateDurationSettings?.durationType?.id,
    );
  }
}
