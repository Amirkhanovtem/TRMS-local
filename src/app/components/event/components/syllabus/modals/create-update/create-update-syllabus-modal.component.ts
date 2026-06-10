import { Component, Injector, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { CheckingTypeEnum } from '@event-models/checking-type.enum';
import { ModuleModel } from '@event-module-models/module.model';
import { EventService } from '@event-services/event.service';
import { SyllabusPersonTrainerStepComponent } from '@event-syllabus-modals-create-update-person-trainer-step/syllabus-person-trainer-step.component';
import { SyllabusResourceStepComponent } from '@event-syllabus-modals-create-update-resource-step/syllabus-resource-step.component';
import { SyllabusModel } from '@event-syllabus-models/syllabus.model';
import { SyllabusService } from '@event-syllabus-services/syllabus.service';
import { TrainingModel } from '@event-training-models/training.model';
import { GanttResourceGroupType } from '@gantt-models/gantt-resource-group-type.model';
import { GanttMovedModuleModel } from '@gantt-models/move-events/gantt-moved-module.model';
import { NotificationTemplateCheckingService } from '@notification-checking/services/notification-template-checking.service';
import { SentByTargetNotificationModalComponent } from '@notification-sent-modals-by-target-notification/sent-by-target-notification-modal.component';
import { TargetListComponent } from '@notification-target-modals-list/target-list.component';
import { TargetNotificationTemplateModalComponent } from '@notification-target-modals-notification-template/target-notification-template-modal.component';
import { TargetNotificationTemplateService } from '@notification-target-services/target-notification-template.service';
import { NotificationTemplateTriggerEnum } from '@notification-template-models-enums/notification-template-trigger.enum';
import { ParticipantTrainingCardService } from '@participant-training-card-services/participant-training-card.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-update-syllabus-modal',
  templateUrl: './create-update-syllabus-modal.component.html',
  styleUrls: ['./create-update-syllabus-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateSyllabusModalComponent extends CommonCreateUpdateComponents<SyllabusModel> {
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChild(SyllabusResourceStepComponent) syllabusResourceStepComponent: SyllabusResourceStepComponent;
  @ViewChild(SyllabusPersonTrainerStepComponent) syllabusPersonTrainerStepComponent: SyllabusPersonTrainerStepComponent;
  @ViewChild('matStepper') matStepper: MatStepper;

  public syllabus: SyllabusModel = new SyllabusModel();
  public override dialogParams: {
    model: SyllabusModel;
    isUpdate?: boolean;
    isView?: boolean;
    startDate?: Date;
    resourceId?: string;
    groupId?: GanttResourceGroupType;
    movedModules?: Array<GanttMovedModuleModel>;
    targetTrainingSessionCode?: string;
  };

  constructor(
    injector: Injector,
    public syllabusService: SyllabusService,
    public eventService: EventService,
    private eventNotificationTemplateService: TargetNotificationTemplateService,
    private notificationTemplateCheckingService: NotificationTemplateCheckingService,
    private participantTrainingCardService: ParticipantTrainingCardService,
  ) {
    super(injector);
    this.createForm();
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadSyllabusDetail();
    this.updateChildComponentsTable();
    this.modalComponent.changeCloseWithoutConfirmField(this.dialogParams?.isView);
  }

  loadSyllabusDetail(): void {
    this.modalComponent?.showHideLoadingModal(true);

    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.loadSyllabusEvent();
    } else if (this.dialogParams?.model?.id) {
      this.loadSyllabusTemplateDetail();
    }
  }

  private loadSyllabusEvent(): void {
    const syllabusId: string = this.dialogParams?.model?.id,
      movedModules: Array<GanttMovedModuleModel> = this.dialogParams.movedModules,
      syllabusEventDetailObs: Observable<SyllabusModel> =
        movedModules?.length > 0
          ? this.syllabusService.getSyllabusEventDetailAfterMove(syllabusId, movedModules)
          : this.syllabusService.getSyllabusEventDetail(syllabusId);

    syllabusEventDetailObs.subscribe({
      next: data => {
        this.acceptSyllabusData(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private loadSyllabusTemplateDetail(): void {
    this.syllabusService
      .getSyllabusTemplateDetail(
        this.dialogParams?.model?.id,
        this.dialogParams.startDate,
        this.dialogParams?.resourceId,
        this.dialogParams?.groupId,
      )
      .subscribe({
        next: data => {
          this.acceptSyllabusData(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
  }

  private acceptSyllabusData(data: SyllabusModel): void {
    this.syllabus = data;
    this.updateChildComponentsTable();
    this.openTrainingModalBySessionCode();
    this.modalComponent?.showHideLoadingModal(false);
  }

  private openTrainingModalBySessionCode(): void {
    const sessionCode: string = this.dialogParams.targetTrainingSessionCode;

    if (!sessionCode) {
      return;
    }

    const training: TrainingModel = this.syllabus?.trainings?.find(training => {
      return training.sessionCode === sessionCode;
    });

    if (training) {
      this.syllabusResourceStepComponent.syllabusTrainingTableComponent.openCreateUpdateOrViewTrainingView(training);
    }
  }

  updateChildComponentsTable(): void {
    this.updateSyllabusResourceStep();
    this.updateSyllabusPersonTrainerStep();
  }

  updateSyllabusResourceStep(): void {
    this.syllabusResourceStepComponent.updateChildComponentsTable();
  }

  updateSyllabusPersonTrainerStep(): void {
    this.syllabusPersonTrainerStepComponent.updateChildComponentsTable();
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
    });
  }

  openEvenNotificationTableModal(): void {
    this.newModal.open(TargetNotificationTemplateModalComponent, {
      data: {
        targetId: this.syllabus.id,
        targetName: this.syllabus.name,
        dataSourceObs: this.eventNotificationTemplateService.findAllNotificationTemplateBySyllabusId(this.syllabus.id),
      },
    });
  }

  openAllEventSentNotificationTableModal(): void {
    this.newModal.open(SentByTargetNotificationModalComponent, {
      data: {
        targetId: this.syllabus.id,
      },
    });
  }

  private getModules(): Array<ModuleModel> {
    return this.syllabus.trainings.map(training => training.trainingModules).flat();
  }

  createOrSaveSyllabus(): void {
    this.modalForm.markAllAsTouched();

    new Promise<void>((resolve, reject) =>
      this.validateForm() ? resolve() : reject('fillAllRequiredFieldsErrorMessage'),
    )
      .then(resolve => this.checkSyllabus())
      .then(resolve => this.eventService.checkModulesRoomRequiredByFormat(this.getModules(), this))
      .then(resolve => this.eventService.showConfirmRoomCapacityMessage(this.getModules(), this))
      .then(resolve => this.eventService.showConfirmMinTrainersMessage(this.getModules(), this))
      .then(resolve => this.startCreateUpdate())
      .catch(reason => {
        if (reason) {
          const message = this.localization.getLocalTextFromKey(reason);
          this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);
        }
      });
  }

  checkSyllabus(): Promise<void> {
    const isSyllabusCorrect: boolean = Object.assign(new SyllabusModel(), this.syllabus).checkSyllabus();

    return isSyllabusCorrect ? Promise.resolve() : Promise.reject('moduleInvalidDraftFromsErrorSyllabusMessage');
  }

  startCreateUpdate(): void {
    this.startCreateHandler();
    this.dialogParams?.isUpdate ? this.update() : this.create();
  }

  create(): void {
    this.syllabusService
      .create(this.syllabus)
      .subscribe({
        next: data => {
          this.createUpdateSuccessHandler();
        },
        error: e => {
          this.eventService.errorHandler(e, this);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  update(): void {
    let changedTrainingList: Array<TrainingModel> = [];

    this.checkChangeDateTimeLocationTraining()
      .then(resolve => (changedTrainingList = resolve))
      .finally(() => this.sendUpdateRequest())
      .then(resolve => this.showNotificationForSend(changedTrainingList))
      .finally(() => this.standardCompleteHandler());
  }

  private createUpdateSuccessHandler(): void {
    this.hideLoadPage();
    this.modalComponent.closeCurrentModal(true);
  }

  private checkChangeDateTimeLocationTraining(): Promise<any> {
    return new Promise((resolve, reject) => {
      let changedTrainingList: Array<TrainingModel> = [];

      this.notificationTemplateCheckingService
        .checkTrainingDateTimeLocationWasChanged(this.syllabus.trainings)
        .subscribe({
          next: data => {
            changedTrainingList = data;
          },
          error: e => {
            this.showSnackBarWithMessage(
              this.localization.getLocalTextFromKey('eventNotificationTemplatesCheckTrainingError'),
            );
          },
        })
        .add(() => resolve(changedTrainingList));
    });
  }

  private sendUpdateRequest(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.syllabusService.update(this.syllabus).subscribe({
        next: data => {
          this.createUpdateSuccessHandler();
          resolve(true);
        },
        error: e => {
          this.eventService.errorHandler(e, this);
          reject();
        },
      });
    });
  }

  private showNotificationForSend(changedTrainingList: Array<TrainingModel>): void {
    if (!changedTrainingList || changedTrainingList.length === 0) {
      return;
    }

    this.newModal.open(TargetListComponent, {
      data: {
        targets: changedTrainingList,
        trigger: NotificationTemplateTriggerEnum.TIME_OR_PLACE_CHANGED_IN_TRAINING,
      },
    });
  }

  createOrSaveSyllabusDraft(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.checkSyllabusForDraftSave();
    } else {
      const message = this.localization.getLocalTextFromKey('fillAllRequiredFieldsErrorMessage');
      this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);
    }
  }

  saveAsDraft(): void {
    this.syllabusService
      .saveAsDraft(this.syllabus)
      .subscribe({
        next: data => {
          this.createUpdateSuccessHandler();
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  updateAsDraft(): void {
    this.syllabusService
      .updateAsDraft(this.syllabus)
      .subscribe({
        next: data => {
          this.createUpdateSuccessHandler();
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  private checkSyllabusForDraftSave(): void {
    const isSyllabusDraftCorrect: boolean = Object.assign(
      new SyllabusModel(),
      this.syllabus,
    ).checkSyllabusForDraftSave();

    if (isSyllabusDraftCorrect) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.updateAsDraft() : this.saveAsDraft();
    } else {
      const message = this.localization.getLocalTextFromKey('moduleInvalidDraftFromsErrorSyllabusMessage');
      this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);
    }
  }

  checkResources(): void {
    this.showLoadPage();
    const checkingType: CheckingTypeEnum =
      this.matStepper.selectedIndex === 0 ? CheckingTypeEnum.RESOURCES : CheckingTypeEnum.PARTICIPANTS;

    this.syllabusService.checkBusyResourcesByType(this.syllabus, checkingType).subscribe({
      next: data => {
        this.eventService.checkBusyResourceSuccessHandler(this);
      },
      error: e => {
        this.eventService.errorHandler(e, this);
      },
    });
  }

  openDeleteConfirmModal(): void {
    const trainingIds = this.syllabus.trainings.map(training => training.id);

    this.participantTrainingCardService.checkExistsBeforeDeleteEvent(trainingIds).subscribe({
      next: data => {
        const message = data ? 'deleteEventWithPersonsConfirmTitle' : 'deleteEventConfirmTitle';
        this.deleteConfirmModal(message);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private deleteConfirmModal(message: string): void {
    const modalRef = this.showConfirmModal(this.localization.getLocalTextFromKey(message));

    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.deleteSyllabus();
        }
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  deleteSyllabus(): void {
    this.showLoadPage();
    this.syllabusService.delete(this.syllabus).subscribe({
      next: data => {
        this.createUpdateSuccessHandler();
      },
      error: e => {
        this.eventService.errorHandler(e, this);
      },
    });
  }
}
