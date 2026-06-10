import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class ParticipantTrainingCardExamModel {
  public id: string = null;
  public exam: StandardNameIdModel = new StandardNameIdModel();
  public finalScore: number = null;
  public isPassed: boolean = false;
  public scoreType: StandardEnumModel = new StandardEnumModel();
}
