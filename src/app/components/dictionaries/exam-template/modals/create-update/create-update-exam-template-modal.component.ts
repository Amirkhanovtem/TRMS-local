import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { ExamTemplateTrainingTemplateTableComponent } from '@exam-template-modals-training-template-table/exam-template-training-template-table.component';
import { ExamTemplateModel } from '@exam-template-models/exam-template.model';
import { ExamTemplateScoreTypeEnum } from '@exam-template-models/exam-template-score-type.enum';
import { ExamTemplateService } from '@exam-template-services/exam-template.service';

@Component({
  selector: 'app-create-update-exam-modal',
  templateUrl: './create-update-exam-template-modal.component.html',
  styleUrls: ['./create-update-exam-template-modal.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateExamTemplateModalComponent
  extends CommonCreateUpdateComponents<ExamTemplateModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;

  @ViewChild(ExamTemplateTrainingTemplateTableComponent)
  examTemplateTrainingTemplateTableComponent: ExamTemplateTrainingTemplateTableComponent;
  public examTemplate: ExamTemplateModel = new ExamTemplateModel();
  public allExamTemplateTypes: Array<StandardEnumModel>;
  public allExamScoreTypes: Array<StandardEnumModel>;

  public readonly MAX_TRIES_COUNT = 99;
  public readonly MAX_SCORE = 999999999;

  constructor(
    private examTemplateService: ExamTemplateService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadExamTemplateDetail();
    this.loadAllExamTemplateType();
    this.loadAllExamScoreType();
  }

  loadAllExamTemplateType(): void {
    this.examTemplateService.getAllExamTemplateTypes().subscribe({
      next: data => {
        this.allExamTemplateTypes = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAllExamScoreType(): void {
    this.examTemplateService.getAllExamScoreTypes().subscribe({
      next: data => {
        this.allExamScoreTypes = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadExamTemplateDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.examTemplateService.getExamTemplate(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.loadExamTemplateDetailSuccessHandler(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  loadExamTemplateDetailSuccessHandler(data: ExamTemplateModel): void {
    this.examTemplate = data;
    this.updateChildComponentTable();
  }

  updateChildComponentTable(): void {
    this.updateExamTemplateTrainingTemplateTableComponent();
  }

  updateExamTemplateTrainingTemplateTableComponent(): void {
    this.examTemplateTrainingTemplateTableComponent.examTemplate = this.examTemplate;
    this.examTemplateTrainingTemplateTableComponent.updateTrainingTemplateDataSource();
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      code: ['', [Validators.required, this.noWhitespaceValidator]],
      type: ['', [Validators.required]],
      scoreType: ['', [Validators.required]],
      maxScore: ['', [Validators.required, Validators.min(0), Validators.max(this.MAX_SCORE)]],
      passingScore: ['', [Validators.required, Validators.min(0)]],
      triesCount: ['', [Validators.required, Validators.min(0), Validators.max(this.MAX_TRIES_COUNT)]],
    });

    this.modalForm.setValidators([this.passingScoreValidator()]);
  }

  passingScoreValidator(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors => {
      const maxScoreControl = formGroup.controls['maxScore'],
        passingScoreControl = formGroup.controls['passingScore'],
        scoreTypeControl = formGroup.controls['scoreType'],
        errorCode = 'passingScoreExceedMaxScore';

      const limit = scoreTypeControl.value === ExamTemplateScoreTypeEnum.PERCENT ? 100 : maxScoreControl.value,
        isInvalid: boolean = passingScoreControl.value > limit;

      this.changeControlError(passingScoreControl, errorCode, isInvalid);

      return null;
    };
  }

  createOrSaveExamTemplate(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create(): void {
    this.examTemplateService
      .create(this.examTemplate)
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
    this.examTemplateService
      .update(this.examTemplate)
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
        default:
          this.errorResponseHandler(error);
      }
    });
  }

  uniquenessErrorHandler(content): void {
    content.errorCauses.forEach(errorCause => {
      switch (errorCause.field) {
        case 'code':
          this.setErrorOnValidator('code', content.type);
          break;
      }
    });
  }

  changeScoreType(scoreType: StandardEnumModel): void {
    if (this.dialogParams?.isView) {
      return;
    }

    this.examTemplate.scoreType = scoreType;
    this.changeMaxScoreByScoreType();
  }

  changeMaxScoreByScoreType(): void {
    if (this.isPercentScoreType()) {
      this.examTemplate.maxScore = 100;
    }
  }

  isPercentScoreType(): boolean {
    return this.examTemplate?.scoreType?.id === ExamTemplateScoreTypeEnum.PERCENT;
  }
}
