import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { TableSaveVisualModel } from '@common-table/table-save-visual/models/table-save-visual.model';
import { TableSaveVisualService } from '@common-table/table-save-visual/services/table-save-visual.service';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-table-save-visual',
  templateUrl: './table-save-visual.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table-save-visual.component.scss'],
  standalone: false,
})
export class TableSaveVisualComponent extends CommonComponent implements OnInit {
  @Input() tableWrapperComponent: TableWrapperComponent;
  tableSaveVisualModel: TableSaveVisualModel;

  constructor(
    injector: Injector,
    private tableSaveVisualService: TableSaveVisualService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.tableSaveVisualModel = new TableSaveVisualModel(this.tableWrapperComponent.tableId);
    this.loadVisualTable();
  }

  private loadVisualTable(): void {
    this.tableSaveVisualService.getTableVisual(this.tableSaveVisualModel).subscribe({
      next: (data: TableSaveVisualModel) => {
        this.parseLoadVisualTable(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private parseLoadVisualTable(loadData: TableSaveVisualModel): void {
    if (!loadData) {
      return;
    }

    this.tableSaveVisualModel = loadData;
    this.updateTableBySaveVisual();
  }

  public updateTableBySaveVisual(): void {
    this.setHiddenColumns();
    this.setColumnOrder();
    this.setPageSize();
  }

  public saveVisualTable(): void {
    this.collectNewSaveValue();

    this.tableSaveVisualService.saveTableVisual(this.tableSaveVisualModel).subscribe({
      next: data => {
        this.showSnackBarWithMessage(
          this.localization.getLocalTextFromKey('saveSuccessfulMessage'),
          SnackBarTypeEnum.SUCCESS,
        );
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private collectNewSaveValue(): void {
    const hiddenColumnDefs: Array<string> = [],
      columnOrderDefs: Array<string> = [],
      pageSize: number = this.tableWrapperComponent.paginator.pageSize;

    this.tableWrapperComponent.displayedColumns.forEach(col => {
      columnOrderDefs.push(col.colDef);

      if (col.hidden) {
        hiddenColumnDefs.push(col.colDef);
      }
    });

    this.tableSaveVisualModel.columnOrderDefs = columnOrderDefs;
    this.tableSaveVisualModel.hiddenColumnDefs = hiddenColumnDefs;
    this.tableSaveVisualModel.paginatorPageSize = pageSize;
  }

  private setHiddenColumns(): void {
    const hiddenColumnDefs: Array<string> = this.tableSaveVisualModel?.hiddenColumnDefs;

    if (!hiddenColumnDefs) {
      return;
    }

    this.tableWrapperComponent.displayedColumns.forEach(col => {
      col.hidden = hiddenColumnDefs.includes(col.colDef);
    });
  }

  private setPageSize(): void {
    const pageSize: number = this.tableSaveVisualModel?.paginatorPageSize;

    if (!pageSize) {
      return;
    }

    this.tableWrapperComponent.paginator._changePageSize(pageSize);
  }

  private setColumnOrder(): void {
    const columnOrder: Array<string> = this.tableSaveVisualModel?.columnOrderDefs;

    if (!columnOrder) {
      return;
    }

    this.tableWrapperComponent.displayedColumns.forEach((col, i) => {
      if (!columnOrder.find(orderedColDef => orderedColDef === col.colDef)) {
        columnOrder.splice(i, 0, col.colDef);
      }
    });

    this.tableWrapperComponent.displayedColumns.sort((f, s) => {
      return columnOrder.indexOf(f.colDef) - columnOrder.indexOf(s.colDef);
    });
  }
}
