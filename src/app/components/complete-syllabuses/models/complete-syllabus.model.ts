import { StandardEnumModel } from '@common-models/standard-enum.model';

export class CompleteSyllabusModel {
  public id: string = null;
  public name: string = null;
  public category: string = null;
  public trainers: string = null;
  public startDate: Date = null;
  public endDate: Date = null;
  public factualStatus: StandardEnumModel = new StandardEnumModel();
  public author: string = null;
  public trainingCategory: StandardEnumModel = new StandardEnumModel();
  public isEditable: boolean;
}
