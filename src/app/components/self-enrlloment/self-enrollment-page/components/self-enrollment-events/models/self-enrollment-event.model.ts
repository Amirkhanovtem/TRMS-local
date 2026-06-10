import { CityModel } from '@city-models/city.model';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { RoomModel } from '@room-models/room.model';

export class SelfEnrollmentEventModel {
  public eventId: string;
  public startDate: Date;
  public citiesWithRooms: Array<{ city: CityModel; rooms: Array<RoomModel> }>;
  public availableSpots: number;
  public registrationOnEventType: StandardEnumModel;
}
