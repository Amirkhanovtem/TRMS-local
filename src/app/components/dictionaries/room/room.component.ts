import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { LocationModel } from '@location-models/location.model';
import { LocationService } from '@location-services/location.service';
import { CreateUpdateRoomModalComponent } from '@room-modals-create-update/create-update-room-modal.component';
import { RoomModel } from '@room-models/room.model';
import { RoomService } from '@room-services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class RoomComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateRoomModalComponent> = CreateUpdateRoomModalComponent;
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
      colDef: 'description',
      colTitleLocKey: 'roomDescriptionColTable',
    },
    {
      colDef: 'capacity',
      colTitleLocKey: 'roomCapacityColTable',
    },
    {
      colDef: 'quadrature',
      colTitleLocKey: 'roomQuadratureColTable',
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
    public roomService: RoomService,
    private modal: MatDialog,
    public locationService: LocationService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadRooms();
  }

  public loadRooms(): void {
    this.table.loading = true;

    this.roomService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  getLocationName(room: RoomModel): string {
    const location: LocationModel = room.location;

    return `${location.name} (${location.address})`;
  }
}
