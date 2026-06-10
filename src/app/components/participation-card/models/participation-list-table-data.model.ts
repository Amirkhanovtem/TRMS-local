import { StandardEnumModel } from '@common-models/standard-enum.model';
import { ParticipationModuleModel } from '@participation-card-models/participation-module.model';
import { ParticipationTrainingAndModulesCardModel } from '@participation-card-models/participation-training-and-modules-card.model';

export class ParticipationListTableDataModel {
  public factualStatus: StandardEnumModel = new StandardEnumModel();
  public allTrainingModules: Array<ParticipationModuleModel> = [];
  public allParticipationCards: Array<ParticipationTrainingAndModulesCardModel> = [];
  public trainingWithCertificate: boolean = false;
  public trainingWithExam: boolean = false;
}
