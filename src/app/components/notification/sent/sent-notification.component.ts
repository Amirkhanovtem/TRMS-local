import { Component, Injector, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { SentNotificationSelectionTableComponent } from '@notification-sent-selection/sent-notification-selection-table.component';
import { SentNotificationService } from '@notification-sent-services/sent-notification.service';

@Component({
  selector: 'app-sent-notification',
  templateUrl: './sent-notification.component.html',
  styleUrls: ['./sent-notification.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class SentNotificationComponent extends CommonComponent {
  @ViewChild(SentNotificationSelectionTableComponent)
  sentNotificationSelectionTableComponent: SentNotificationSelectionTableComponent;

  constructor(
    injector: Injector,
    public sentNotificationService: SentNotificationService,
  ) {
    super(injector);
  }
}
