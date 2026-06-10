import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { getNewUuid } from '@components/common/functions/uuid.functions';
import { BusinessLogicModel } from '@gantt-models/business-logic.model';
import { HolidayService } from '@holiday-services/holiday.service';
import { ModuleTemplateModel } from '@module-template-models/module-template.model';
import { ModuleTemplateService } from '@module-template-services/module-template.service';
import { TrainingTemplateService } from '@training-template-services/training-template.service';

@Component({
  selector: 'app-create-update-module-template',
  templateUrl: './create-update-module-template.component.html',
  styleUrls: ['./create-update-module-template.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateModuleTemplateComponent
  extends CommonCreateUpdateComponents<ModuleTemplateModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public moduleTemplate: ModuleTemplateModel = new ModuleTemplateModel();
  public allTrainingTemplateFormats: Array<StandardEnumModel>;
  public workTime: BusinessLogicModel = new BusinessLogicModel();
  public override dialogParams: {
    model: ModuleTemplateModel;
    isUpdate?: boolean;
    isView?: boolean;
    isModuleUpdated?: boolean;
    format?: StandardEnumModel;
  };

  constructor(
    private trainingTemplateService: TrainingTemplateService,
    private moduleTemplateService: ModuleTemplateService,
    private holidayService: HolidayService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadModuleTemplateDetail();
    this.loadAllTrainingTemplateFormatTypes();
    this.loadWorkTime();
  }

  loadWorkTime(): void {
    this.holidayService.getBusinessLogic().subscribe({
      next: data => {
        this.workTime = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAllTrainingTemplateFormatTypes(): void {
    this.trainingTemplateService.getAllTrainingTemplateFormatTypes().subscribe({
      next: data => {
        this.allTrainingTemplateFormats = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadModuleTemplateDetail(): void {
    if (this.dialogParams?.isUpdate || this.dialogParams?.isView) {
      if (this.dialogParams?.isModuleUpdated || this.dialogParams?.model?.isCreated) {
        Object.assign(this.moduleTemplate, this.dialogParams.model);
      } else if (this.dialogParams?.model?.id) {
        this.moduleTemplateService
          .getModuleTemplate(this.dialogParams?.model?.id)
          .subscribe({
            next: data => {
              this.moduleTemplate = data;
            },
            error: e => {
              this.errorResponseHandler(e);
            },
          })
          .add(() => this.cdref.detectChanges());
      }
    } else {
      this.moduleTemplate.format = this.dialogParams?.format;
    }
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      description: ['', []],
      format: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(0.5)]],
      minimalTrainersCount: ['', [Validators.required, Validators.min(0)]],
      breakTime: ['', [Validators.required, Validators.min(0)]],
      minBreakTime: ['', [Validators.required, Validators.min(0)]],
      maxBreakTime: ['', [Validators.required, Validators.min(0)]],
    });

    this.modalForm.setValidators([
      this.compareMinMaxBreakTimeValidator(),
      this.breakTimeInMinMaxRangeValidator(),
      this.durationValidator(),
    ]);
  }

  durationValidator(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors => {
      const durationControl = formGroup.controls['duration'],
        errorCode = 'durationLongerThenWorkDay';

      if (durationControl.hasError('required')) {
        return null;
      }

      const maxDuration: number = Number(this.workTime.businessEndsHour) - Number(this.workTime.businessBeginsHour),
        durationLongerThenWorkDay: boolean = Number(durationControl.value) > Number(maxDuration);

      this.changeControlError(durationControl, errorCode, durationLongerThenWorkDay);

      return null;
    };
  }

  compareMinMaxBreakTimeValidator(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors => {
      const minBreakTimeControl = formGroup.controls['minBreakTime'],
        maxBreakTimeControl = formGroup.controls['maxBreakTime'],
        errorCode = 'invalidMinMaxBreakTime';

      if (minBreakTimeControl.hasError('required') || maxBreakTimeControl.hasError('required')) {
        return null;
      }

      const invalidMinMaxBreakTime: boolean = Number(minBreakTimeControl.value) > Number(maxBreakTimeControl.value);

      this.changeControlError(minBreakTimeControl, errorCode, invalidMinMaxBreakTime);
      this.changeControlError(maxBreakTimeControl, errorCode, invalidMinMaxBreakTime);

      return null;
    };
  }

  breakTimeInMinMaxRangeValidator(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors => {
      const minBreakTimeControl = formGroup.controls['minBreakTime'],
        maxBreakTimeControl = formGroup.controls['maxBreakTime'],
        breakTimeControl = formGroup.controls['breakTime'],
        errorCode = 'invalidBreakTimeInMinMaxRange';

      if (
        breakTimeControl.hasError('required') ||
        minBreakTimeControl.hasError('required') ||
        maxBreakTimeControl.hasError('required')
      ) {
        return null;
      }

      const invalidBreakTime: boolean =
        Number(breakTimeControl.value) < Number(minBreakTimeControl.value) ||
        Number(breakTimeControl.value) > Number(maxBreakTimeControl.value);

      this.changeControlError(breakTimeControl, errorCode, invalidBreakTime);

      return null;
    };
  }

  isDurationLongerThenWorkDay(): boolean {
    return this.getValidator('duration').hasError('durationLongerThenWorkDay');
  }

  isInvalidBreakTimeMinMaxValidator(): boolean {
    return (
      this.getValidator('minBreakTime').hasError('invalidMinMaxBreakTime') ||
      this.getValidator('maxBreakTime').hasError('invalidMinMaxBreakTime')
    );
  }

  isInvalidBreakTimeInMinMaxRangeValidator(): boolean {
    return this.getValidator('breakTime').hasError('invalidBreakTimeInMinMaxRange');
  }

  createOrSaveModuleTemplate(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create(): void {
    this.moduleTemplate.id = getNewUuid();
    this.moduleTemplate.isCreated = true;

    this.modalComponent.closeCurrentModal({
      save: true,
      moduleTemplate: this.moduleTemplate,
    });
  }

  update(): void {
    if (!this.moduleTemplate.isCreated) {
      this.moduleTemplate.isUpdated = true;
    }

    Object.assign(this.dialogParams.model, this.moduleTemplate);

    this.modalComponent.closeCurrentModal(false);
  }
}
