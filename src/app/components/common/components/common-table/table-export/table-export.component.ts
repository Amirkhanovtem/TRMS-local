import { ChangeDetectionStrategy, Component, Injector, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-table-export',
  templateUrl: './table-export.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table-export.component.scss'],
  standalone: false,
})
export class TableExportComponent extends CommonComponent {
  @Input() tableWrapperComponent: TableWrapperComponent;

  constructor(injector: Injector) {
    super(injector);
  }

  exportAsExcel(): void {
    const exportJson: Array<any> = this.prepareExportJson(),
      ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportJson),
      wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const currentTime = new Date();

    const fileName = currentTime.toLocaleDateString('en-GB') + '-' + currentTime.toLocaleTimeString() + '.xlsx';

    XLSX.writeFile(wb, fileName);
  }

  prepareExportJson(): Array<any> {
    let exportCols: Array<DisplayedColumnInterface> = this.prepareExportColumns(),
      exportData: Array<any> = this.prepareExportData(),
      exportJson: Array<any> = exportData.map(row => {
        const obj = {};

        exportCols.forEach(col => {
          const colHeader: string = this.localization.getLocalTextFromKey(col.colTitleLocKey);
          obj[colHeader] = this.tableWrapperComponent.getVisualValue(row, col.colDef);
        });

        return obj;
      });

    if (!exportJson || exportJson.length === 0) {
      exportJson = this.createEmptyTableWithHeader(exportCols);
    }

    return exportJson;
  }

  createEmptyTableWithHeader(exportCols: Array<DisplayedColumnInterface>): Array<any> {
    return exportCols.map(col => {
      const colHeader: string = this.localization.getLocalTextFromKey(col.colTitleLocKey);

      return { [colHeader]: null };
    });
  }

  prepareExportColumns(): Array<DisplayedColumnInterface> {
    return this.tableWrapperComponent.displayedColumns.filter(col => {
      return col.colType !== DisplayedColumnTypeEnum.FUNC_COL && !col.hidden;
    });
  }

  prepareExportData(): Array<any> {
    const dataSource: MatTableDataSource<any> = this.tableWrapperComponent.dataSource;

    return dataSource.sortData(dataSource.filteredData, dataSource.sort);
  }
}
