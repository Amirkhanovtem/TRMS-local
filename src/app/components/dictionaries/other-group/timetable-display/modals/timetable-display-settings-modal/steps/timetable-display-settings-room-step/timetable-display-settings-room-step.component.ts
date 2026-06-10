import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { TimetableDisplaySettingsModalComponent } from '@components/dictionaries/other-group/timetable-display/modals/timetable-display-settings-modal/timetable-display-settings-modal.component';
import { TimetableDisplayRoomModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display-room.model';
import { RoomSelectionModalComponent } from '@room-modals-selection/room-selection-modal.component';
import { RoomModel } from '@room-models/room.model';

@Component({
  selector: 'app-timetable-display-settings-room-step',
  templateUrl: './timetable-display-settings-room-step.component.html',
  styleUrls: ['./timetable-display-settings-room-step.component.scss'],
  standalone: false,
})
export class TimetableDisplaySettingsRoomStepComponent extends CommonComponent {
  @Input() parent: TimetableDisplaySettingsModalComponent;

  public getSortedTimetableDisplayRooms(): Array<TimetableDisplayRoomModel> {
    return this.getTimetableDisplayRooms().sort((dr1, dr2) => dr1.orderNumber - dr2.orderNumber);
  }

  private getTimetableDisplayRooms(): Array<TimetableDisplayRoomModel> {
    return this.parent?.timetableDisplaySettings.timetableDisplayRoomSettings?.timetableDisplayRooms ?? [];
  }

  private setTimetableDisplayRooms(timetableDisplayRooms: Array<TimetableDisplayRoomModel>): void {
    this.parent.timetableDisplaySettings.timetableDisplayRoomSettings.timetableDisplayRooms = timetableDisplayRooms;
  }

  public drop(event: CdkDragDrop<Array<string>>) {
    moveItemInArray(this.getTimetableDisplayRooms(), event.previousIndex, event.currentIndex);
    this.parent.dragOrderService.setOrderBySorting(this.getTimetableDisplayRooms());
  }

  public openRoomSelectionModal($event: MouseEvent): void {
    $event.stopPropagation();
    const selectedRooms: Array<RoomModel> = this.getTimetableDisplayRooms().map(displayRoom => displayRoom.room);

    const modalRef = this.newModal.open(RoomSelectionModalComponent, {
      data: {
        selectedRooms: selectedRooms,
      },
    });

    this.roomSelectionModalCloseHandler(modalRef);
  }

  public roomSelectionModalCloseHandler(modalRef: MatDialogRef<RoomSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (!data.save) {
          return;
        }

        this.updateTimetableDisplayRoomsBySelectedRooms(data.selectedRooms);
      },
    });
  }

  public updateTimetableDisplayRoomsBySelectedRooms(selectedRooms: Array<RoomModel>): void {
    let timetableDisplayRooms: Array<TimetableDisplayRoomModel> = this.getTimetableDisplayRooms();

    timetableDisplayRooms = timetableDisplayRooms.filter(displayRoom => {
      const roomIndex: number = selectedRooms.findIndex(room => room.id === displayRoom.room.id),
        roomFounded: boolean = roomIndex > -1;

      if (roomFounded) {
        selectedRooms.splice(roomIndex, 1);
      }

      return roomFounded;
    });

    selectedRooms.forEach(room => {
      const timetableDisplayRoom: TimetableDisplayRoomModel = new TimetableDisplayRoomModel();
      timetableDisplayRoom.room = room;
      timetableDisplayRooms.push(timetableDisplayRoom);
    });

    const orderedDisplayRooms: Array<TimetableDisplayRoomModel> =
      this.parent.dragOrderService.processSettingOrder(timetableDisplayRooms);

    this.setTimetableDisplayRooms(orderedDisplayRooms);
  }
}
