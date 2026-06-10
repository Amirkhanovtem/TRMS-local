import { StandardEnumModel } from '@common-models/standard-enum.model';

export interface UpdateResourceTagModel {
  tagId: string;
  type: StandardEnumModel;
  resourceId: string;
}
