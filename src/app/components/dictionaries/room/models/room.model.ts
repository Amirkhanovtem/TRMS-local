import { StandardEnumModel } from '@common-models/standard-enum.model';
import { EquipmentModel } from '@equipment-models/equipment.model';
import { LocationModel } from '@location-models/location.model';

export class RoomModel {
  public id: string = '';
  public name: string = '';
  public description: string = '';
  public capacity: number = 0;
  public equipment: Array<EquipmentModel> = [];
  public quadrature: number = 0;
  public status: StandardEnumModel = null;
  public location: LocationModel = new LocationModel();
}
