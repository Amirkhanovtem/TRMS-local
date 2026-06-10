import { Component, Injector, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AttachmentInfoTableComponent } from '@attachment-info-table/attachment-info-table.component';
import { AttachmentInfoTableTypeEnum } from '@attachment-info-table-models/attachment-info-table-type.enum';
import { CommonComponent } from '@common-components/common.component';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { SentNotificationModel } from '@notification-sent-models/sent-notification.model';
import { BodyViewModalComponent } from '@notification-sent-selection-modals-body-view/body-view-modal.component';
import { SentNotificationService } from '@notification-sent-services/sent-notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sent-notification-selection-table',
  templateUrl: './sent-notification-selection-table.component.html',
  styleUrls: ['./sent-notification-selection-table.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class SentNotificationSelectionTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() dataSourceObs: Observable<Array<SentNotificationModel>>;
  @Input() tableId: string = '';

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'sentNotificationNameColTable',
    },
    {
      colDef: 'trigger',
      colTitleLocKey: 'sentNotificationTriggerColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'sendStatus',
      colTitleLocKey: 'sentNotificationSendStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'senderEmail',
      colTitleLocKey: 'sentNotificationSenderEmailColTable',
    },
    {
      colDef: 'receiver',
      colTitleLocKey: 'sentNotificationReceiverColTable',
    },
    {
      colDef: 'body',
      colTitleLocKey: 'sentNotificationBodyColTable',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
  ];

  constructor(
    private sentNotificationService: SentNotificationService,
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

  openBodyViewModal($event, body: string): void {
    $event.stopPropagation();

    this.newModal.open(BodyViewModalComponent, {
      data: {
        body: body,
      },
    });
  }

  showAttachments(): void {
    const selected: Array<SentNotificationModel> = this.table.selection.selected;

    if (selected.length === 0) {
      return;
    }

    const notificationId = selected[0].id;

    this.sentNotificationService.listAttachmentsByNotificationId(notificationId).subscribe({
      next: data => {
        this.openAttachmentsModal(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  openAttachmentsModal(standardNameIdModels: Array<StandardNameIdModel>): void {
    this.newModal.open(AttachmentInfoTableComponent, {
      data: {
        title: this.localization.getLocalTextFromKey('loadAttachmentsModalTitle'),
        attachments: standardNameIdModels,
        type: AttachmentInfoTableTypeEnum.TEMPORAL,
        isView: true,
      },
    });
  }
}
