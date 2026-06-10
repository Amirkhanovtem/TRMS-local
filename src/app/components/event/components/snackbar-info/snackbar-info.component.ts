import { Component } from '@angular/core';
import { EventCreateErrorsTableModalComponent } from '@event-modals-create-errors-table/event-create-errors-table-modal.component';
import { Toast } from 'ngx-toastr';

@Component({
  selector: '[app-snackbar-info]',
  templateUrl: './snackbar-info.component.html',
  styleUrls: ['./snackbar-info.component.scss'],
  standalone: false,
})
export class SnackbarInfoComponent extends Toast {
  data = this.options.payload.data;
  self = this.options.payload.self;

  detail(): void {
    this.self.newModal.open(EventCreateErrorsTableModalComponent, {
      data: {
        resourceCheckErrorCauseList: this.data,
      },
    });
  }
}
