import { Component, Inject, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AttachmentInfoTableComponent } from '@attachment-info-table/attachment-info-table.component';
import { AttachmentInfoTableTypeEnum } from '@attachment-info-table-models/attachment-info-table-type.enum';
import { CertificateIssueService } from '@certificate-issue-services/certificate-issue.service';
import { CertificateTemplateModel } from '@certificate-template-models/certificate-template.model';
import { CertificateTemplateService } from '@certificate-template-services/certificate-template.service';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CommonDateTimeService } from '@common-services/common-date-time.service';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { TableWrapperColumnHeaderDirective } from '@common-table-table-wrapper-directives/table-wrapper-column-header.directive';
import { ReissueCertificateModalComponent } from '@components/certificate/reissue-certificate-modal/reissue-certificate-modal.component';
import { ResourceCheckErrorCauseModel } from '@event-models/resource-check-error-cause.model';
import { SnackbarInfoComponent } from '@event-snackbar-info/snackbar-info.component';
import { TrainingAttachmentsService } from '@event-training-services/training-attachments.service';
import { ExamResultsComponent } from '@exam-result/exam-results.component';
import { ParticipantTrainingCardExamModel } from '@exam-result-models/participant-training-card-exam.model';
import { ExamTemplateScoreTypeEnum } from '@exam-template-models/exam-template-score-type.enum';
import { NotificationTemplateCheckingService } from '@notification-checking/services/notification-template-checking.service';
import { TargetListComponent } from '@notification-target-modals-list/target-list.component';
import { SendNotificationBodyModel } from '@notification-target-models/send-notification-body.model';
import { NotificationTemplateTriggerEnum } from '@notification-template-models-enums/notification-template-trigger.enum';
import { GenerateCertificateOptionsModalComponent } from '@participation-card-modals/generate-certificate-options-modal/generate-certificate-options-modal.component';
import { GenerateParticipationSheetModalComponent } from '@participation-card-modals-generate-participation-sheet/generate-participation-sheet-modal.component';
import { TrainingNotesComponent } from '@participation-card-modals-training-notes/training-notes.component';
import { ModuleAttendanceStatusEnum } from '@participation-card-models/module-attendance-status.enum';
import { ModuleCardModel } from '@participation-card-models/module-card.model';
import { ParticipantTrainingCardCertificateTemplateInfoEnum } from '@participation-card-models/participant-training-card-certificate-template-info.enum';
import { ParticipationDataUpdateResponseModel } from '@participation-card-models/participation-data-update-response.model';
import { ParticipationListTableDataModel } from '@participation-card-models/participation-list-table-data.model';
import { ParticipationModuleModel } from '@participation-card-models/participation-module.model';
import { ParticipationTrainingAndModulesCardModel } from '@participation-card-models/participation-training-and-modules-card.model';
import { TrainingAttendanceStatusEnum } from '@participation-card-models/training-attendance-status.enum';
import { TrainingCardModel } from '@participation-card-models/training-card.model';
import { TrainingFactualStatusEnum } from '@participation-card-models/training-factual-status.enum';
import { ParticipantTrainingCardSignedCertificatesService } from '@participation-card-services/participant-training-card-signed-certificates.service';
import { ParticipationCardService } from '@participation-card-services/participation-card.service';

export interface ModuleCol {
  matColumnDef: string;
  moduleStartDate: Date;
  colTitle: string;
  trainingModuleId: string;
}

