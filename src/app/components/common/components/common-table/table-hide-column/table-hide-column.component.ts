import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CommonTableComponent } from '@common-table/common-table.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';

@Component({
  selector: 'app-table-hide-column',
  templateUrl: './table-hide-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table-hide-column.component.scss'],
  standalone: false,
})
export class TableHideColumnComponent extends CommonComponent {
  @Input() table: CommonTableComponent<any>;

  public changeHidden(col: DisplayedColumnInterface): void {
    col.hidden = !col.hidden;
    this.table?.applySearch();
  }

  public getSelected(): Array<DisplayedColumnInterface> {
    return this.table?.displayedColumns.filter(col => !col.hidden);
  }
}
