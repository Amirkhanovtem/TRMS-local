import { Component, Injector, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { Role } from '@config/role';
import { CheckingTypeEnum } from '@event-models/checking-type.enum';
import { ModuleModel } from '@event-module-models/module.model';
import { EventService } from '@event-services/event.service';
import { TrainingPersonTrainerStepComponent } from '@event-training-modals-create-update-person-trainer-step/training-person-trainer-step.component';
import { TrainingResourceStepComponent } from '@event-training-modals-create-update-resource-step/training-resource-step.component';
import { TrainingModel } from '@event-training-models/training.model';
import { TrainingService } from '@event-training-services/training.service';
import { GanttResourceGroupType } from '@gantt-models/gantt-resource-group-type.model';
import { GanttMovedModuleModel } from '@gantt-models/move-events/gantt-moved-module.model';
import { NotificationTemplateCheckingService } from '@notification-checking/services/notification-template-checking.service';
import { SentByTargetNotificationModalComponent } from '@notification-sent-modals-by-target-notification/sent-by-target-notification-modal.component';
import { TargetListComponent } from '@notification-target-modals-list/target-list.component';
import { TargetNotificationTemplateModalComponent } from '@notification-target-modals-notification-template/target-notification-template-modal.component';
import { TargetNotificationTemplateService } from '@notification-target-services/target-notification-template.service';
import { NotificationTemplateTableModel } from '@notification-template-modals-selection-models/notification-template-table.model';
import { NotificationTemplateTriggerEnum } from '@notification-template-models-enums/notification-template-trigger.enum';
import { ParticipantTrainingCardService } from '@participant-training-card-services/participant-training-card.service';
import { ParticipationCardComponent } from '@participation-card/participation-card.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-update-training-modal',
  templateUrl: './create-update-training-modal.component.html',
  styleUrls: ['./create-update-training-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateTrainingModalComponent extends CommonCreateUpdateComponents<TrainingModel> {
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChild(TrainingResourceStepComponent) trainingResourceStepComponent: TrainingResourceStepComponent;
  @ViewChild(TrainingPersonTrainerStepComponent) trainingPersonTrainerStepComponent: TrainingPersonTrainerStepComponent;
  @ViewChild('matStepper') matStepper: MatStepper;

  public readonly MIN_REGISTRATION_LIMIT: number = 0;
  public readonly MAX_REGISTRATION_LIMIT: number = 999;
  public training: TrainingModel = new TrainingModel();
  public override dialogParams: {
    model: TrainingModel;
    allModulesInSyllabus: Array<ModuleModel>;
    isCreate?: boolean;
    isUpdate?: boolean;
    isView?: boolean;
    isParentSyllabus?: boolean;
    isUpdatingSyllabus?: boolean;
    startDate: Date;
    resourceId?: string;
    groupId?: GanttResourceGroupType;
    movedModules?: Array<GanttMovedModuleModel>;
  };

  public get isSyllabusTraining(): boolean {
    return this.dialogParams?.isParentSyllabus;
  }

  public get isCreatingTraining(): boolean {
    return this.dialogParams?.isCreate;
  }

  public get isUpdatingTraining(): boolean {
    return this.dialogParams?.isUpdate;
  }

  public get isViewTraining(): boolean {
    return this.dialogParams?.isView;
  }

  constructor(
    public trainingService: TrainingService,
    public eventService: EventService,
    public eventNotificationTemplateService: TargetNotificationTemplateService,
    private notificationTemplateCheckingService: NotificationTemplateCheckingService,
    private participantTrainingCardService: ParticipantTrainingCardService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadTrainingDetail();
    this.updateChildComponentsTable();
    this.modalComponent.changeCloseWithoutConfirmField(this.dialogParams?.isParentSyllabus || this.isViewTraining);
  }

  loadTrainingDetail(): void {
    this.modalComponent?.showHideLoadingModal(true);

    if (this.isUpdatingTraining || this.isViewTraining) {
      this.loadTrainingEvent();
    } else if (this.isCreatingTraining) {
      this.loadTrainingTemplateDetail();
    } else if (this.isSyllabusTraining) {
      this.acceptData(this.dialogParams?.model);
    }
  }

  private loadTrainingEvent(): void {
    const trainingId: string = this.dialogParams.model.id,
      movedModules: Array<GanttMovedModuleModel> = this.dialogParams.movedModules,
      trainingEventDetailObs: Observable<TrainingModel> =
        movedModules?.length > 0
          ? this.trainingService.getTrainingEventDetailAfterMove(trainingId, movedModules)
          : this.trainingService.getTrainingEventDetail(trainingId);

    trainingEventDetailObs.subscribe({
      next: data => {
        this.acceptData(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  get trainingUrl(): string {
    return `${location.origin}/#/gant/training/${this.training.sessionCode}`;
  }

  private loadTrainingTemplateDetail(): void {
    this.trainingService
      .getTrainingTemplateDetail(
        this.dialogParams.model.id,
        this.dialogParams.startDate,
        this.dialogParams?.resourceId,
        this.dialogParams?.groupId,
      )
      .subscribe({
        next: data => {
          this.acceptData(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
  }

  private acceptData(data: TrainingModel): void {
    this.training = data;
    this.updateChildComponentsTable();
    this.modalComponent?.showHideLoadingModal(false);
  }

  updateChildComponentsTable(): void {
    this.updateTrainingResourceStep();
    this.updateTrainingPersonTrainerStep();
  }

  updateTrainingResourceStep(): void {
    this.trainingResourceStepComponent.updateChildComponentsTable();
  }

  updateTrainingPersonTrainerStep(): void {
    this.trainingPersonTrainerStepComponent.updateChildComponentsTable();
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      selfEnrollmentEnabled: [
        {
          value: false,
          disabled: this.dialogParams?.isView,
        },
        [Validators.required],
      ],
      selfEnrollmentRegistrationLimit: [
        {
          value: 0,
          disabled: !this.training.trainingTemplate.trainingTemplateSelfEnrollmentSettings.isEnabledOpenSelfEnrollment,
        },
        [Validators.required, Validators.min(this.MIN_REGISTRATION_LIMIT), Validators.max(this.MAX_REGISTRATION_LIMIT)],
      ],
    });

    this.createSelfEnrollmentEnabledChangeHandler();
  }

  createSelfEnrollmentEnabledChangeHandler(): void {
    this.getValidator('selfEnrollmentEnabled').valueChanges.subscribe({
      next: enable => {
        const registrationLimitRecommendationValidator = this.getValidator('selfEnrollmentRegistrationLimit'),
          value: number = this.training.trainingSelfEnrollmentSettings.registrationLimit,
          defaultValue: number =
            this.training.trainingTemplate.trainingTemplateSelfEnrollmentSettings.defaultRegistrationLimit;

        if (enable) {
          registrationLimitRecommendationValidator.enable();

          if (!value) {
            registrationLimitRecommendationValidator.setValue(defaultValue);
          }
        } else {
          registrationLimitRecommendationValidator.setValue(0);
          registrationLimitRecommendationValidator.disable();
        }
      },
    });
  }

  collectAllModulesInEvent(): Array<ModuleModel> {
    return this.dialogParams?.isParentSyllabus ? this.dialogParams.allModulesInSyllabus : this.training.trainingModules;
  }

  public isCurrentUserCanOpenNotificationTemlates(): boolean {
    return this.isUpdatingTraining || this.dialogParams?.isUpdatingSyllabus;
  }

  openAllEventNotificationTableModal(): void {
    const dataSourceObs: Observable<Array<NotificationTemplateTableModel>> =
      this.eventNotificationTemplateService.findAllNotificationTemplateByTrainingId(this.training.id);

    this.openEvenNotificationTableModal(dataSourceObs);
  }

  openEvenNotificationTableModal(dataSourceObs: Observable<Array<NotificationTemplateTableModel>>): void {
    this.newModal.open(TargetNotificationTemplateModalComponent, {
      data: {
        targetId: this.training.id,
        targetName: this.training.name,
        dataSourceObs: dataSourceObs,
      },
    });
  }

  openAllEventSentNotificationTableModal(): void {
    this.newModal.open(SentByTargetNotificationModalComponent, {
      data: {
        targetId: this.training.id,
      },
    });
  }

  createOrSaveTraining(): void {
    this.modalForm.markAllAsTouched();

    new Promise<void>((resolve, reject) =>
      this.validateForm() ? resolve() : reject('fillAllRequiredFieldsErrorMessage'),
    )
      .then(resolve => this.checkTraining())
      .then(resolve => this.eventService.checkModulesRoomRequiredByFormat(this.training.trainingModules, this))
      .then(resolve => this.eventService.showConfirmRoomCapacityMessage(this.training.trainingModules, this))
      .then(resolve => this.eventService.showConfirmMinTrainersMessage(this.training.trainingModules, this))
      .then(resolve => this.startCreateUpdate())
      .catch(reason => {
        if (reason) {
          const message = this.localization.getLocalTextFromKey(reason);
          this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);
        }
      });
  }

  checkTraining(): Promise<void> {
    const isTrainingCorrect: boolean = Object.assign(new TrainingModel(), this.training).checkTraining();

    return isTrainingCorrect ? Promise.resolve() : Promise.reject('moduleInvalidDraftFromsErrorMessage');
  }

  startCreateUpdate(): void {
    this.startCreateHandler();
    this.dialogParams?.isUpdate ? this.update() : this.create();
  }

  create(): void {
    this.trainingService
      .create(this.training)
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
        .checkTrainingDateTimeLocationWasChanged([this.training])
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
      this.trainingService.update(this.training).subscribe({
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

  checkResources(): void {
    this.showLoadPage();
    const checkingType: CheckingTypeEnum =
      this.matStepper.selectedIndex === 0 ? CheckingTypeEnum.RESOURCES : CheckingTypeEnum.PARTICIPANTS;

    this.trainingService.checkBusyResourcesByType(this.training, checkingType).subscribe({
      next: data => {
        this.eventService.checkBusyResourceSuccessHandler(this);
      },
      error: e => {
        this.eventService.errorHandler(e, this);
      },
    });
  }

  createOrSaveTrainingDraft(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.checkTrainingForDraftSave();
    } else {
      const message = this.localization.getLocalTextFromKey('fillAllRequiredFieldsErrorMessage');
      this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);
    }
  }

  private checkTrainingForDraftSave(): void {
    const isTrainingDraftCorrect: boolean = Object.assign(
      new TrainingModel(),
      this.training,
    ).checkTrainingForDraftSave();

    if (isTrainingDraftCorrect) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.updateAsDraft() : this.saveAsDraft();
    } else {
      const message = this.localization.getLocalTextFromKey('moduleInvalidDraftFromsErrorMessage');
      this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);
    }
  }

  saveAsDraft(): void {
    this.trainingService
      .saveAsDraft(this.training)
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

  updateAsDraft(): void {
    this.trainingService
      .updateAsDraft(this.training)
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

  public isCurrentUserCanOpenParticipantList(): boolean {
    return (
      this.isUpdatingTraining ||
      this.dialogParams?.isUpdatingSyllabus ||
      this.currentUserHasSomeRole([Role.TRAINER, Role.PLANER, Role.SENIOR_PLANER])
    );
  }

  public openParticipantList(): void {
    this.newModal.open(ParticipationCardComponent, {
      data: {
        trainingId: this.training.id,
        trainingName: this.training.name,
      },
    });
  }

  openDeleteConfirmModal(): void {
    this.participantTrainingCardService.checkExistsBeforeDeleteEvent([this.training.id]).subscribe({
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
          this.deleteTraining();
        }
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  deleteTraining(): void {
    this.showLoadPage();
    this.trainingService.delete(this.training).subscribe({
      next: data => {
        this.createUpdateSuccessHandler();
      },
      error: e => {
        this.eventService.errorHandler(e, this);
      },
    });
  }
}
