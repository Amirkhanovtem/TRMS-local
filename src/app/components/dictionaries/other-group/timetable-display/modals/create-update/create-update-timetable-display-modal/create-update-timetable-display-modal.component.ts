import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { TimetableDisplayModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display.model';
import { TimetableDisplayService } from '@components/dictionaries/other-group/timetable-display/services/timetable-display.service';

@Component({
  selector: 'app-create-update-timetable-display-modal',
  templateUrl: './create-update-timetable-display-modal.component.html',
  styleUrls: ['./create-update-timetable-display-modal.component.scss'],
  standalone: false,
})
export class CreateUpdateTimetableDisplayModalComponent
  extends CommonCreateUpdateComponents<TimetableDisplayModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public timeTableDisplay: TimetableDisplayModel = new TimetableDisplayModel();

  constructor(
    private timetableDisplayService: TimetableDisplayService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  public ngOnInit(): void {
    this.loadTimetableDisplayDetail();
  }

  public loadTimetableDisplayDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.timetableDisplayService.getTimetableDisplay(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.timeTableDisplay = data;
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  public createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      username: ['', [Validators.required, this.noWhitespaceValidator]],
      description: ['', []],
    });
  }

  public createOrSaveTimetableDisplay(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  public create(): void {
    this.timetableDisplayService
      .create(this.timeTableDisplay)
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

  public update(): void {
    this.timetableDisplayService
      .update(this.timeTableDisplay)
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

  public errorHandler(error): void {
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

  public uniquenessErrorHandler(content): void {
    content.errorCauses.forEach(errorCause => {
      switch (errorCause.field) {
        case 'username':
          this.setErrorOnValidator('username', content.type);
          break;
      }
    });
  }
}
