import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CertificateTemplateModel } from '@certificate-template-models/certificate-template.model';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TrainingTemplateCertificateTemplateHistoryService } from '@training-template-modals/training-template-certificate-template-history-modal/services/training-template-certificate-template-history.service';

@Component({
  selector: 'app-training-template-certificate-template-history-modal',
  templateUrl: './training-template-certificate-template-history-modal.component.html',
  styleUrls: ['./training-template-certificate-template-history-modal.component.scss'],
  standalone: false,
})
export class TrainingTemplateCertificateTemplateHistoryModalComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'createdBy',
      colTitleLocKey: 'trainingTemplateCertificateTemplateHistoryCreatedByColTable',
    },
    {
      colDef: 'createTs',
      colTitleLocKey: 'trainingTemplateCertificateTemplateHistoryCreateTsColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'certificateTemplate',
      colTitleLocKey: 'trainingTemplateCertificateTemplateHistoryCertificateTemplateColTable',
      modelPropertyPath: ['certificateTemplate', 'name'],
    },
  ];

  constructor(
    injector: Injector,
    public templateCertificateTemplateHistoryService: TrainingTemplateCertificateTemplateHistoryService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      certificateTemplate: CertificateTemplateModel;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    this.modalComponent.changeCloseWithoutConfirmField(true);
    this.loadCertificateTemplateCertificateTemplateHistory();
    super.ngAfterViewInit();
  }

  public loadCertificateTemplateCertificateTemplateHistory() {
    this.table.loading = true;

    this.templateCertificateTemplateHistoryService
      .getAllByCertificateTemplateId(this.dialogParams.certificateTemplate?.id)
      .subscribe({
        next: data => {
          this.table.commonLoadTableHandler(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
  }
}
