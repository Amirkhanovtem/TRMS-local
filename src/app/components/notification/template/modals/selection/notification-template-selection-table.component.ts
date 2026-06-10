import { Component, Injector, Input, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { NotificationTemplateTableModel } from '@notification-template-modals-selection-models/notification-template-table.model';
import { NotificationTemplateService } from '@notification-template-services/notification-template.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification-template-selection-table',
  templateUrl: './notification-template-selection-table.component.html',
  styleUrls: ['./notification-template-selection-table.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class NotificationTemplateSelectionTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  @Input() dataSourceObs: Observable<Array<NotificationTemplateTableModel>>;
  @Input() tableId: string = '';

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'notificationNameColTable',
    },
    {
      colDef: 'code',
      colTitleLocKey: 'notificationCodeColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'notificationDescriptionColTable',
    },
    {
      colDef: 'trigger',
      colTitleLocKey: 'notificationTriggerColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'status',
      colTitleLocKey: 'notificationStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
  ];

  constructor(
    public notificationTemplateService: NotificationTemplateService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadDataSource();
  }

  loadDataSource(): void {
    this.table.loading = true;

    this.dataSourceObs.subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }
}
