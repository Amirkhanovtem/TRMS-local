import { StandardEnumModel } from '@common-models/standard-enum.model';
import { ParticipationTrainingAndModulesCardModel } from '@participation-card-models/participation-training-and-modules-card.model';

export class ParticipationDataUpdateResponseModel {
  public trainingId: string = null;
  public factualStatus: StandardEnumModel = new StandardEnumModel();
  public dtos: Array<ParticipationTrainingAndModulesCardModel> = [];
}
