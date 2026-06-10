import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { DefaultCreateUpdateNodeModel } from '@common-tree-models/default-create-update-node.model';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { CommonTreeService } from '@common-tree-services/common-tree.service';

@Component({
  selector: 'app-default-create-update-tree-node-modal',
  templateUrl: './default-create-update-tree-node-modal.component.html',
  styleUrls: ['./default-create-update-tree-node-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class DefaultCreateUpdateTreeNodeModalComponent
  extends CommonCreateUpdateComponents<StandardFlatNodeModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;

  object: DefaultCreateUpdateNodeModel = new DefaultCreateUpdateNodeModel();
  public override dialogParams: {
    model: StandardFlatNodeModel;
    urlService: string;
    isUpdate?: boolean;
    isView?: boolean;
    isMultiLanguage?: boolean;
  };

  constructor(
    injector: Injector,
    private commonTreeService: CommonTreeService,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadNodeById();
  }

  loadNodeById(): void {
    const node: StandardFlatNodeModel = this.dialogParams.model;

    if (!node) {
      return;
    }

    if (this.dialogParams.isUpdate || this.dialogParams.isView) {
      this.commonTreeService.findById(node, this.dialogParams.urlService).subscribe({
        next: data => (this.object = data),
        error: e => this.errorResponseHandler(e),
      });
    } else {
      this.object.parent = node;
    }
  }

  createForm(): void {
    const formGroup = this.dialogParams.isMultiLanguage
      ? {
          code: ['', [Validators.required, this.noWhitespaceValidator]],
          nameRu: ['', [Validators.required, this.noWhitespaceValidator]],
          nameEn: ['', [Validators.required, this.noWhitespaceValidator]],
          nameKz: ['', [Validators.required, this.noWhitespaceValidator]],
        }
      : {
          code: ['', [Validators.required, this.noWhitespaceValidator]],
          name: ['', [Validators.required, this.noWhitespaceValidator]],
        };

    this.modalForm = this.formBuilder.group(formGroup);
  }

  createOrSave(): void {
    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams.isUpdate ? this.edit() : this.create();
    }
  }

  create(): void {
    this.commonTreeService
      .create(this.object, this.dialogParams.urlService)
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

  edit(): void {
    this.commonTreeService
      .edit(this.object, this.dialogParams.urlService)
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

    this.hideLoadPage();
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
