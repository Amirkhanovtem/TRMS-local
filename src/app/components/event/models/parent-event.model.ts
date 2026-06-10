import { StandardEnumModel } from '@common-models/standard-enum.model';

export class ParentEventModel {
  public id: string = '';
  public name: string = '';
  public eventParentType: StandardEnumModel = new StandardEnumModel();
  public author: string = '';
  public targetTrainingSessionCode: string;
  public isEditable: boolean;
}
