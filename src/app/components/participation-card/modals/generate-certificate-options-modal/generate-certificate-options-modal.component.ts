import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CertificateTemplateModel } from '@certificate-template-models/certificate-template.model';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';

@Component({
  selector: 'app-generate-certificate-options-modal',
  templateUrl: './generate-certificate-options-modal.component.html',
  styleUrls: ['./generate-certificate-options-modal.component.scss'],
  standalone: false,
})
export class GenerateCertificateOptionsModalComponent extends CommonComponent {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public selectedCertificateTemplate: CertificateTemplateModel = new CertificateTemplateModel();
  public allCertificateTemplates: Array<CertificateTemplateModel> = [];

  constructor(
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      certificateTemplates: Array<CertificateTemplateModel>;
    },
  ) {
    super(injector);
    this.setDate();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.modalComponent.changeCloseWithoutConfirmField(true);
  }

  private setDate(): void {
    this.allCertificateTemplates = this.dialogParams.certificateTemplates;
    this.selectedCertificateTemplate = this.allCertificateTemplates[0];
  }

  public confirm(): void {
    this.modalComponent.closeCurrentModal({
      save: true,
      data: this.selectedCertificateTemplate,
    });
  }
}
