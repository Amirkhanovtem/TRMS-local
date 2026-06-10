import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { CommonComponent } from '@common-components/common.component';
import { SearchComponent } from '@common-search/search.component';
import { CommonTableComponent } from '@common-table/common-table.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';

@Component({
  selector: 'app-table-filter-column',
  templateUrl: './table-filter-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table-filter-column.component.scss'],
  standalone: false,
})
export class TableFilterColumnComponent extends CommonComponent {
  @Input() table: CommonTableComponent<any>;
  @Input() col: DisplayedColumnInterface;
  @Output() changeActive: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('colFilter') colFilter: MatSelect;
  @ViewChild(SearchComponent) search: SearchComponent;

  allFilterValues: Array<string> = [];
  viewFilterValues: Array<string> = [];
  selectedValues: Array<string> = [];

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.subscribeOnOpenFilter();
  }

  private subscribeOnOpenFilter(): void {
    this.colFilter.openedChange.asObservable().subscribe({
      next: opened => {
        this.changeActive.emit(opened);
      },
    });
  }

  fillAllFilterValues(): void {
    this.allFilterValues = this.getVisualValuesUntilCurrentFilter().sort(this.sortFunc);

    if (!this.col.selectedByColFilterValues) {
      this.col.selectedByColFilterValues = [...this.allFilterValues];
    }
  }

  getVisualValuesUntilCurrentFilter(): Array<any> {
    const filterBounds: number = this.col.filterOrder - 1,
      uniqueColVisualValues: Set<string> = new Set<string>();

    this.table.getDataByColFilters(filterBounds).forEach(row => {
      uniqueColVisualValues.add(this.table.getFilterVisualValue(row, this.col));
    });

    return [...uniqueColVisualValues];
  }

  getSelectedValues(): Array<string> {
    return this.col.selectedByColFilterValues;
  }

  selectionHandler(value): void {
    const indexOf = this.selectedValues.indexOf(value);

    if (indexOf === -1) {
      this.selectedValues.push(value);
    } else {
      this.selectedValues.splice(indexOf, 1);
    }
  }

  closeFilterHandler(): void {
    this.viewFilterValues = [];
  }

  scrollHandler() {
    this.colFilter.value = this.selectedValues;
  }

  keyDownHandler(): void {
    this.getAllFilteredUniqueColValues();
    this.colFilter.value = this.selectedValues;
  }

  openColFilter($event): void {
    $event.stopPropagation();

    this.fillAllFilterValues();

    this.search.search = null;
    this.getAllFilteredUniqueColValues();
    this.selectedValues = this.getSelectedValues();
    this.colFilter.value = this.selectedValues;

    setTimeout(() => {
      this.colFilter.open();
    }, 0);
  }

  confirmFilter(): void {
    this.showLoadPage();
    setTimeout(() => {
      this.col.selectedByColFilterValues = this.selectedValues;
      this.setFilterOrder();
      this.setFiltersValueByFilteredDate();
      this.resetFiltersByOrder();
      this.table.applySearch();
      this.hideLoadPage();
    }, 50);
  }

  private resetFiltersByOrder(): void {
    this.table.getColsWithoutSelect().forEach(col => {
      if (!col.filterOrder || col.filterOrder > this.col.filterOrder) {
        this.table.clearFilter(col);
      }
    });

    if (this.isSelectedAll()) {
      delete this.col.filterOrder;
    }
  }

  private setFilterOrder(): void {
    if (this.col.filterOrder) {
      return;
    }

    const orderFilterList: Array<number> = this.table
      .getColsWithoutSelect()
      .map(col => col.filterOrder)
      .filter(filterOrder => filterOrder);

    if (orderFilterList.length === 0) {
      this.col.filterOrder = 1;
    } else {
      this.col.filterOrder = Math.max(...orderFilterList) + 1;
    }
  }

  private setFiltersValueByFilteredDate(): void {
    this.table
      .getColsWithoutSelect()
      .filter(col => !col.filterOrder)
      .forEach(col => {
        const uniqueColValues: Set<string> = new Set<string>();
        this.table.dataSource.filteredData
          .map(row => {
            return this.table.getFilterVisualValue(row, col);
          })
          .forEach(visualValue => uniqueColValues.add(visualValue));

        col.selectedByColFilterValues = [...uniqueColValues];
      });
  }

  isSelectedAll(): boolean {
    return this.allFilterValues.length === this.colFilter.value.length;
  }

  checkAll(): void {
    if (this.isSelectedAll()) {
      this.selectedValues = [];
    } else {
      this.selectedValues = this.allFilterValues;
    }

    this.colFilter.value = this.selectedValues;
  }

  public getAllFilteredUniqueColValues(): void {
    const searchValue = this.search?.search?.toLowerCase();

    this.viewFilterValues = this.allFilterValues.filter(value => {
      if (!searchValue || searchValue.trim().length === 0) {
        return true;
      }

      return value.toLowerCase().includes(searchValue);
    });
  }

  public sortFunc(a, b): number {
    if (a === b) {
      return 0;
    }

    if (!a) {
      return -1;
    }
    if (!b) {
      return 1;
    }

    return a < b ? -1 : 1;
  }
}
