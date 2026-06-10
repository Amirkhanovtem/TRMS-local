import { ModuleCardModel } from '@participation-card-models/module-card.model';
import { TrainingCardModel } from '@participation-card-models/training-card.model';

export class ParticipationTrainingAndModulesCardModel {
  public trainingCard: TrainingCardModel = new TrainingCardModel();
  public moduleCards: Array<ModuleCardModel> = [];
}
