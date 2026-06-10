import { Component, Injector, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CertificateService } from '@components/certificate/certificate/services/certificate.service';

@Component({
  selector: 'app-certificate-reissue-hierarchy-table',
  templateUrl: './certificate-reissue-hierarchy-table.component.html',
  styleUrls: ['./certificate-reissue-hierarchy-table.component.scss'],
  standalone: false,
})
export class CertificateReissueHierarchyTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() set targetCertificateId(targetCertificateId: string) {
    this.loadCertificateReissueHierarchy(targetCertificateId);
  }

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'dateOfIssue',
      colTitleLocKey: 'certificateModalCertificateDateOfIssue',
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'dateOfExpire',
      colTitleLocKey: 'certificateModalCertificateExpireDate',
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'certificateStatus',
      colTitleLocKey: 'certificateModalCertificateStatus',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'open',
      colTitleLocKey: 'openBtn',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
    {
      colDef: 'download',
      colTitleLocKey: 'downloadBtn',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
    {
      colDef: 'serialNumber',
      colTitleLocKey: 'certificateModalSerialNumber',
      modelPropertyPath: ['serialNumberInfo', 'serialNumber'],
    },
    {
      colDef: 'reissueByCertificateSerialNumber',
      colTitleLocKey: 'certificateModalReissueByCertificateSerialNumber',
      modelPropertyPath: ['reissuedByCertificate', 'serialNumberInfo', 'serialNumber'],
    },
  ];

  constructor(
    private certificateService: CertificateService,
    private injector: Injector,
    private modal: MatDialogRef<any>,
  ) {
    super(injector);
  }

  getBeforeOpen(): () => Promise<void> {
    return () =>
      new Promise<void>((resolve, reject) => {
        const confirmMessage: string = this.localization.getLocalTextFromKey('closeModalConfirmTitle');
        this.showConfirmModal(confirmMessage)
          .afterClosed()
          .subscribe({
            next: result => {
              if (result) {
                this.modal.afterClosed().subscribe(() => resolve());
                this.modal.close(false);
              }
            },
          });
      });
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  loadCertificateReissueHierarchy(targetCertificateId: string): void {
    if (!targetCertificateId) {
      return;
    }

    this.certificateService.getCertificateReissueHierarchyById(targetCertificateId).subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }
}
