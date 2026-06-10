import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AttachmentInfoTableComponent } from '@attachment-info-table/attachment-info-table.component';
import { AttachmentInfoTableTypeEnum } from '@attachment-info-table-models/attachment-info-table-type.enum';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CreateUpdateExamResultComponent } from '@exam-result-modals-create-update/create-update-exam-result.component';
import { ExamAttemptModel } from '@exam-result-models/exam-attempt.model';
import { ExamResultModel } from '@exam-result-models/exam-result.model';
import { ExamAttemptAttachmentsService } from '@exam-result-services/exam-attempt-attachments.service';
import { ExamResultService } from '@exam-result-services/exam-result.service';
import { ExamTemplateScoreTypeEnum } from '@exam-template-models/exam-template-score-type.enum';
import { ParticipantTrainingCardCertificateInfoEnum } from '@participation-card-models/participant-training-card-certificate-info.enum';

@Component({
  selector: 'app-exam-results',
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.scss', '../../../styles.scss'],
  standalone: false,
})
export class ExamResultsComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'examName',
      colTitleLocKey: 'resultExamExamNameColTable',
      modelPropertyPath: ['participantTrainingCardExam', 'exam', 'name'],
    },
    {
      colDef: 'attemptNumber',
      colTitleLocKey: 'resultExamAttemptNumberColTable',
    },
    {
      colDef: 'score',
      colTitleLocKey: 'resultExamResultColTable',
    },
  ];
  private examResult: ExamResultModel = new ExamResultModel();

  constructor(
    private examResultService: ExamResultService,
    private examAttemptAttachmentsService: ExamAttemptAttachmentsService,
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      participantTrainingCardExamId: string;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.modalComponent.changeCloseWithoutConfirmField(true);
    this.loadExamResult();
  }

  private loadExamResult() {
    this.table.loading = true;

    this.examResultService.list(this.dialogParams?.participantTrainingCardExamId).subscribe({
      next: data => {
        this.examResult = data;
        this.table.commonLoadTableHandler(data.examAttempts);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  openAddExamResultModal(): void {
    const modalRef = this.newModal.open(CreateUpdateExamResultComponent, {
      data: {
        participantTrainingCardExamId: this.dialogParams.participantTrainingCardExamId,
      },
    });
    this.closeModalHandler(modalRef);
  }

  openUpdateModal(): void {
    const selectedExamAttempt: Array<ExamAttemptModel> = this.table.selection.selected;

    if (selectedExamAttempt.length == 1) {
      const modalRef = this.newModal.open(CreateUpdateExamResultComponent, {
        data: {
          model: selectedExamAttempt[0],
          isUpdate: true,
        },
      });

      this.closeModalHandler(modalRef);
    }
  }

  closeModalHandler(modalRef: MatDialogRef<CreateUpdateExamResultComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.loadExamResult();
        }
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  checkBtnEnable(btnName: string): boolean {
    let result = false;

    switch (btnName) {
      case 'add':
      case 'edit':
        result = true;
        break;
    }

    return result;
  }

  closeModal(): void {
    this.modalComponent.modal.close();
  }

  public allowedAddNewAttempt(): boolean {
    return this.examResult.isRemainingTries && !this.examResult.isPassed && this.examResult.isEditable;
  }

  public allowedEditAttempt(): boolean {
    return this.isSelectedOneLastAttempt() && !this.examResult.isPassed && this.examResult.isEditable;
  }

  public allowedAttachments(): boolean {
    return this.table?.isOneRowSelected() && this.examResult.isEditable;
  }

  getScoreColValue(examAttempt: ExamAttemptModel): string {
    let scoreTypeStr: string = '';

    switch (examAttempt.scoreType.id) {
      case ExamTemplateScoreTypeEnum.PERCENT:
        scoreTypeStr = '%';
        break;
      case ExamTemplateScoreTypeEnum.POINTS:
        scoreTypeStr = ' ' + this.localization.getLocalTextFromKey('examScoreTypePoints');
        break;
    }

    return examAttempt.score.toString() + scoreTypeStr;
  }

  private isSelectedOneLastAttempt(): boolean {
    if (!this.table?.isOneRowSelected()) {
      return false;
    }

    const targetAttemptNumber: number = this.table?.selection.selected[0].attemptNumber;
    let result: boolean = true;

    this.examResult.examAttempts.every(examResult => {
      if (examResult.attemptNumber > targetAttemptNumber) {
        result = false;
        return false;
      }
      return true;
    });

    return result;
  }

  openAttachmentsModal(): void {
    this.newModal.open(AttachmentInfoTableComponent, {
      data: {
        title: this.localization.getLocalTextFromKey('loadAttachmentsModalTitle'),
        modelId: this.table.selection.selected[0].id,
        attachmentService: this.examAttemptAttachmentsService,
        type: AttachmentInfoTableTypeEnum.PERSISTENT,
      },
    });
  }

  checkDeleteButtonDisabled(): boolean {
    const trainingCardHasCertificate: boolean =
      this.examResult.cardCertificateInfo.id !== ParticipantTrainingCardCertificateInfoEnum.HAS_NOT_CERTIFICATE;

    if (!this.examResult.isEditable || !this.table?.isOneRowSelected() || trainingCardHasCertificate) {
      return true;
    }

    const selectedExamAttempt: ExamAttemptModel = this.table.selection.selected[0],
      lastExamAttemptNumber: number = Math.max(...this.table.getData().map(examAttempt => examAttempt.attemptNumber)),
      selectedLastExamAttempt: boolean = selectedExamAttempt.attemptNumber === lastExamAttemptNumber;

    return !selectedLastExamAttempt;
  }

  openConfirmDeleteAttemptModal(): void {
    const selected: Array<ExamAttemptModel> = this.table.selection.selected;

    if (selected.length != 1) {
      return;
    }

    this.showConfirmModal(this.localization.getLocalTextFromKey('deleteRowConfirmTitle'))
      .afterClosed()
      .subscribe({
        next: result => {
          if (result) {
            this.deleteAttempt(selected[0]);
          }
        },
      });
  }

  deleteAttempt(examAttempt: ExamAttemptModel): void {
    this.examResultService.delete(examAttempt).subscribe({
      next: data => {
        this.loadExamResult();
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }
}
