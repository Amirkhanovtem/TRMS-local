import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { HistoricalDataModel } from '@components/integration/historical-data/models/historical-data.model';
import { HistoricalDataService } from '@components/integration/historical-data/services/historical-data.service';

@Component({
  selector: 'app-historical-data-upload-info-modal',
  templateUrl: './historical-data-upload-info-modal.component.html',
  styleUrls: ['./historical-data-upload-info-modal.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class HistoricalDataUploadInfoModalComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'rowNumber',
      colTitleLocKey: 'historicalDataUploadInfoRowNumberColTable',
    },
    {
      colDef: 'colHeaderTitle',
      colTitleLocKey: 'historicalDataUploadInfoColumnColTable',
      modelPropertyPath: ['columnHeader', 'id'],
    },
    {
      colDef: 'type',
      colTitleLocKey: 'historicalDataUploadInfoTypeColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'message',
      colTitleLocKey: 'historicalDataUploadInfoMessageColTable',
    },
  ];

  constructor(
    injector: Injector,
    private historicalDataService: HistoricalDataService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      historicalData: HistoricalDataModel;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadHistoricalDataUploadInfo();
    this.modalComponent.changeCloseWithoutConfirmField(true);
  }

  private loadHistoricalDataUploadInfo(): void {
    this.table.loading = true;

    this.historicalDataService.getHistoricalDataUploadInfo(this.dialogParams?.historicalData.id).subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }
}
