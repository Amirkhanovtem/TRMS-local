import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class UnavailabilityResourcesLabelModel extends StandardNameIdModel {
  public groupResource: StandardEnumModel = null;
  public color: string = '#f25f5f';
}
