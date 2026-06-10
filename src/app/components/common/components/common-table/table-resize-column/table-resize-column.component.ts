import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';

@Component({
  selector: 'app-table-resize-column',
  templateUrl: './table-resize-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table-resize-column.component.scss'],
  standalone: false,
})
export class TableResizeColumnComponent extends CommonComponent {
  @Input() displayedColumns: Array<DisplayedColumnInterface>;
  @Input() resizeCol: DisplayedColumnInterface;
  @Input() tableWrapperContainer: HTMLDivElement;
  @Output() changeActive: EventEmitter<any> = new EventEmitter<any>();

  colIndex: number;
  isLastCol: boolean;
  isResizing: boolean = false;
  startX: number;
  allHeaders: HTMLCollection;

  @HostListener('window:mouseup')
  onMouseUp(): void {
    this.setActiveResize(false);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.resizeColHandler(event);
  }

  startResizingHandler(event: MouseEvent): void {
    event.stopPropagation();
    this.setActiveResize(true);
    this.startX = event.pageX;
    this.setColIndex();
    this.collectAllHeaders();
    this.rememberAllColCurrentWidth();
  }

  private setActiveResize(isResizing: boolean): void {
    this.isResizing = isResizing;
    this.changeActive.emit(isResizing);
  }

  private collectAllHeaders(): void {
    this.allHeaders = this.tableWrapperContainer.getElementsByClassName('mat-mdc-header-cell');
  }

  private getColHTMLElement(col: DisplayedColumnInterface): Element {
    return Array.from(this.allHeaders).find(header => {
      return header.classList.contains(`mat-column-${col.colDef}`);
    });
  }

  private getColHTMLElementWidth(col: DisplayedColumnInterface): number {
    return this.getColHTMLElement(col)['offsetWidth'];
  }

  setColIndex(): void {
    this.colIndex = this.displayedColumns.indexOf(this.resizeCol);
    this.isLastCol = this.displayedColumns.length === this.colIndex;
  }

  private resizeColHandler(event: MouseEvent): void {
    if (!this.isResizing) {
      return;
    }

    const dx: number = event.pageX - this.startX,
      withScroll: boolean = this.tableWrapperContainer.scrollWidth > this.tableWrapperContainer.clientWidth;

    if (!withScroll && dx < 0 && !this.isLastCol) {
      this.displayedColumns[this.colIndex + 1].width -= dx;
    }

    if (!this.isLastCol) {
      this.resizeCol.width += dx;
    }

    this.startX = event.pageX;
  }

  private rememberAllColCurrentWidth(): void {
    this.displayedColumns.filter(col => !col.hidden).forEach(col => (col.width = this.getColHTMLElementWidth(col)));
  }
}
