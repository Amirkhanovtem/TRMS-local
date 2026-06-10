import { Component, Inject, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CertificateHistoryTemplateFileModel } from '@components/certificate/certificate-history-template-files-modal/models/certificate-history-template-file.model';
import { CertificateHistoryTemplateFilesService } from '@components/certificate/certificate-history-template-files-modal/services/certificate-history-template-files.service';
import { Config } from '@config/config';

@Component({
  selector: 'app-certificate-history-template-files-modal',
  templateUrl: './certificate-history-template-files-modal.component.html',
  styleUrls: ['./certificate-history-template-files-modal.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class CertificateHistoryTemplateFilesModalComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'file',
      colTitleLocKey: 'certificateTemplateHistoryFileFileColTable',
      modelPropertyPath: ['fileStorage', 'name'],
    },
    {
      colDef: 'createTs',
      colTitleLocKey: 'certificateTemplateHistoryFileDownloadDateColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'isActive',
      colTitleLocKey: 'certificateTemplateHistoryFileActiveColTable',
      width: 0,
      colType: DisplayedColumnTypeEnum.BOOLEAN,
    },
  ];

  constructor(
    injector: Injector,
    public certificateHistoryTemplateFilesService: CertificateHistoryTemplateFilesService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      certificate: StandardNameIdModel;
      isTemplate: boolean;
      isSelectable: boolean;
      changeableActive: boolean;
      loadFileAble: boolean;
      deletable: boolean;
    },
  ) {
    super(injector);
    this.setSelectableTable();
    this.certificateHistoryTemplateFilesService.setUrl(this.dialogParams?.isTemplate);
  }

  setSelectableTable(): void {
    if (this.dialogParams?.isSelectable) {
      this.displayedColumns.unshift({
        colDef: 'select',
        colTitleLocKey: 'check',
        colType: DisplayedColumnTypeEnum.FUNC_COL,
      });
    }
  }

  override ngAfterViewInit(): void {
    this.modalComponent.changeCloseWithoutConfirmField(true);
    super.ngAfterViewInit();
    this.loadCertificateTemplateHistoricalFiles();
  }

  public loadCertificateTemplateHistoricalFiles() {
    this.table.loading = true;

    this.certificateHistoryTemplateFilesService.getHistoricalFilesById(this.dialogParams.certificate?.id).subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAttachedFile(fileStorage: StandardFileStorageModel, $event): void {
    $event.stopPropagation();
    if (fileStorage) {
      const fileId = fileStorage.id,
        fileName = fileStorage.name;

      this.certificateHistoryTemplateFilesService.loadFileById(fileId, fileName);
    }
  }

  setActiveBtnDisable(): boolean {
    const selectedOneRow: boolean = this.table?.isOneRowSelected(),
      selectedActive: boolean = this.table?.getSingleSelectedRow()?.isActive;

    return !selectedOneRow || selectedActive;
  }

  setActive(): void {
    const selectedRow: CertificateHistoryTemplateFileModel = this.table?.getSingleSelectedRow();

    if (selectedRow) {
      this.certificateHistoryTemplateFilesService.setActive(selectedRow.id).subscribe({
        next: result => {
          this.loadCertificateTemplateHistoricalFiles();
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  deleteBtnDisable(): (btnName: string) => boolean {
    return (btnName: string): boolean => {
      const selectedRow: Array<CertificateHistoryTemplateFileModel> = this.table?.selection?.selected,
        emptySelected: boolean = selectedRow?.length === 0,
        selectedActiveRow: boolean = selectedRow?.some(row => row.isActive);

      return emptySelected || selectedActiveRow;
    };
  }

  getMapCheckCrudBtnShowFuncMap(): Map<string, (btnName: string) => boolean> {
    return new Map<string, (btnName: string) => boolean>([
      ['create', btnName => false],
      ['edit', btnName => false],
      ['delete', btnName => this.dialogParams?.deletable],
      ['view', btnName => false],
    ]);
  }

  getMapCheckCrudBtnDisableFuncMap(): Map<string, (btnName: string) => boolean> {
    return new Map<string, (btnName: string) => boolean>([['delete', this.deleteBtnDisable()]]);
  }

  getAllowedFileFormats(): string {
    return Config.ALLOWED_WORD_FILE_FORMATS;
  }

  uploadFile(file: File): void {
    this.certificateHistoryTemplateFilesService.uploadFile(this.dialogParams?.certificate?.id, file).subscribe({
      next: result => {
        if (result) {
          this.loadCertificateTemplateHistoricalFiles();
        }
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }
}
