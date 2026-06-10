import { TrainingCategoryModel } from '@training-category-models/training-category.model';

export class AttendantCompletedTrainingModel {
  public id: string | null = null;
  public name: string | null = null;
  public trainingCategory: TrainingCategoryModel | null = new TrainingCategoryModel();
  public startDate: Date | null = null;
  public endDate: Date | null = null;
}
