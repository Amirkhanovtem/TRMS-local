import { StandardEnumModel } from '@common-models/standard-enum.model';

export class ExamTemplateModel {
  public id: string = null;
  public name: string = null;
  public description: string = null;
  public type: StandardEnumModel = null;
  public code: string = null;
  public passingScore: number = 0;
  public triesCount: number = 0;
  public maxScore: number = 0;
  public scoreType: StandardEnumModel = null;
}
