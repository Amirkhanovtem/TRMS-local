import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { CheckingTypeEnum } from '@event-models/checking-type.enum';
import { ModulePersonTrainerStepComponent } from '@event-module-modals-create-update-person-trainer-step/module-person-trainer-step.component';
import { ModuleResourceStepComponent } from '@event-module-modals-create-update-resource-step/module-resource-step.component';
import { ReplaceModuleServiceService } from '@event-module-modals-create-update-services/replace-module-service.service';
import { ModuleModel } from '@event-module-models/module.model';
import { ModuleService } from '@event-module-services/module.service';
import { EventService } from '@event-services/event.service';
import { HolidayService } from '@holiday-services/holiday.service';

@Component({
  selector: 'app-create-update-module-modal',
  templateUrl: './create-update-module-modal.component.html',
  styleUrls: ['./create-update-module-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateModuleModalComponent
  extends CommonCreateUpdateComponents<ModuleModel>
  implements OnInit, AfterViewInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChild(ModuleResourceStepComponent) moduleResourceStepComponent: ModuleResourceStepComponent;
  @ViewChild(ModulePersonTrainerStepComponent) modulePersonTrainerStepComponent: ModulePersonTrainerStepComponent;
  @ViewChild('matStepper') matStepper: MatStepper;

  public module: ModuleModel = new ModuleModel();
  public moduleBeforeChange: ModuleModel = new ModuleModel();
  public holidaysDate: Array<Date> = [];
  public override dialogParams: {
    model: ModuleModel;
    allModulesInEvent: Array<ModuleModel>;
    isCreate?: boolean;
    isUpdate?: boolean;
    isView?: boolean;
    trainingTemplateId: string;
  };

  constructor(
    private holidayService: HolidayService,
    public moduleService: ModuleService,
    injector: Injector,
    public eventService: EventService,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadHolidaysDate();
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadModuleDetail();
    this.updateChildComponentsTable();
    this.createBeforeCloseHandler();
  }

  createBeforeCloseHandler(): void {
    this.modalComponent.modal.beforeClosed().subscribe({
      next: data => {
        if (!data) {
          this.dialogParams.model = Object.assign(this.dialogParams.model, this.moduleBeforeChange);
        }
      },
    });
  }

  loadModuleDetail(): void {
    this.modalComponent?.showHideLoadingModal(true);

    this.moduleBeforeChange = structuredClone(this.dialogParams?.model);
    this.module = this.dialogParams?.model;

    this.modalComponent?.showHideLoadingModal(false);
  }

  loadHolidaysDate(): void {
    this.holidayService.getHolidays().subscribe({
      next: data => {
        this.holidaysDate = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  updateChildComponentsTable(): void {
    this.updateModuleResourceStep();
    this.updateModulePersonTrainerStep();
  }

  updateModuleResourceStep(): void {
    this.moduleResourceStepComponent.updateChildComponentsTable();
  }

  updateModulePersonTrainerStep(): void {
    this.modulePersonTrainerStepComponent.updateChildComponentsTable();
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      date: ['', [Validators.required]],
      timeStart: [{ value: '', disabled: this.dialogParams?.isView }, [Validators.required]],
      timeEnd: [{ value: '', disabled: this.dialogParams?.isView }, [Validators.required]],
    });
  }

  checkResources(): void {
    this.showLoadPage();
    const checkingType: CheckingTypeEnum =
      this.matStepper.selectedIndex === 0 ? CheckingTypeEnum.RESOURCES : CheckingTypeEnum.PARTICIPANTS;

    this.moduleService.checkBusyResourcesByType(this.module, checkingType).subscribe({
      next: data => {
        this.eventService.checkBusyResourceSuccessHandler(this);
      },
      error: e => {
        this.eventService.errorHandler(e, this);
      },
    });
  }

  save(): void {
    this.eventService
      .showDifferentModuleParticipantsMessage(this.module, this.dialogParams.allModulesInEvent, this)
      .then(resolve => this.checkAndReplaceModules());
  }

  private checkAndReplaceModules(): void {
    new ReplaceModuleServiceService(this.moduleResourceStepComponent).checkAndReplace(
      this.moduleBeforeChange,
      this.module,
    );
  }
}
