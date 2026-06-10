import { Component, Inject, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CertificateTemplateModel } from '@certificate-template-models/certificate-template.model';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { ReissueCertificateSelectionCertificateComponent } from '@components/certificate/reissue-certificate-modal/modals/reissue-certificate-selection-certificate/reissue-certificate-selection-certificate.component';
import { FindCertsForReissueDataInterface } from '@components/certificate/reissue-certificate-modal/models/find-certs-for-reissue-data.interface';
import { ReissueCertificateModel } from '@components/certificate/reissue-certificate-modal/models/reissue-certificate.model';
import { ReissueCertificateService } from '@components/certificate/reissue-certificate-modal/services/reissue-certificate.service';

@Component({
  selector: 'app-reissue-certificate-modal',
  templateUrl: './reissue-certificate-modal.component.html',
  styleUrls: ['./reissue-certificate-modal.component.scss'],
  standalone: false,
})
export class ReissueCertificateModalComponent extends CommonComponent {
  @ViewChild('modal') modalComponent: CommonModalComponent;
  reissueCertificateModels: Array<ReissueCertificateModel> = [];
  @ViewChildren(ReissueCertificateSelectionCertificateComponent)
  reissueCertificateSelectionCertificateList: QueryList<ReissueCertificateSelectionCertificateComponent>;

  constructor(
    injector: Injector,
    private reissueCertificateService: ReissueCertificateService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      targetCertificateTemplate: CertificateTemplateModel;
      trainingCardIds: Array<string>;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit() {
    this.loadReissueCertificates();
    super.ngAfterViewInit();
  }

  private loadReissueCertificates(): void {
    this.modalComponent.showHideLoadingModal(true);

    const data: FindCertsForReissueDataInterface = {
      trainingCardIds: this.dialogParams.trainingCardIds,
      targetCertificateTemplateId: this.dialogParams.targetCertificateTemplate.id,
    };

    this.reissueCertificateService.findCertsForReissue(data).subscribe({
      next: data => {
        this.successLoadHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private successLoadHandler(data: Array<ReissueCertificateModel>): void {
    this.reissueCertificateModels = data;
    this.modalComponent.showHideLoadingModal(false);
  }

  reissueCertificates(): void {
    if (!this.validateForms()) {
      return;
    }

    this.showLoadPage();

    const correctedReissueCertificates: Array<ReissueCertificateModel> =
      this.reissueCertificateSelectionCertificateList.map(component => component.getReissueCertificate());

    const reissueCertificates: Array<ReissueCertificateModel> = this.reissueCertificateModels.map(
      reissueCertificate => {
        const correctedReissueCertificate: ReissueCertificateModel = correctedReissueCertificates.find(
          correctedReissueCertificate => {
            return (
              correctedReissueCertificate.newCertificateBySystem.participantCard.id ===
              reissueCertificate.newCertificateBySystem.participantCard.id
            );
          },
        );

        return correctedReissueCertificate ? correctedReissueCertificate : reissueCertificate;
      },
    );

    this.reissueCertificateService.reissueCertificates(reissueCertificates).subscribe({
      next: data => {
        this.successReissueResponseHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private validateForms(): boolean {
    const someFormInvalid: boolean = this.reissueCertificateSelectionCertificateList.some(
      form => !form.modalForm.valid,
    );

    if (someFormInvalid) {
      const message: string = this.localization.getLocalTextFromKey('fillAllRequiredFieldsErrorMessage');

      this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);
    }

    return !someFormInvalid;
  }

  private successReissueResponseHandler(data): void {
    this.hideLoadPage();
    this.modalComponent.closeCurrentModal({
      save: true,
      data: data,
    });
  }
}
