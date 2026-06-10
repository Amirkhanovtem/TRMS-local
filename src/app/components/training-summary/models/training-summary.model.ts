import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { PersonModel } from '@person-models/person.model';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';

export class TrainingSummaryModel {
  public person: PersonModel;
  public trainingTemplate: TrainingTemplateModel;
  public startDateTraining: Date = null;
  public endDateTraining: Date = null;
  public trainingFactualStatus: StandardEnumModel = new StandardEnumModel();
  public participantTrainingCardId: string;
  public attendanceStatus: StandardEnumModel = new StandardEnumModel();
  public fileStorageCertificate: StandardFileStorageModel = null;
  public expireDateCertificate: Date = null;
  public modules: string = null;
}
