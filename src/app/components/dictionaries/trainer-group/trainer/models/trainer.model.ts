import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { PersonModel } from '@person-models/person.model';

export class TrainerModel {
  public id: string = '';
  public person: PersonModel = new PersonModel();
  public trainerCategory: StandardNameIdModel = new StandardNameIdModel();

  public mainTrainingCategories: Array<StandardNameIdModel> = [];
  public linearTrainingCategories: Array<StandardNameIdModel> = [];
  public mainTrainingTemplates: Array<StandardNameIdModel> = [];
  public linearTrainingTemplates: Array<StandardNameIdModel> = [];

  public responsible: boolean = false;
}
