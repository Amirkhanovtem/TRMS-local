import { StandardEnumModel } from '@common-models/standard-enum.model';

export interface TypedResourceModel {
  id: string;
  name: string;
  type: StandardEnumModel;
}
