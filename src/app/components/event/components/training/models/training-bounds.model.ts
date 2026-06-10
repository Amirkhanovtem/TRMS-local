export class TrainingBoundsModel {
  public trainingTemplateId: string = null;
  public startDate: Date = null;
  public endDate: Date = null;

  constructor(trainingTemplateId: string, startDate: Date, endDate: Date) {
    this.trainingTemplateId = trainingTemplateId;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
