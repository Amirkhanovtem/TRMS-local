import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DragOrderService } from '@common-drag-order-modal-services/drag-order.service';
import { TimetableDisplayModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display.model';
import { TimetableDisplaySettingsModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display-settings.model';
import { TimetableDisplaySettingsService } from '@components/dictionaries/other-group/timetable-display/services/timetable-display-settings.service';

@Component({
  selector: 'app-timetable-display-settings-modal',
  templateUrl: './timetable-display-settings-modal.component.html',
  styleUrls: ['./timetable-display-settings-modal.component.scss'],
  standalone: false,
})
export class TimetableDisplaySettingsModalComponent
  extends CommonCreateUpdateComponents<TimetableDisplayModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public timetableDisplaySettings: TimetableDisplaySettingsModel = new TimetableDisplaySettingsModel();

  constructor(
    private timetableDisplaySettingsService: TimetableDisplaySettingsService,
    public dragOrderService: DragOrderService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  public ngOnInit(): void {
    this.loadTimetableDisplayDetail();
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      pageSwitchInterval: [
        '',
        [Validators.required, Validators.min(this.DEFAULT_MIN_NUM_VALUE), Validators.max(this.DEFAULT_MAX_NUM_VALUE)],
      ],
    });
  }

  public loadTimetableDisplayDetail(): void {
    this.timetableDisplaySettingsService.getByTimetableDisplayId(this.dialogParams?.model?.id).subscribe({
      next: data => {
        this.timetableDisplaySettings = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  public save(): void {
    this.modalForm.markAllAsTouched();

    if (!this.validateForm()) {
      return;
    }

    this.startCreateHandler();
    this.timetableDisplaySettingsService
      .save(this.timetableDisplaySettings)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }
}
