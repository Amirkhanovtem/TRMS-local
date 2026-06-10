import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CreateUpdateTimetableDisplayModalComponent } from '@components/dictionaries/other-group/timetable-display/modals/create-update/create-update-timetable-display-modal/create-update-timetable-display-modal.component';
import { TimetableDisplaySettingsModalComponent } from '@components/dictionaries/other-group/timetable-display/modals/timetable-display-settings-modal/timetable-display-settings-modal.component';
import { TimetableDisplayService } from '@components/dictionaries/other-group/timetable-display/services/timetable-display.service';

@Component({
  selector: 'app-timetable-display',
  templateUrl: './timetable-display.component.html',
  styleUrls: ['./timetable-display.component.scss'],
  standalone: false,
})
export class TimetableDisplayComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateTimetableDisplayModalComponent> =
    CreateUpdateTimetableDisplayModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'timeTableDisplayNameColTable',
    },
    {
      colDef: 'username',
      colTitleLocKey: 'timeTableDisplayUsernameColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'timeTableDisplayDescriptionColTable',
    },
  ];

  constructor(
    public timetableDisplayService: TimetableDisplayService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadTimetableDisplays();
  }

  public loadTimetableDisplays(): void {
    this.table.loading = true;

    this.timetableDisplayService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  public openTimetableDisplaySettingsModal(): void {
    const selectedTimetable = this.table.getSingleSelectedRow();

    this.newModal.open(TimetableDisplaySettingsModalComponent, {
      data: {
        model: selectedTimetable,
      },
    });
  }
}
