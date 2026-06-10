import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { RoomModel } from '@room-models/room.model';

export class RoomReservationModel {
  public id: string;
  public startDate;
  public endDate;
  public room: RoomModel;
  public trainingModule: StandardNameIdModel;
  public isAllowed: boolean;
}
