import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { PositionModel } from '@position-models/position.model';
import { PositionService } from '@position-services/position.service';

@Component({
  selector: 'app-create-update-position-modal',
  templateUrl: './create-update-position-modal.component.html',
  styleUrls: ['./create-update-position-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdatePositionModalComponent extends CommonCreateUpdateComponents<PositionModel> implements OnInit {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public position: PositionModel = new PositionModel();

  constructor(
    private positionService: PositionService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadPositionDetail();
  }

  loadPositionDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.positionService.getPosition(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.position = data;
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      nameRu: ['', [Validators.required, this.noWhitespaceValidator]],
      nameKz: ['', [Validators.required, this.noWhitespaceValidator]],
      nameEn: ['', [Validators.required, this.noWhitespaceValidator]],
      code: ['', [Validators.required, this.noWhitespaceValidator]],
      description: ['', []],
    });
  }

  createOrSavePosition(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create(): void {
    this.positionService
      .create(this.position)
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
    this.positionService
      .update(this.position)
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
}
