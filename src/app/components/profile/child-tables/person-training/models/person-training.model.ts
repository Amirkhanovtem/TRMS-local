import { StandardEnumModel } from '@common-models/standard-enum.model';

export class PersonTrainingModel {
  public id: string = null;
  public trainingTemplateName: string = null;
  public startDateTraining: Date = null;
  public endDateTraining: Date = null;
  public modules: string = null;
  public trainingFactualStatus: StandardEnumModel = new StandardEnumModel();
  public participantTrainingCardId: string = null;
  public attendanceStatus: StandardEnumModel = new StandardEnumModel();
  public certificate: string = null;
  public expireDateCertificate: Date = null;
  public certificateStatus: StandardEnumModel = new StandardEnumModel();
}
