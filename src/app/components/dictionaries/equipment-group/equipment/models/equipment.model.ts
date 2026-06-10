import { StandardEnumModel } from '@common-models/standard-enum.model';
import { EquipmentCategoryModel } from '@equipment-category-models/equipment-category.model';
import { RoomModel } from '@room-models/room.model';

export class EquipmentModel {
  public id: string = '';
  public name: string = '';
  public type: StandardEnumModel = new StandardEnumModel();
  public quantity: number = 0;
  public room: RoomModel = null;
  public status: StandardEnumModel = null;
  public code: string = null;
  public description: string = null;
  public equipmentCategory: EquipmentCategoryModel = null;
}
