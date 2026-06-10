import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CertificateTemplateModel } from '@certificate-template-models/certificate-template.model';
import { CertificateTemplateService } from '@certificate-template-services/certificate-template.service';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-certificate-template-selection-modal',
  templateUrl: './certificate-template-selection-modal.component.html',
  styleUrls: ['./certificate-template-selection-modal.component.scss'],
  standalone: false,
})
export class CertificateTemplateSelectionModalComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'certificateTemplateNameColTable',
    },
    {
      colDef: 'code',
      colTitleLocKey: 'certificateTemplateCodeColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'certificateTemplateDescriptionColTable',
    },
    {
      colDef: 'expireThrough',
      colTitleLocKey: 'certificateTemplateExpireThroughColTable',
    },
    {
      colDef: 'template',
      colTitleLocKey: 'certificateTemplateTemplateColTable',
      modelPropertyPath: ['fileStorage', 'name'],
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'prefixCode',
      colTitleLocKey: 'certificateTemplatePrefixCodeColTable',
    },
    {
      colDef: 'type',
      colTitleLocKey: 'certificateTemplateTypeColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'category',
      colTitleLocKey: 'certificateTemplateCategoryColTable',
      modelPropertyPath: ['trainingCategory', 'name'],
    },
    {
      colDef: 'trainingTemplate',
      colTitleLocKey: 'certificateTemplateTrainingTemplateColTable',
      modelPropertyPath: ['trainingTemplate', 'name'],
    },
  ];

  constructor(
    private certificateTemplateService: CertificateTemplateService,
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      selectedCertificateTemplates: Array<CertificateTemplateModel>;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadCertificateTemplates();
  }

  public loadCertificateTemplates(): void {
    this.table.loading = true;

    this.certificateTemplateService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
        this.setSelectedRows();
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  setSelectedRows() {
    const currentRows = this.table.getData(),
      prevRows = this.dialogParams?.selectedCertificateTemplates,
      selectedRows: Array<CertificateTemplateModel> = [];

    for (const prevRow of prevRows) {
      const row = currentRows.filter(row => row.id === prevRow.id)[0];
      selectedRows.push(row);
    }

    this.table.selection.select(...selectedRows);
  }

  closeModal() {
    this.modalComponent.modal.close({ save: false });
  }

  saveModal() {
    this.modalComponent.modal.close({
      save: true,
      selectedCertificateTemplates: this.table.selection.selected,
    });
  }
}
