import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';

export class SyllabusTemplateModel {
  public id: string = null;
  public name: string = '';
  public description: string = '';
  public code: string = '';
  public trainingTemplates: Array<TrainingTemplateModel> = [];
  public moduleCount: number = 0;
  public trainingCategory: StandardNameIdModel = null;

  checkSyllabusTemplateHasTraining(): boolean {
    return this.trainingTemplates.length > 0;
  }

  checkSyllabusTemplateTrainingHasMinMaxBreak(): boolean {
    return !this.trainingTemplates.find(trainingTemplate => {
      const minBreakTraining = trainingTemplate.minBreakTraining,
        maxBreakTraining = trainingTemplate.maxBreakTraining;

      return !Number.isInteger(minBreakTraining) || !Number.isInteger(maxBreakTraining);
    });
  }
}
