import { Component, Injector, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonComponent } from '@common-components/common.component';
import { SearchComponent } from '@common-search/search.component';
import { CommonDateTimeService } from '@common-services/common-date-time.service';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  template: '',
  standalone: false,
})
export class CommonTableComponent<M> extends CommonComponent {
  public data$: BehaviorSubject<Array<M>> = new BehaviorSubject<Array<M>>([]);
  public dataSource = new MatTableDataSource<M>([]);
  public loading: boolean = true;
  public errorLoading: boolean = false;
  public displayedColumns: Array<DisplayedColumnInterface> = [];
  protected pageSizeOptions = [5, 10, 20, 50, 100];
  protected standardPageSize = 5;
  private commonDateTimeService: CommonDateTimeService;

  @ViewChild(SearchComponent) searchComponent: SearchComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(injector: Injector) {
    super(injector);
    this.commonDateTimeService = injector.get(CommonDateTimeService);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.initTableSettings();
  }

  private initTableSettings(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.dataSource.filterPredicate = this.tableFilterSettings(this.localEnumField);
  }

  public commonLoadTableHandler(data: Array<M>, selection?): void {
    this.dataSource.data = data;
    this.data$.next(this.getData());

    if (selection) {
      selection.clear();
    }

    this.loading = false;
    this.cdref.detectChanges();
  }

  public getData(): Array<M> {
    return this.dataSource.data;
  }

  public getObservableData(): Observable<Array<M>> {
    return this.data$.asObservable();
  }

  public applySearch(): void {
    this.dataSource.filter = 'filter';
  }

  getVisualDisplayedColumns(): Array<DisplayedColumnInterface> {
    return this.displayedColumns.filter(col => !col.hidden);
  }

  getColsWithoutSelect(): Array<DisplayedColumnInterface> {
    return this.displayedColumns.filter(col => col.colDef !== 'select');
  }

  getDisplayedColumnDefs(): Array<string> {
    return this.getVisualDisplayedColumns().map(col => col.colDef);
  }

  public getColTitleByColDef(colDef: string): string {
    const col: DisplayedColumnInterface = this.getColByColDef(colDef);

    return this.localization.getLocalTextFromKey(col?.colTitleLocKey);
  }

  getColByColDef(colDef: string): DisplayedColumnInterface | undefined {
    return this.displayedColumns.find(col => col.colDef === colDef);
  }

  getVisualValue(data: M, colDef: string): any {
    let value: any = this.getColValue(data, colDef),
      col = this.getColByColDef(colDef);

    if (value === null || value === undefined) {
      return '';
    }

    switch (col.colType) {
      case DisplayedColumnTypeEnum.DATE: {
        value = this.commonDateTimeService.convertDateToLocal(new Date(value));
        break;
      }
      case DisplayedColumnTypeEnum.DATE_TIME: {
        value = this.commonDateTimeService.convertDateToLocal(new Date(value), true);
        break;
      }
      case DisplayedColumnTypeEnum.TIME: {
        value = this.commonDateTimeService.convertDateToTime(new Date(value));
        break;
      }
      case DisplayedColumnTypeEnum.BOOLEAN: {
        value = value ? '✔' : '✘';
        break;
      }
    }

    if (col.colVisualValuePipe) {
      value = col.colVisualValuePipe.transform(value);
    }

    return value;
  }

  getColValue(data: M, colDef: string): any {
    const col = this.getColByColDef(colDef);

    if (col.colGetValueFunc) {
      return col.colGetValueFunc(data);
    }

    if (col.modelPropertyPath) {
      let value = data;

      for (const path of col.modelPropertyPath) {
        const newValue = value[path];

        if (!newValue) {
          return newValue;
        }

        value = newValue;
      }

      return value;
    }

    switch (col.colType) {
      case DisplayedColumnTypeEnum.ENUM: {
        return data?.[colDef]?.[this.localization.getLocalFieldEnumName()];
      }
      case DisplayedColumnTypeEnum.FUNC_COL: {
        return undefined;
      }
      default: {
        return data[colDef];
      }
    }
  }

  getFilterVisualValue(data: M, col: DisplayedColumnInterface): any {
    return col.colGetFilterValueFunc ? col.colGetFilterValueFunc(data) : this.getVisualValue(data, col.colDef);
  }

  tableFilterSettings(...args: any): (data: M, filter: string) => boolean {
    const self = this,
      filterFunction = function (data, filter): boolean {
        let displayedCols: Array<DisplayedColumnInterface> = self.getVisualDisplayedColumns(),
          invalidFilter: boolean = false,
          invalidSearch: boolean = true;

        for (let i = 0; i < displayedCols.length && !invalidFilter; i++) {
          const col: DisplayedColumnInterface = displayedCols[i];

          if (!self.checkFilters(data, col)) {
            invalidFilter = true;
          }

          if (invalidSearch && self.checkSearch(data, col)) {
            invalidSearch = false;
          }
        }

        return !invalidFilter && !invalidSearch;
      };

    return filterFunction;
  }

  checkFilters(data: M, col: DisplayedColumnInterface): boolean {
    if (!col.selectedByColFilterValues) {
      return true;
    }

    const visualValue: string = this.getFilterVisualValue(data, col);

    return col.selectedByColFilterValues.includes(visualValue);
  }

  checkSearch(data: M, col: DisplayedColumnInterface): boolean {
    const search: string = this.searchComponent?.search?.trim().toLowerCase();

    if (!search || search.trim().length === 0) {
      return true;
    }

    const visualValue: string = this.getVisualValue(data, col.colDef);

    return visualValue?.toString().toLowerCase().includes(search);
  }

  sortingDataAccessor = (data: M, property: string) => {
    return this.getColValue(data, property);
  };

  public getAllUniqueColValues(col: DisplayedColumnInterface): Array<string> {
    const data: Array<any> = this.getData();
    const uniqueColValueList = new Set<string>();

    data.forEach(row => {
      const visualValue = this.getVisualValue(row, col.colDef);

      uniqueColValueList.add(visualValue);
    });

    return [...uniqueColValueList];
  }

  public getDataByColFilters(filtersCount?: number): Array<M> {
    if (filtersCount === 0) {
      return this.getData();
    }

    const sortedColsByFilter: Array<DisplayedColumnInterface> = this.getColsWithoutSelect()
      .filter(col => col.filterOrder)
      .filter(col => !filtersCount || col.filterOrder <= filtersCount)
      .sort((a: DisplayedColumnInterface, b: DisplayedColumnInterface) => a.filterOrder - b.filterOrder);

    return this.getData().filter(row => {
      return sortedColsByFilter.every(col => {
        return this.checkFilters(row, col);
      });
    });
  }

  clearFilter(col: DisplayedColumnInterface): void {
    delete col.selectedByColFilterValues;
    delete col.filterOrder;
  }
}
