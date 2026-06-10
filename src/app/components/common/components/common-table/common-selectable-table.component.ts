import { SelectionModel } from '@angular/cdk/collections';
import { CommonTableComponent } from '@common-table/common-table.component';

export class CommonSelectableTableComponent<M> extends CommonTableComponent<M> {
  public selection = new SelectionModel<M>(true, []);
  public clearSelectionAfterLoad: boolean = true;

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.getData().length;

    return numSelected === numRows;
  }

  toggleAllRows() {
    const filteredRows: Array<M> = this.dataSource.filteredData,
      isAllFilteredRowsSelected = filteredRows.every(row => this.selection.isSelected(row));

    if (isAllFilteredRowsSelected) {
      this.selection.deselect(...filteredRows);
    } else {
      this.selection.select(...filteredRows);
    }
  }

  isOneRowSelected(): boolean {
    return this.selection.selected.length == 1;
  }

  isNonSelected(): boolean {
    return !this.selection.hasValue();
  }

  getSingleSelectedRow(): M | undefined {
    return this.isOneRowSelected() ? this.selection?.selected[0] : undefined;
  }
}
