import { Component, Injector, Input } from '@angular/core';
import { DownloadCertificateService } from '@certificate-issue-services/download-certificate.service';
import { CommonComponent } from '@common-components/common.component';
import { FileFormatEnum } from '@common-input-file-models/file-format.enum';

@Component({
  selector: 'app-download-certificate-by-participant-card-ids',
  templateUrl: './download-certificate-by-participant-card-ids.component.html',
  styleUrls: ['./download-certificate-by-participant-card-ids.component.scss'],
  standalone: false,
})
export class DownloadCertificateByParticipantCardIdsComponent extends CommonComponent {
  @Input() titleLocaleKey: string;
  @Input() class: string = '';
  @Input() disable: boolean;
  @Input() iconBtn: boolean;
  @Input() iconKey: string;
  @Input() participantTrainingCardIds: Array<string> = [];

  public readonly PDF_FILE_FORMAT: FileFormatEnum = FileFormatEnum.PDF;
  public readonly DOCX_FILE_FORMAT: FileFormatEnum = FileFormatEnum.DOCX;

  constructor(
    injector: Injector,
    private downloadCertificateService: DownloadCertificateService,
  ) {
    super(injector);
  }

  downLoadCertificates(fileFormat: FileFormatEnum): void {
    this.downloadCertificateService.downloadCertificates(this.participantTrainingCardIds, fileFormat).subscribe({
      next: data => {
        this.downloadCertificateService.downloadFileSuccessHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }
}