@Component({
  selector: 'app-paticipation-card',
  templateUrl: './participation-card.component.html',
  styleUrls: ['./participation-card.component.scss', '../../../styles.scss'],
  standalone: false,
})
export class ParticipationCardComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;
  @ViewChildren(TableWrapperColumnHeaderDirective)
  tableColHeaderTemplateList: QueryList<TableWrapperColumnHeaderDirective>;

  public displayedColumns: Array<DisplayedColumnInterface> = [];
  loadedData: ParticipationListTableDataModel;
  factualStatus: StandardEnumModel = new StandardEnumModel();
  allModules: Array<ParticipationModuleModel> = [];

  public moduleColumns: Array<ModuleCol> = [];
  public allTrainingAttendanceStatus: Array<StandardEnumModel> = [];
  public allModuleAttendanceStatus: Array<StandardEnumModel> = [];
  public allFactualStatus: Array<StandardEnumModel> = [];
  readonly MODULE_COL_DEF_NAME_PREFIX: string = 'module-';
  private constTrainingCardStatusMap: Map<string, string> = new Map<string, string>();

  constructor(
    private participationCardService: ParticipationCardService,
    private certificateIssueService: CertificateIssueService,
    private certificateTemplateService: CertificateTemplateService,
    private injector: Injector,
    private trainingAttachmentsService: TrainingAttachmentsService,
    private participantTrainingCardSignedCertificatesService: ParticipantTrainingCardSignedCertificatesService,
    private notificationTemplateCheckingService: NotificationTemplateCheckingService,
    private commonDateTimeService: CommonDateTimeService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      trainingId: string;
      trainingName: string;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadData();
  }

  private loadData(): void {
    this.loadParticipationCards();
    this.loadAllTrainingAttendanceStatus();
    this.loadAllModuleAttendanceStatus();
    this.loadAllFactualStatus();
  }

  private loadAllFactualStatus(): void {
    this.participationCardService.getAllFactualStatus().subscribe({
      next: data => {
        this.allFactualStatus = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private loadAllModuleAttendanceStatus(): void {
    this.participationCardService.getAllModuleAttendanceStatus().subscribe({
      next: data => {
        this.allModuleAttendanceStatus = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private loadAllTrainingAttendanceStatus(): void {
    this.participationCardService.getAllTrainingAttendanceStatus().subscribe({
      next: data => {
        this.allTrainingAttendanceStatus = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private loadParticipationCards(): void {
    this.table.loading = true;

    this.participationCardService
      .list(this.dialogParams?.trainingId)
      .subscribe({
        next: data => {
          this.loadedData = data;
          this.factualStatus = data.factualStatus;
          this.allModules = data.allTrainingModules;
          this.prepareTable();
          this.rememberTrainingCardsStatus();
        },
        error: e => {
          this.table.errorResponseHandler(e);
        },
      })
      .add(() => this.cdref.detectChanges());
  }

  getModuleCardByModuleId(
    participationCard: ParticipationTrainingAndModulesCardModel,
    trainingModuleId: string,
  ): ModuleCardModel {
    return participationCard.moduleCards.find(moduleCard => {
      return moduleCard.trainingModule.id === trainingModuleId;
    });
  }

  private rememberTrainingCardsStatus(): void {
    this.table.getData().forEach(participationCard => {
      const trainingCardId = participationCard.trainingCard.id,
        status = participationCard.trainingCard.attendanceStatus.id;

      this.constTrainingCardStatusMap.set(trainingCardId, status);
    });
  }

  getPageTitle(): string {
    const templateTextMap = new Map<string, string>([['trainingName', this.dialogParams.trainingName]]);

    return this.localization.getLocalFormattedTextFromKey('participationCardModalPageTitle', templateTextMap);
  }

  private prepareTable(): void {
    this.clearTable();
    this.fillColHeaders();
    this.fillDisplayedColumns();
    this.setTableData();
  }

  private setTableData(): void {
    this.table.displayedColumns = this.displayedColumns;
    this.table.commonLoadTableHandler(this.loadedData.allParticipationCards);
  }

  private clearTable(): void {
    this.displayedColumns = [];
    this.moduleColumns = [];
  }

  private fillDisplayedColumns(): void {
    this.displayedColumns.push({
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    });
    this.displayedColumns.push({
      colDef: 'personName',
      colTitleLocKey: 'participationCardPersonColTable',
      modelPropertyPath: ['trainingCard', 'person', 'fullNameEn'],
    });
    this.displayedColumns.push({
      colDef: 'position',
      colTitleLocKey: 'personPositionColTable',
      modelPropertyPath: ['trainingCard', 'person', 'position', this.localization.getLocalFieldEnumName()],
    });
    this.displayedColumns.push({
      colDef: 'subdivision',
      colTitleLocKey: 'personSubdivisionColTable',
      modelPropertyPath: ['trainingCard', 'person', 'subdivision', this.localization.getLocalFieldEnumName()],
    });
    this.displayedColumns.push({
      colDef: 'registrationOnEventType',
      colTitleLocKey: 'registrationOnEventType',
      modelPropertyPath: ['trainingCard', 'registrationOnEventType', this.localization.getLocalFieldEnumName()],
    });
    this.displayedColumns.push({
      colDef: 'group',
      colTitleLocKey: 'participationCardGroupColTable',
      modelPropertyPath: ['trainingCard', 'group'],
    });
    this.displayedColumns.push({
      colDef: 'status',
      colTitleLocKey: 'participationCardStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['trainingCard', 'attendanceStatus', this.localization.getLocalFieldEnumName()],
    });

    for (let i = 0; i < this.moduleColumns.length; i++) {
      this.displayedColumns.push({
        colDef: this.MODULE_COL_DEF_NAME_PREFIX + i,
        colTitleLocKey: this.moduleColumns[i].colTitle,
        colGetValueFunc: this.getFuncForVisualValueForModules(this.moduleColumns[i].trainingModuleId),
      });
    }

    if (this.loadedData.trainingWithExam) {
      this.displayedColumns.push({
        colDef: 'exam',
        colTitleLocKey: 'participationCardExamColTable',
        modelPropertyPath: ['trainingCard', 'participantTrainingCardExam', 'finalScore'],
      });
    }

    if (this.loadedData.trainingWithCertificate) {
      this.displayedColumns.push({
        colDef: 'certificate',
        colTitleLocKey: 'participationCardCertificateColTable',
        colType: DisplayedColumnTypeEnum.FUNC_COL,
        offFilter: true,
      });
    }
  }

  private fillColHeaders(): void {
    this.allModules.sort((m1, m2) => m1.order - m2.order);

    this.allModules.forEach((module, index) => {
      const moduleData: string = this.commonDateTimeService.convertDateToLocal(module.startDate),
        moduleName: string = module.name,
        colTitle: string = `${moduleName} (${moduleData})`;

      this.moduleColumns.push({
        matColumnDef: this.MODULE_COL_DEF_NAME_PREFIX + index,
        moduleStartDate: new Date(module.startDate),
        colTitle: colTitle,
        trainingModuleId: module.id,
      });
    });
  }

  public checkParticipantCardHaveThisModule(
    participationCard: ParticipationTrainingAndModulesCardModel,
    trainingModuleId: string,
  ): ModuleCardModel {
    return participationCard.moduleCards.find(moduleCard => moduleCard.trainingModule.id === trainingModuleId);
  }

  public getFuncForVisualValueForModules = (
    trainingModuleId: string,
  ): ((ParticipationTrainingAndModulesCardModel) => string) => {
    return (participationCard: ParticipationTrainingAndModulesCardModel): string => {
      const moduleCardByModuleId: ModuleCardModel = this.getModuleCardByModuleId(participationCard, trainingModuleId);
      return moduleCardByModuleId
        ? moduleCardByModuleId.attendanceStatus[this.localization.getLocalFieldEnumName()]
        : '';
    };
  };

  public isAttended(participationCard: ParticipationTrainingAndModulesCardModel, trainingModuleId: string): boolean {
    const moduleCard: ModuleCardModel = this.getModuleCardByModuleId(participationCard, trainingModuleId);

    if (!moduleCard) {
      return true;
    }

    return moduleCard.attendanceStatus.id === ModuleAttendanceStatusEnum.ATTENDED;
  }

  public isAllAttended(trainingModuleId: string): boolean {
    let result: boolean = true;

    const haveParticipationCard = this.table
      ?.getData()
      .some(participationCard =>
        participationCard.moduleCards.find(moduleCard => moduleCard.trainingModule.id === trainingModuleId),
      );

    if (!haveParticipationCard) {
      return false;
    }

    this.table.getData().every(participationCard => {
      const isParticipantAttended: boolean = this.isAttended(participationCard, trainingModuleId);

      if (!isParticipantAttended) {
        result = false;
        return false;
      }

      return true;
    });

    return result;
  }

  public isIndeterminate(trainingModuleId: string): boolean {
    let minOneIsAttended: boolean = false;

    this.table?.getData().every(participationCard => {
      const moduleCard = this.getModuleCardByModuleId(participationCard, trainingModuleId);

      if (moduleCard && moduleCard.attendanceStatus.id === ModuleAttendanceStatusEnum.ATTENDED) {
        minOneIsAttended = true;
        return false;
      }

      return true;
    });

    return minOneIsAttended && !this.isAllAttended(trainingModuleId);
  }

  public toggleAllParticipationCardsOnModule($event, trainingModuleId: string): void {
    const newStatusId = $event.checked ? ModuleAttendanceStatusEnum.ATTENDED : ModuleAttendanceStatusEnum.ABSENT,
      newStatus = this.allModuleAttendanceStatus.find(status => {
        return status.id === newStatusId;
      });

    this.table?.getData().forEach(participationCard => {
      const moduleCard = this.getModuleCardByModuleId(participationCard, trainingModuleId);
      moduleCard.attendanceStatus = newStatus;
    });
  }

  public changeStatus(participationCard: ParticipationTrainingAndModulesCardModel, trainingModuleId: string): void {
    const moduleCard = this.getModuleCardByModuleId(participationCard, trainingModuleId);

    moduleCard.attendanceStatus = this.allModuleAttendanceStatus.find(status => {
      return status.id !== moduleCard.attendanceStatus.id;
    });
  }

  isLastModuleDisable(): boolean {
    const lastModuleIndex = this.moduleColumns.length - 1,
      lastModuleStartDate = this.moduleColumns[lastModuleIndex]?.moduleStartDate;

    if (!lastModuleStartDate) {
      return true;
    }

    return new Date() < lastModuleStartDate;
  }

  isStatusDisable(participationCard: ParticipationTrainingAndModulesCardModel): boolean {
    const trainingCard: TrainingCardModel = participationCard?.trainingCard,
      hasCertificate = this.participationCardService.participationTrainingCardHasCertificate(trainingCard);

    return hasCertificate || this.isLastModuleDisable();
  }

  isModuleDisabled(moduleStartDate: Date): boolean {
    return new Date() < moduleStartDate;
  }

  closeModal(): void {
    this.modalComponent.modal.close({ save: false });
  }

  saveParticipationCard(): void {
    let needShowNotification: boolean = false;

    this.checkTrainingCompleted()
      .then(resolve => (needShowNotification = resolve))
      .finally(() => this.saveParticipationCardRequest())
      .then(resolve => this.sendNotificationProcessAfterSaveParticipantCard(needShowNotification));
  }

  sendNotificationProcessAfterSaveParticipantCard(needShowNotification): void {
    if (!needShowNotification) {
      return;
    }

    const trigger = this.getTriggerForSendNotificationAfterSaveCards();
    this.showNotificationForSend(trigger);
  }

  getTriggerForSendNotificationAfterSaveCards(): NotificationTemplateTriggerEnum {
    let trigger: NotificationTemplateTriggerEnum = null;

    switch (this.factualStatus.id) {
      case TrainingFactualStatusEnum.COMPLETED: {
        trigger = NotificationTemplateTriggerEnum.TRAINING_COMPLETED;
        break;
      }
      case TrainingFactualStatusEnum.CANCELED: {
        trigger = NotificationTemplateTriggerEnum.TRAINING_CANCELED;
        break;
      }
    }

    return trigger;
  }

  checkTrainingCompleted(): Promise<any> {
    return new Promise((resolve, reject) => {
      let needShowNotification: boolean = false;

      this.notificationTemplateCheckingService
        .checkTrainingCompleted(this.dialogParams?.trainingId, this.factualStatus)
        .subscribe({
          next: data => {
            needShowNotification = data;
          },
          error: e => {
            const message = this.localization.getLocalTextFromKey('eventNotificationTemplatesCheckTrainingError');
            this.showSnackBarWithMessage(message);
          },
        })
        .add(() => resolve(needShowNotification));
    });
  }

  saveParticipationCardRequest(): Promise<any> {
    return new Promise((resolve, reject) => {
      const participationDataUpdateResponseModel: ParticipationDataUpdateResponseModel =
        new ParticipationDataUpdateResponseModel();
      participationDataUpdateResponseModel.trainingId = this.dialogParams?.trainingId;
      participationDataUpdateResponseModel.factualStatus = this.factualStatus;
      participationDataUpdateResponseModel.dtos = this.table?.getData();

      this.participationCardService.saveParticipationCards(participationDataUpdateResponseModel).subscribe({
        next: data => {
          this.successResponseHandler('saveSuccessfulMessage', SnackBarTypeEnum.SUCCESS);
          resolve(true);
        },
        error: e => {
          this.errorHandler(e, this);
          reject(false);
        },
      });
    });
  }

  private showNotificationForSend(
    trigger: NotificationTemplateTriggerEnum,
    sendNotificationBodyModel?: SendNotificationBodyModel,
  ): void {
    if (!trigger) {
      return;
    }

    const training: StandardNameIdModel = new StandardNameIdModel(),
      sendBody: SendNotificationBodyModel = sendNotificationBodyModel
        ? sendNotificationBodyModel
        : new SendNotificationBodyModel();

    training.id = this.dialogParams.trainingId;
    training.name = this.dialogParams.trainingName;

    this.newModal.open(TargetListComponent, {
      data: {
        targets: [training],
        trigger: trigger,
        sendNotificationBodyModel: sendBody,
      },
    });
  }

  generateCertificateProcess(): void {
    this.loadCertificateTemplatesForGenerate()
      .then(certificateTemplates => this.getCertificateTemplateForGenerate(certificateTemplates))
      .then(selectedCertificateTemplate => this.openReissueCertificateModal(selectedCertificateTemplate));
  }

  getCertificateTemplateForGenerate(
    certificateTemplates: Array<CertificateTemplateModel>,
  ): Promise<CertificateTemplateModel> {
    if (certificateTemplates.length === 1) {
      return Promise.resolve(certificateTemplates[0]);
    }

    const modalRef: MatDialogRef<GenerateCertificateOptionsModalComponent> = this.newModal.open(
      GenerateCertificateOptionsModalComponent,
      {
        data: {
          certificateTemplates: certificateTemplates,
        },
      },
    );

    return this.generateCertificateOptionsModalCloseHandler(modalRef);
  }

  loadCertificateTemplatesForGenerate(): Promise<Array<CertificateTemplateModel>> {
    const trainingId: string = this.dialogParams.trainingId;

    return new Promise((resolve, reject) => {
      this.certificateTemplateService.getAllCertificateTemplatesForGenerate(trainingId).subscribe({
        next: data => {
          return resolve(data);
        },
        error: e => {
          this.errorResponseHandler(e);
          return reject();
        },
      });
    });
  }

  generateCertificateOptionsModalCloseHandler(
    modalRef: MatDialogRef<GenerateCertificateOptionsModalComponent>,
  ): Promise<CertificateTemplateModel> {
    return new Promise((resolve, reject) => {
      modalRef.afterClosed().subscribe(result => {
        if (result.save) {
          resolve(result.data);
        } else {
          reject();
        }
      });
    });
  }

  openReissueCertificateModal(selectedCertificateTemplate: CertificateTemplateModel): void {
    if (!selectedCertificateTemplate?.id) {
      return;
    }

    const trainingCardIds: Array<string> = this.collectSelectedTrainingCardIds();

    const modalRef: MatDialogRef<ReissueCertificateModalComponent> = this.newModal.open(
      ReissueCertificateModalComponent,
      {
        data: {
          targetCertificateTemplate: selectedCertificateTemplate,
          trainingCardIds: trainingCardIds,
        },
      },
    );

    this.reissueCertificateModalCloseHandler(modalRef);
  }

  reissueCertificateModalCloseHandler(modalRef: MatDialogRef<ReissueCertificateModalComponent>): void {
    modalRef.afterClosed().subscribe(result => {
      if (result.save) {
        this.createCertificateSuccessHandler(result.data);
      }
    });
  }

  createCertificateSuccessHandler(data: Array<string>): void {
    this.successResponseHandler('saveSuccessfulMessage', SnackBarTypeEnum.SUCCESS);

    const sendNotificationBodyModel: SendNotificationBodyModel = new SendNotificationBodyModel();
    sendNotificationBodyModel.certificateIssueIds = data;

    this.showNotificationForSend(NotificationTemplateTriggerEnum.CERTIFICATE_ISSUE, sendNotificationBodyModel);
  }

  removeIssuedCertificate($event, participationCard: ParticipationTrainingAndModulesCardModel): void {
    $event.stopPropagation();

    this.showConfirmModal(
      this.localization.getLocalTextFromKey('participationCardModalRemoveCertificateConfirmModalMessage'),
    )
      .afterClosed()
      .subscribe({
        next: data => {
          if (data) {
            this.sendRemoveIssuedCertificateRequest(participationCard.trainingCard.certificate.id);
          }
        },
      });
  }

  sendRemoveIssuedCertificateRequest(certificateID: string): void {
    this.certificateIssueService.removeIssuedCertificate(certificateID).subscribe({
      next: data => {
        this.loadData();
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  openSignedCertificatesModal($event, participationCard: ParticipationTrainingAndModulesCardModel): void {
    $event.stopPropagation();

    const personName: string = participationCard.trainingCard.person.fullNameEn,
      mapKey: Map<string, string> = new Map<string, string>([['name', personName]]),
      modalTitle: string = this.localization.getLocalFormattedTextFromKey(
        'signedCertificatesByPersonModalTitle',
        mapKey,
      );

    this.newModal.open(AttachmentInfoTableComponent, {
      data: {
        title: modalTitle,
        modelId: participationCard.trainingCard.id,
        attachmentService: this.participantTrainingCardSignedCertificatesService,
        type: AttachmentInfoTableTypeEnum.PERSISTENT,
      },
    });
  }

  public collectSelectedTrainingCardIds(): Array<string> {
    return this.table?.selection.selected.map(participation => participation.trainingCard.id);
  }

  override successResponseHandler(messageKey: string, type?: SnackBarTypeEnum): void {
    const message = this.localization.getLocalTextFromKey(messageKey);

    this.hideLoadPage();
    this.showSnackBarWithMessage(message, type);
    this.loadParticipationCards();
  }

  isDownLoadCertificateBtnDisabled(): boolean {
    return this.isSelectionEmpty() || !this.isAllSelectedRowsHaveCertificate();
  }

  isCreateCertificateBtnDisabled(): boolean {
    return (
      this.isSelectionEmpty() ||
      this.selectedNotCompletedStatus() ||
      this.isAnySelectedRowHaveCertificate() ||
      this.isAnySelectedRowDontPassedExam() ||
      this.isAnySelectedRowDontHaveCertificateTemplateFile()
    );
  }

  isSelectionEmpty(): boolean {
    return this.table?.selection.selected.length === 0;
  }

  isAllSelectedRowsHaveCertificate(): boolean {
    let result: boolean = true;

    this.table?.selection.selected.every(row => {
      const hasCertificate: boolean = this.participationCardService.participationTrainingCardHasCertificate(
        row.trainingCard,
      );

      if (!hasCertificate) {
        result = false;
        return false;
      }

      return true;
    });

    return result;
  }

  isAnySelectedRowHaveCertificate(): boolean {
    return this.table?.selection.selected.some(row => {
      return this.participationCardService.participationTrainingCardHasCertificate(row.trainingCard);
    });
  }

  isAnySelectedRowDontPassedExam(): boolean {
    return this.table?.selection.selected.some(row => {
      const participantTrainingCardExam = row.trainingCard.participantTrainingCardExam;

      return participantTrainingCardExam && !participantTrainingCardExam?.isPassed;
    });
  }

  isAnySelectedRowDontHaveCertificateTemplateFile(): boolean {
    return this.table?.selection.selected.some(row => {
      const certificateTemplateInfo: ParticipantTrainingCardCertificateTemplateInfoEnum =
        ParticipantTrainingCardCertificateTemplateInfoEnum[row.trainingCard.certificateTemplateInfo.id];

      return (
        certificateTemplateInfo !== ParticipantTrainingCardCertificateTemplateInfoEnum.HAS_CERTIFICATE_TEMPLATE_FILE
      );
    });
  }

  selectedNotCompletedStatus(): boolean {
    return this.table?.selection.selected.some(row => {
      const trainingCardId = row.trainingCard.id,
        status = this.constTrainingCardStatusMap.get(trainingCardId);

      return status !== TrainingAttendanceStatusEnum.COMPLETED;
    });
  }

  openExamResultsTable(participationCard: ParticipationTrainingAndModulesCardModel): void {
    const modalRef = this.newModal.open(ExamResultsComponent, {
      data: {
        participantTrainingCardExamId: participationCard.trainingCard.participantTrainingCardExam?.id,
      },
    });

    this.closeExamModalHandler(modalRef);
  }

  private closeExamModalHandler(modalRef: MatDialogRef<ExamResultsComponent>): void {
    modalRef.afterClosed().subscribe(data => this.loadParticipationCards());
  }

  getExamColValue(participationCard: ParticipationTrainingAndModulesCardModel): string {
    const participantTrainingCardExam: ParticipantTrainingCardExamModel =
      participationCard?.trainingCard?.participantTrainingCardExam;

    if (!participantTrainingCardExam) {
      return null;
    }

    const finalScore: number = participantTrainingCardExam.finalScore;

    if (finalScore === null) {
      return this.localization.getLocalTextFromKey('addBtn');
    }

    let scoreTypeStr: string = '';

    switch (participantTrainingCardExam.scoreType.id) {
      case ExamTemplateScoreTypeEnum.PERCENT:
        scoreTypeStr = '%';
        break;
      case ExamTemplateScoreTypeEnum.POINTS:
        scoreTypeStr = ' ' + this.localization.getLocalTextFromKey('examScoreTypePoints');
        break;
    }

    return finalScore.toString() + scoreTypeStr;
  }

  isTrainingCompleted(participationCard: ParticipationTrainingAndModulesCardModel): boolean {
    const trainingAttendanceStatus = this.constTrainingCardStatusMap.get(participationCard.trainingCard.id);

    return trainingAttendanceStatus === TrainingAttendanceStatusEnum.COMPLETED;
  }

  public showCertificateActionBtns(participationCard: ParticipationTrainingAndModulesCardModel): boolean {
    return this.participationCardService.participationTrainingCardHasCertificate(participationCard.trainingCard);
  }

  public showEmptyCertificateTemplateError(participationCard: ParticipationTrainingAndModulesCardModel): boolean {
    const trainingCard = participationCard.trainingCard,
      hasCertificate: boolean = this.participationCardService.participationTrainingCardHasCertificate(trainingCard),
      certificateTemplateInfo: ParticipantTrainingCardCertificateTemplateInfoEnum =
        ParticipantTrainingCardCertificateTemplateInfoEnum[trainingCard.certificateTemplateInfo.id];

    return (
      certificateTemplateInfo === ParticipantTrainingCardCertificateTemplateInfoEnum.HAS_CERTIFICATE_TEMPLATE &&
      !hasCertificate
    );
  }

  openAttachmentsModal(): void {
    this.newModal.open(AttachmentInfoTableComponent, {
      data: {
        title: this.localization.getLocalTextFromKey('loadAttachmentsModalTitle'),
        modelId: this.dialogParams.trainingId,
        attachmentService: this.trainingAttachmentsService,
        type: AttachmentInfoTableTypeEnum.PERSISTENT,
      },
    });
  }

  openGenerateParticipationSheetModal(): void {
    this.newModal.open(GenerateParticipationSheetModalComponent, {
      data: {
        trainingId: this.dialogParams.trainingId,
      },
    });
  }

  errorHandler(error, self): void {
    const errorBody = error.error,
      contents = errorBody.contents;
    const resourceCheckErrorCauseList: Array<ResourceCheckErrorCauseModel> = [];

    if (!contents || contents.length <= 0) {
      self.errorResponseHandler(error);
      return;
    }

    contents.forEach(content => {
      switch (content.type) {
        case EntityExceptionEnum.RESOURCE_CHECK_EXCEPTION_CONTENT: {
          resourceCheckErrorCauseList.push(...content.errorCauses);
          break;
        }
        default:
          self.errorResponseHandler(error);
      }
    });

    self.hideLoadPage();
    ParticipationCardComponent.showEventCreateResourceBusySnackBar(resourceCheckErrorCauseList, self);
  }

  private static showEventCreateResourceBusySnackBar(
    resourceCheckErrorCauseList: Array<ResourceCheckErrorCauseModel>,
    self,
  ): void {
    if (!resourceCheckErrorCauseList || resourceCheckErrorCauseList.length === 0) {
      return;
    }

    self.showSnackBarWithMessage(
      self.localization.getLocalTextFromKey('eventCreateErrorsSnackBarMessage'),
      SnackBarTypeEnum.ERROR,
      {
        timeOut: 0,
        toastComponent: SnackbarInfoComponent,
        payload: {
          data: resourceCheckErrorCauseList,
          self: self,
        },
      },
    );
  }

  setAttendanceStatusSelectedPersons(newAttendanceStatus: StandardEnumModel): void {
    this.table.selection.selected.forEach(selectedRow => {
      selectedRow.trainingCard.attendanceStatus = newAttendanceStatus;
    });
  }

  openTrainingNotes(): void {
    this.newModal.open(TrainingNotesComponent, {
      data: {
        trainingId: this.dialogParams.trainingId,
        trainingName: this.dialogParams.trainingName,
      },
    });
  }
}
