import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { ExamAttemptModel } from '@exam-result-models/exam-attempt.model';
import { ExamResultResponseExceptionEnum } from '@exam-result-models/exam-result-response-exception.enum';
import { ExamResultService } from '@exam-result-services/exam-result.service';

@Component({
  selector: 'app-create-update-exam-result',
  templateUrl: './create-update-exam-result.component.html',
  styleUrls: ['./create-update-exam-result.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateExamResultComponent extends CommonCreateUpdateComponents<ExamAttemptModel> implements OnInit {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public examAttempt: ExamAttemptModel = new ExamAttemptModel();
  public override dialogParams: {
    model: ExamAttemptModel;
    isUpdate?: boolean;
    isView?: boolean;
    participantTrainingCardExamId?: string;
  };

  constructor(
    private examResultService: ExamResultService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadExamAttemptDetail();
  }

  loadExamAttemptDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.examResultService.getExamAttemptDetail(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.examAttempt = data;
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    } else {
      this.examResultService.getPreparedBodyForExamAttempt(this.dialogParams?.participantTrainingCardExamId).subscribe({
        next: data => {
          this.examAttempt = data;
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  createForm() {
    this.modalForm = this.formBuilder.group({
      examName: ['', [Validators.required, this.noWhitespaceValidator]],
      attemptNumber: ['', [Validators.required]],
      score: ['', [Validators.required, Validators.min(0)]],
    });

    this.modalForm.setValidators([this.maxScoreValidator()]);
  }

  maxScoreValidator(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors => {
      const scoreControl = formGroup.controls['score'],
        errorCode = 'scoreGreaterThanMax';

      if (scoreControl.hasError('required')) {
        return null;
      }

      const invalidScore: boolean = Number(this.examAttempt.maxScore) < Number(scoreControl.value);

      this.changeControlError(scoreControl, errorCode, invalidScore);

      return null;
    };
  }

  isScoreGreaterThanMax(): boolean {
    const validatorErrors = this.getValidator('score')?.errors;
    return this.isFieldInvalid('score') && validatorErrors?.scoreGreaterThanMax;
  }

  createOrSaveExamAttempt() {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create() {
    this.examResultService
      .create(this.examAttempt)
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

  update() {
    this.examResultService
      .update(this.examAttempt)
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

  errorHandler(error) {
    const errorBody = error.error,
      contents = errorBody.contents;

    if (!contents || contents.length <= 0) {
      this.errorResponseHandler(error);
      return;
    }

    contents.forEach(content => {
      switch (content.type) {
        case ExamResultResponseExceptionEnum.MAX_ATTEMPT_CHECK_EXCEPTION_CONTENT: {
          this.setErrorOnValidator('attemptNumber', content.type);
          break;
        }
        default:
          this.errorResponseHandler(error);
      }
    });
  }

  public isMaxAttemptNumberError(): boolean {
    const validatorErrors = this.getValidator('attemptNumber')?.errors;
    return validatorErrors?.MAX_ATTEMPT_CHECK_EXCEPTION_CONTENT;
  }
}
