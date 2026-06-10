import { Pipe, PipeTransform } from '@angular/core';
import { RoomModel } from '@room-models/room.model';

@Pipe({
  name: 'roomAddress',
  standalone: false,
})
export class RoomAddressPipe implements PipeTransform {
  transform(room: RoomModel): string {
    return `${room.location.address}, ${room.name}`;
  }
}
