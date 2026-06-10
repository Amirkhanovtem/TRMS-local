import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { TrainingModel } from '@event-training-models/training.model';

export class TrainingSelfEnrollmentSettingsModel extends StandardNameIdModel {
  public training: TrainingModel;
  public isEnabled: boolean = false;
  public registrationLimit: number = 0;

  public checkValid(): boolean {
    return !this.isEnabled || this.validLimit();
  }

  private validLimit(): boolean {
    const min: number = 0,
      max: number = 999;

    return min <= this.registrationLimit && this.registrationLimit <= max;
  }
}
