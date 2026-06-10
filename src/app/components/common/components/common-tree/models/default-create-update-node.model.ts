import { StandardNameIdModel } from '@common-models/standard-name-id.model';

export class DefaultCreateUpdateNodeModel {
  public id: string = null;
  public code: string = null;
  public name: string = null;
  public nameRu: string = null;
  public nameEn: string = null;
  public nameKz: string = null;
  public parent: StandardNameIdModel = null;
}
