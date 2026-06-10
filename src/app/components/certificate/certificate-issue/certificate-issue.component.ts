import { Component, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CertificateHistoryTemplateFilesModalComponent } from '@components/certificate/certificate-history-template-files-modal/certificate-history-template-files-modal.component';
import { CertificateIssueService } from '@components/certificate/certificate-issue/services/certificate-issue.service';
import { PersonFioPipe } from '@person/pipes/person-fio.pipe';

@Component({
  selector: 'app-certificate-issue',
  templateUrl: './certificate-issue.component.html',
  styleUrls: ['./certificate-issue.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class CertificateIssueComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'serialNumber',
      colTitleLocKey: 'certificateIssueCertificateSerialNumberColTable',
    },
    {
      colDef: 'name',
      colTitleLocKey: 'certificateIssueCertificateNameColTable',
    },
    {
      colDef: 'trainingName',
      colTitleLocKey: 'certificateIssueTrainingNameColTable',
    },
    {
      colDef: 'dateOfIssue',
      colTitleLocKey: 'certificateIssueDateColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'dateOfExpire',
      colTitleLocKey: 'certificateIssueExpireThroughColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'certificateActivityStatusByExpireDate',
      colTitleLocKey: 'certificateActivityStatusByExpireDateColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'fullName',
      colTitleLocKey: 'certificateIssueFullNameColTable',
      modelPropertyPath: [],
      colVisualValuePipe: new PersonFioPipe(),
    },
  ];

  constructor(
    private certificateIssueService: CertificateIssueService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadCertificateIssues();
  }

  openFileHistoricalModal(): void {
    if (!this.table.isOneRowSelected()) {
      return;
    }

    this.newModal.open(CertificateHistoryTemplateFilesModalComponent, {
      data: {
        certificate: this.table.selection.selected[0],
        isSelectable: true,
        changeableActive: true,
        loadFileAble: true,
        deletable: true,
      },
    });
  }

  isEditOrViewDisabled(): boolean {
    const row = this.table?.getSingleSelectedRow();

    if (!row) {
      return true;
    }

    return row.dateOfDelete !== null;
  }

  private loadCertificateIssues(): void {
    this.table.loading = true;

    this.certificateIssueService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }
}
