import { SelfEnrollmentEventModel } from '@components/self-enrlloment/self-enrollment-page/components/self-enrollment-events/models/self-enrollment-event.model';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';

export class TrainingSelfEnrollmentModel {
  public trainingTemplate: TrainingTemplateModel;
  public events: Array<SelfEnrollmentEventModel>;
}
