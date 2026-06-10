import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { LocationModel } from '@location-models/location.model';
import { RoomModel } from '@room-models/room.model';
import { RoomStatusEnum } from '@room-models/room-status.enum';
import { RoomService } from '@room-services/room.service';

@Component({
  selector: 'app-room-selection-modal',
  templateUrl: './room-selection-modal.component.html',
  styleUrls: ['./room-selection-modal.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class RoomSelectionModalComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'roomNameColTable',
    },
    {
      colDef: 'location',
      colTitleLocKey: 'roomLocationColTable',
      colGetValueFunc: this.getLocationName,
    },
    {
      colDef: 'status',
      colTitleLocKey: 'roomStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
  ];

  constructor(
    private roomService: RoomService,
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      selectedRooms: Array<RoomModel>;
      customSaveFunc?: (
        selectedRooms: Array<RoomModel>,
        modalRef: MatDialogRef<CommonModalComponent>,
        self: Component,
      ) => any;
      parentComponent?: Component;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadRooms();
  }

  private loadRooms() {
    this.table.loading = true;

    this.roomService.listAllowed().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
        this.setSelectedRowByPrevModal();
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  setSelectedRowByPrevModal() {
    const currentRows = this.table.getData(),
      prevRows = this.dialogParams?.selectedRooms,
      selectedRows: Array<RoomModel> = [];

    if (prevRows && prevRows.length > 0) {
      const prevRowIds = prevRows.map(prevRow => prevRow.id);

      selectedRows.push(...currentRows.filter(currentRow => prevRowIds.includes(currentRow.id)));
    }

    this.table.selection.select(...selectedRows);
  }

  getLocationName(room: RoomModel): string {
    const location: LocationModel = room.location;

    return location.name + ' (' + location.address + ')';
  }

  closeModal() {
    this.modalComponent.modal.close({ save: false });
  }

  saveModal() {
    if (this.dialogParams.customSaveFunc) {
      this.dialogParams.customSaveFunc(
        this.table.selection.selected,
        this.modalComponent.modal,
        this.dialogParams.parentComponent,
      );
    } else {
      this.defaultSaveModal();
    }
  }

  defaultSaveModal() {
    this.modalComponent.modal.close({
      save: true,
      selectedRooms: this.table.selection.selected,
    });
  }

  isRoomDisabled(room: RoomModel): boolean {
    return room.status.id === RoomStatusEnum.ON_REPAIR;
  }

  selectRow(room: RoomModel): void {
    if (!this.isRoomDisabled(room)) {
      this.table.selection.toggle(room);
    }
  }
}
