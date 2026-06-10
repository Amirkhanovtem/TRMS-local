import { Component, Injector, Input } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { FileFormatEnum } from '@common-input-file-models/file-format.enum';
import { DownloadCertificateService } from '@components/certificate/certificate-issue/services/download-certificate.service';

@Component({
  selector: 'app-certificate-issue-download-view-btns',
  templateUrl: './certificate-issue-download-view-btns.component.html',
  styleUrls: ['./certificate-issue-download-view-btns.component.scss'],
  standalone: false,
})
export class CertificateIssueDownloadViewBtnsComponent extends CommonComponent {
  @Input() participantTrainingCardId: string;

  constructor(
    private downloadCertificateService: DownloadCertificateService,
    injector: Injector,
  ) {
    super(injector);
  }

  viewCertificate(): void {
    this.downloadCertificateService
      .downloadCertificates([this.participantTrainingCardId], FileFormatEnum.PDF)
      .subscribe({
        next: data => {
          this.openViewCertificate(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
  }

  private openViewCertificate(resp): void {
    const file = resp.body,
      fileName = this.downloadCertificateService.getFileNameFromContentDisposition(resp);

    this.downloadCertificateService.openViewPdfInNewTab(file, fileName);
  }
}
