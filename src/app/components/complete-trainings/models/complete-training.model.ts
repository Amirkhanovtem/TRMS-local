import { StandardEnumModel } from '@common-models/standard-enum.model';
import { ParentEventModel } from '@event-models/parent-event.model';
import { TrainingCategoryModel } from '@training-category-models/training-category.model';

export class CompleteTrainingModel {
  public id: string = null;
  public name: string = null;
  public trainingCategory: TrainingCategoryModel = new TrainingCategoryModel();
  public startDate: Date = null;
  public endDate: Date = null;
  public factualStatus: StandardEnumModel = new StandardEnumModel();
  public parentEvent: ParentEventModel = new ParentEventModel();
}
