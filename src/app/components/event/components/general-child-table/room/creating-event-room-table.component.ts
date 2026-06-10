import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { CommonDateTimeService } from '@common-services/common-date-time.service';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { EquipmentModel } from '@equipment-models/equipment.model';
import { ModuleModel } from '@event-module-models/module.model';
import { EventService } from '@event-services/event.service';
import { CreateUpdateRoomModalComponent } from '@room-modals-create-update/create-update-room-modal.component';
import { RoomSelectionModalComponent } from '@room-modals-selection/room-selection-modal.component';
import { RoomModel } from '@room-models/room.model';
import { RoomReservationModel } from '@room-models/room-reservation.model';

@Component({
  selector: 'app-creating-event-room-table',
  templateUrl: './creating-event-room-table.component.html',
  styleUrls: ['./creating-event-room-table.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class CreatingEventRoomTableComponent extends CommonComponent implements OnInit {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() modules: Array<ModuleModel> = [];
  @Input() isView: boolean = false;
  @Input() isModuleForm: boolean = false;
  @Input() tableId: string = '';
  @Output() changeModuleTimeByRoomsTime? = new EventEmitter<ModuleModel>();
  @Output() updateEquipmentsBySelectedRooms? = new EventEmitter();
  @Output() removeEquipmentsByRoom? = new EventEmitter<string>();

  displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'creatingEventRoomsTableNameCol',
      modelPropertyPath: ['room', 'name'],
    },
    {
      colDef: 'actions',
      colTitleLocKey: 'actions',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
  ];

  constructor(
    private injector: Injector,
    private eventService: EventService,
    public commonDateTimeService: CommonDateTimeService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.setDisplayedColumnsForModuleForm();
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateRoomsDataSource();
  }

  setDisplayedColumnsForModuleForm(): void {
    if (this.isModuleForm) {
      this.displayedColumns = [
        {
          colDef: 'name',
          colTitleLocKey: 'creatingEventRoomsTableNameCol',
          modelPropertyPath: ['room', 'name'],
        },
        {
          colDef: 'startDate',
          colTitleLocKey: 'moduleStartTimeColTable',
          colGetValueFunc: this.getStartTime,
        },
        {
          colDef: 'endDate',
          colTitleLocKey: 'moduleEndTimeColTable',
          colGetValueFunc: this.getEndTime,
        },
        {
          colDef: 'actions',
          colTitleLocKey: 'actions',
          colType: DisplayedColumnTypeEnum.FUNC_COL,
          offFilter: true,
        },
      ];
    }
  }

  openRoomModal(): void {
    const modalRef = this.newModal.open(RoomSelectionModalComponent, {
      data: {
        selectedRooms: this.collectUniqueRoomFromModules().map(rs => rs.room),
        customSaveFunc: this.roomSelectionModalCheck,
        parentComponent: this,
      },
    });
    this.closeModalHandler(modalRef);
  }

  roomSelectionModalCheck = (
    selectedRooms: Array<RoomModel>,
    modalRef: MatDialogRef<CommonModalComponent>,
    self: CreatingEventRoomTableComponent,
  ): void => {
    const equipments: Array<EquipmentModel> = [];

    self.modules?.forEach(module => {
      module.equipments?.forEach(equipment => {
        if (!equipments.includes(equipment)) {
          equipments.push(equipment);
        }
      });
    });

    const validLocations: boolean = this.eventService.checkRoomsEquipmentsLocation(selectedRooms, equipments);

    if (!validLocations) {
      self.showConfirmEquipmentRoomLocationModal(selectedRooms, modalRef, self);
    } else {
      self.confirmSaveCloseEquipmentModal(selectedRooms, modalRef);
    }
  };

  private showConfirmEquipmentRoomLocationModal(
    selectedRooms: Array<RoomModel>,
    modalRef: MatDialogRef<CommonModalComponent>,
    self: CreatingEventRoomTableComponent,
  ): void {
    const confirmMessage: string = self.localization.getLocalTextFromKey(
      'creatingEventRoomsTableInvalidLocationMessage',
    );

    self
      .showConfirmModal(confirmMessage)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          self.confirmSaveCloseEquipmentModal(selectedRooms, modalRef);
        }
      });
  }

  private confirmSaveCloseEquipmentModal(
    selectedRooms: Array<RoomModel>,
    modalRef: MatDialogRef<CommonModalComponent>,
  ): void {
    modalRef.close({
      save: true,
      selectedRooms: selectedRooms,
    });
  }

  getStartTime(roomReservation: RoomReservationModel): string {
    let date = roomReservation.startDate;

    if (date) {
      date = new Date(date);
      const hours = date.getHours().toString().padStart(2, '0'),
        minutes = date.getMinutes().toString().padStart(2, '0');

      return hours + ':' + minutes;
    } else {
      return null;
    }
  }

  getEndTime(roomReservation: RoomReservationModel): string {
    let date = roomReservation.endDate;

    if (date) {
      date = new Date(date);
      const hours = date.getHours().toString().padStart(2, '0'),
        minutes = date.getMinutes().toString().padStart(2, '0');

      return hours + ':' + minutes;
    } else {
      return null;
    }
  }

  changeStartDateRoom(startTime: string, roomReservation: RoomReservationModel): void {
    const copyModule: ModuleModel = JSON.parse(JSON.stringify(this.modules[0]));
    let startTimeArray = startTime.split(':'),
      startDate = new Date();

    if (this.modules[0]?.startDate) {
      startDate = new Date(this.modules[0].startDate);
    }

    this.changeDateTime(startDate, startTimeArray);

    roomReservation.startDate = this.convertDateToLocalDateTime(startDate);
    this.changeModuleTimeByRoomsTime.emit(copyModule);
  }

  changeEndDateRoom(endTime: string, roomReservation: RoomReservationModel): void {
    const copyModule: ModuleModel = this.modules[0];
    let endTimeArray = endTime.split(':'),
      endDate = new Date();

    if (this.modules[0]?.endDate) {
      endDate = new Date(this.modules[0].endDate);
    }

    this.changeDateTime(endDate, endTimeArray);

    roomReservation.endDate = this.convertDateToLocalDateTime(endDate);
    this.changeModuleTimeByRoomsTime.emit(copyModule);
  }

  isInvalidTime(room: RoomReservationModel): boolean {
    const startDate = new Date(room.startDate),
      endDate = new Date(room.endDate);

    return startDate >= endDate;
  }

  convertDateToLocalDateTime(date: Date): string {
    const offset = date.getTimezoneOffset() / 60,
      newHours = date.getHours() - offset;

    date.setHours(newHours);

    return date.toISOString().slice(0, -1);
  }

  changeDateTime(date: Date, timeArray: Array<string>): void {
    date.setHours(Number(timeArray[0]));
    date.setMinutes(Number(timeArray[1]));
  }

  closeModalHandler(modalRef: MatDialogRef<RoomSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data?.save) {
          this.changeRoomsDataSource(data.selectedRooms);
        }
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  changeRoomsDataSource(selectedRooms: Array<RoomModel>): void {
    this.setRoomsToModules(selectedRooms);

    this.changeModuleTimeByRoomsTime.emit();
    this.updateRoomsDataSource();
    this.updateEquipmentsBySelectedRooms?.emit();
  }

  private setRoomsToModules(selectedRooms: Array<RoomModel>): void {
    this.modules.forEach(module => {
      if (!module.roomReservations) {
        module.roomReservations = [];
      }

      const notAllowedRoomReservations: Array<RoomReservationModel> = module.roomReservations.filter(
        roomReservation => {
          return !roomReservation.isAllowed;
        },
      );

      const newRoomReservations: Array<RoomReservationModel> = selectedRooms.map(selectedRoom => {
        let roomReservation: RoomReservationModel = module.roomReservations.find(rs => {
          return rs.room.id === selectedRoom.id;
        });

        if (!roomReservation) {
          roomReservation = {
            id: null,
            room: selectedRoom,
            startDate: module.startDate,
            endDate: module.endDate,
            trainingModule: {
              id: module.id,
              name: module.name,
            },
            isAllowed: true,
          };
        }

        return roomReservation;
      });

      module.roomReservations = [...newRoomReservations, ...notAllowedRoomReservations];
    });
  }

  private collectUniqueRoomFromModules(): Array<RoomReservationModel> {
    const uniqueRooms: Array<RoomReservationModel> = [];

    this.modules.forEach(module => {
      module.roomReservations?.forEach(rs => {
        const i = uniqueRooms.findIndex(uniqueRoom => {
          return uniqueRoom.room.id === rs.room.id;
        });

        if (i <= -1) {
          uniqueRooms.push(rs);
        }
      });
    });

    return uniqueRooms;
  }

  updateRoomsDataSource(): void {
    this.table.commonLoadTableHandler(this.collectUniqueRoomFromModules());
  }

  roomOpenViewModal(roomModel: RoomReservationModel): void {
    this.newModal.open(CreateUpdateRoomModalComponent, {
      data: {
        model: roomModel.room,
        isView: true,
      },
    });
  }

  removeRoomFromList(targetRoom: RoomReservationModel): void {
    this.modules.forEach(module => {
      module.roomReservations = module.roomReservations.filter(rs => {
        return rs.room.id !== targetRoom.room.id;
      });
    });

    this.changeModuleTimeByRoomsTime.emit();
    this.updateRoomsDataSource();
    this.removeEquipmentsByRoom.emit(targetRoom.room.id);
  }
}
