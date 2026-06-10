import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { Cit } from 'cit-angular';
import EventData = Cit.EventData;
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';

@Component({
  selector: 'app-selection-draft-modal',
  templateUrl: './selection-draft-modal.component.html',
  styleUrls: ['./selection-draft-modal.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class SelectionDraftModalComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'text',
      colTitleLocKey: 'trainingModuleTableNameColTable',
    },
  ];

  constructor(
    private injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      draftModules: Array<EventData>;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateTrainingDataSource();
  }

  updateTrainingDataSource(): void {
    this.table.commonLoadTableHandler(this.dialogParams.draftModules);
  }

  public choseDraftEvent(event: EventData): void {
    this.modalComponent.modal.close({
      event: event,
    });
  }

  public closeModal(): void {
    this.modalComponent.modal.close(false);
  }
}
