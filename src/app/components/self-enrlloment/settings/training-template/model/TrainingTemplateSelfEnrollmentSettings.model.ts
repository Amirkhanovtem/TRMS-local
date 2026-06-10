import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class TrainingTemplateSelfEnrollmentSettingsModel extends StandardNameIdModel {
  public training: StandardNameIdModel;
  public isEnabledOpenSelfEnrollment: boolean = false;
  public defaultRegistrationLimit: number = 0;
}
