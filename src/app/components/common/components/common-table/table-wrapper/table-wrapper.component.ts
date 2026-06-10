import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { CommonSelectableTableComponent } from '@common-table/common-selectable-table.component';
import { TableSaveVisualComponent } from '@common-table/table-save-visual/table-save-visual.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { TableHeaderDragAndDropService } from '@common-table-table-header-drag-and-drop-services/table-header-drag-and-drop.service';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { TableWrapperColumnHeaderDirective } from '@common-table-table-wrapper-directives/table-wrapper-column-header.directive';

@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table-wrapper.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class TableWrapperComponent extends CommonSelectableTableComponent<any> {
  @Input() override displayedColumns: Array<DisplayedColumnInterface> = [];
  @Input() override paginator: MatPaginator;
  @Input() tableColTemplateList: QueryList<TableWrapperColumnDirective>;
  @Input() tableColHeaderTemplateList: QueryList<TableWrapperColumnHeaderDirective>;
  @Input() tableContainerClass: string = 'mat-elevation-z8';
  @Input() searchContainerClass: string = '';
  @Input() tableId: string = '';
  @Output() rowDbClickFunc = new EventEmitter();
  @ViewChild(TableSaveVisualComponent) tableSaveVisualComponent: TableSaveVisualComponent;

  public hoveredColHeaders: Set<string> = new Set<string>();
  public activeColHeaderPlugins: Set<string> = new Set<string>();

  public changeHoveredColHeaders(colDef: string, hovered: boolean): void {
    if (hovered) {
      this.hoveredColHeaders.add(colDef);
    } else {
      this.hoveredColHeaders.delete(colDef);
    }
  }

  public changeActiveColHeaderPlugins(pluginContainerId: string, active: boolean): void {
    if (active) {
      this.activeColHeaderPlugins.add(pluginContainerId);
    } else {
      this.activeColHeaderPlugins.delete(pluginContainerId);
    }
  }

  public checkPlugin(colDef: string, pluginContainerId: string): boolean {
    return this.hoveredColHeaders.has(colDef) || this.activeColHeaderPlugins.has(pluginContainerId);
  }

  constructor(
    injector: Injector,
    private tableHeaderDragAndDropService: TableHeaderDragAndDropService,
  ) {
    super(injector);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.initPaginator();
  }

  override commonLoadTableHandler(data): void {
    super.commonLoadTableHandler(data, this.clearSelectionAfterLoad ? this.selection : null);
  }

  override errorResponseHandler(error): void {
    super.errorResponseHandler(error);
    this.loading = false;
    this.errorLoading = true;
  }

  public updateTableVisual(): void {
    setTimeout(() => {
      this.tableSaveVisualComponent.updateTableBySaveVisual();
    }, 0);
  }

  public getColHeaderTemplateRefByColDef(colDef: string): TemplateRef<any> {
    return this.tableColHeaderTemplateList?.find(colTemplate => colTemplate.tableWrapperColumnHeader === colDef)
      ?.template;
  }

  public dropHeaderColHandler(event: CdkDragDrop<Array<string>>): void {
    this.tableHeaderDragAndDropService.changeColOrder(event, this.displayedColumns);
  }

  public getColTemplateRefByColDef(colDef: string): TemplateRef<any> {
    return this.tableColTemplateList?.find(colTemplate => colTemplate.tableWrapperColumn === colDef)?.template;
  }

  public getMaxFilterOrder(): number {
    const filterOrders: Array<number> = this.displayedColumns
      .map(col => col.filterOrder)
      .filter(filterOrder => filterOrder);

    return filterOrders.length === 0 ? 0 : Math.max(...filterOrders);
  }

  public clearLastFilter(): void {
    const maxFilterOrder: number = this.getMaxFilterOrder();

    this.displayedColumns
      .filter(col => {
        return !col.filterOrder || col.filterOrder === maxFilterOrder;
      })
      .forEach(col => this.clearFilter(col));

    this.applySearch();
  }

  public clearAllFilters(): void {
    this.displayedColumns.forEach(col => this.clearFilter(col));

    this.applySearch();
  }

  private initPaginator(): void {
    const superGetRangeLabel = this.paginator._intl.getRangeLabel;

    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      this.paginator._intl.itemsPerPageLabel = this.localization.getLocalTextFromKey(
        'customMatPaginatorItemPerPageLabel',
      );

      const result: string = superGetRangeLabel(page, pageSize, length);

      return result.replace('of', this.localization.getLocalTextFromKey('customMatPaginatorOf'));
    };
  }
}
