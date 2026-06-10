import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { TagRoleModel } from '@tag-role-models/tag-role.model';
import { TagRoleService } from '@tag-role-services/tag-role.service';

@Component({
  selector: 'app-create-update-tag-role-modal',
  templateUrl: './create-update-tag-role-modal.component.html',
  styleUrls: ['./create-update-tag-role-modal.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateTagRoleModalComponent extends CommonCreateUpdateComponents<TagRoleModel> implements OnInit {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public tagRole: TagRoleModel = new TagRoleModel();

  constructor(
    private tagRoleService: TagRoleService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadTagRoleDetail();
  }

  loadTagRoleDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.tagRoleService.getTagRole(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.tagRole = data;
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
    });
  }

  createOrSaveTagRole(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create(): void {
    this.tagRoleService
      .create(this.tagRole)
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
    this.tagRoleService
      .update(this.tagRole)
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
        case 'name':
          this.setErrorOnValidator('name', content.type);
          break;
      }
    });
  }
}
