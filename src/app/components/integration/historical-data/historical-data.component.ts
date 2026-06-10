import { Component, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { HistoricalDataUploadModalComponent } from '@components/integration/historical-data/modals/upload/historical-data-upload-modal.component';
import { HistoricalDataUploadInfoModalComponent } from '@components/integration/historical-data/modals/upload-info/historical-data-upload-info-modal.component';
import { HistoricalDataService } from '@components/integration/historical-data/services/historical-data.service';

@Component({
  selector: 'app-historical-data',
  templateUrl: './historical-data.component.html',
  styleUrls: ['./historical-data.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class HistoricalDataComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'type',
      colTitleLocKey: 'historicalDataTypeColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'startTime',
      colTitleLocKey: 'historicalDataStartDateColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'endTime',
      colTitleLocKey: 'historicalDataEndDateColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'status',
      colTitleLocKey: 'historicalDataStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'info',
      colTitleLocKey: 'historicalDataInfoColTable',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
    {
      colDef: 'historicalDataFile',
      colTitleLocKey: 'historicalDataFileColTable',
      modelPropertyPath: ['fileStorage', 'name'],
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
  ];

  constructor(
    injector: Injector,
    private historicalDataService: HistoricalDataService,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadHistoricalData();
  }

  public loadHistoricalData() {
    this.table.loading = true;

    this.historicalDataService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  openHistoricalDataUploadModal(): void {
    this.newModal
      .open(HistoricalDataUploadModalComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.loadHistoricalData();
        }
      });
  }

  loadAttachedFile(fileStorage: StandardFileStorageModel, $event): void {
    $event.stopPropagation();
    if (fileStorage) {
      const fileId = fileStorage.id,
        fileName = fileStorage.name;

      this.historicalDataService.loadFileById(fileId, fileName);
    }
  }

  openHistoricalDataUploadInfo(historicalData): void {
    this.newModal.open(HistoricalDataUploadInfoModalComponent, {
      data: {
        historicalData: historicalData,
      },
    });
  }
}
