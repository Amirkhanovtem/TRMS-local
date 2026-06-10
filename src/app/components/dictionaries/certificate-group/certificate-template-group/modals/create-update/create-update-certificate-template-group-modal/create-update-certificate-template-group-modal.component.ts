import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { CertificateTemplateGroupCertificateTemplateTableComponent } from '@components/dictionaries/certificate-group/certificate-template-group/modals/certificate-template-group-certificate-template-table/certificate-template-group-certificate-template-table.component';
import { CertificateTemplateGroupModel } from '@components/dictionaries/certificate-group/certificate-template-group/models/certificate-template-group.model';
import { CertificateTemplateGroupService } from '@components/dictionaries/certificate-group/certificate-template-group/services/certificate-template-group.service';

@Component({
  selector: 'app-create-update-certificate-template-group-modal',
  templateUrl: './create-update-certificate-template-group-modal.component.html',
  styleUrls: ['./create-update-certificate-template-group-modal.component.scss'],
  standalone: false,
})
export class CreateUpdateCertificateTemplateGroupModalComponent
  extends CommonCreateUpdateComponents<CertificateTemplateGroupModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChild(CertificateTemplateGroupCertificateTemplateTableComponent)
  certificateTemplatesTable: CertificateTemplateGroupCertificateTemplateTableComponent;

  public certificateTemplateGroup: CertificateTemplateGroupModel = new CertificateTemplateGroupModel();

  constructor(
    private certificateTemplateGroupService: CertificateTemplateGroupService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCertificateTemplateGroupDetail();
  }

  loadCertificateTemplateGroupDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.certificateTemplateGroupService.getCertificateTemplateGroup(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.certificateTemplateGroup = data;
          this.updateChildTables();
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  updateChildTables(): void {
    this.updateCertificateTemplatesChildTable();
  }

  private updateCertificateTemplatesChildTable(): void {
    this.certificateTemplatesTable.certificateTemplateGroup = this.certificateTemplateGroup;
    this.certificateTemplatesTable.updateCertificateTemplateTableDataSource();
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      code: ['', [Validators.required, this.noWhitespaceValidator]],
      description: ['', []],
    });
  }

  createOrSaveCertificateTemplateGroup(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create(): void {
    this.certificateTemplateGroupService
      .create(this.certificateTemplateGroup)
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
    this.certificateTemplateGroupService
      .update(this.certificateTemplateGroup)
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
