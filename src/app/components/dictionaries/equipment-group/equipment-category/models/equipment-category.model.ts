import { LocationModel } from '@location-models/location.model';

export class EquipmentCategoryModel {
  public id: string = '';
  public name: string = '';
  public location: LocationModel = new LocationModel();
  public availableCount: number = 0;
  public totalCount: number = 0;
  public selectedCount: number = 0;
}
