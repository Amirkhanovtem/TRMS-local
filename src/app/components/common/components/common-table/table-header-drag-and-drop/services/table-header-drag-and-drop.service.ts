import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';

@Injectable({
  providedIn: 'root',
})
export class TableHeaderDragAndDropService {
  public changeColOrder(event: CdkDragDrop<Array<string>>, displayedColumns: Array<DisplayedColumnInterface>): void {
    const fromCol: DisplayedColumnInterface = event.item.data.col,
      fromIndex: number = displayedColumns.indexOf(fromCol),
      toCol: DisplayedColumnInterface = displayedColumns.filter(col => col.colDef !== 'select')[event.currentIndex],
      toIndex: number = displayedColumns.indexOf(toCol),
      rememberHiddenColPosition: Map<DisplayedColumnInterface, number> = new Map<DisplayedColumnInterface, number>();

    displayedColumns.forEach((col: DisplayedColumnInterface, i: number) => {
      if (col.hidden) {
        rememberHiddenColPosition.set(col, i);
      }
    });

    moveItemInArray(displayedColumns, fromIndex, toIndex);

    rememberHiddenColPosition.forEach((toIndex: number, col: DisplayedColumnInterface) => {
      const fromIndex: number = displayedColumns.indexOf(col);

      moveItemInArray(displayedColumns, fromIndex, toIndex);
    });
  }
}
