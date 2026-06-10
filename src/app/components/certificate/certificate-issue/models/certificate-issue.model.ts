import { certificateActivityStatusByExpireDateEnum } from '@certificate-issue-models/certificate-activity-status-by-expire-date-enum.model.enum';
import { TrainingCardModel } from '@participation-card-models/training-card.model';

export class CertificateIssueModel {
  public id: string | null = null;
  public serialNumber: string | null = null;
  public name: string | null = null;
  public trainingName: string | null = null;
  public firstName: string | null = null;
  public lastName: string | null = null;
  public patronymic: string | null = null;
  public dateOfIssue: Date | null = null;
  public dateOfExpire: Date | null = null;
  public dateOfDelete: Date | null = null;
  public participantTrainingCard: TrainingCardModel | null = new TrainingCardModel();
  public certificateActivityStatusByExpireDate: certificateActivityStatusByExpireDateEnum | null = null;
}
