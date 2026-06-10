import { AttendantCompletedTrainingModel } from '@attended-training-models/attendant-completed-training.model';
import { TrainingCardModel } from '@participation-card-models/training-card.model';
import { PersonModel } from '@person-models/person.model';

export class AttendedTrainingModel {
  public person: PersonModel = new PersonModel();
  public training: AttendantCompletedTrainingModel = new AttendantCompletedTrainingModel();
  public participantTrainingCard: TrainingCardModel = new TrainingCardModel();
}
