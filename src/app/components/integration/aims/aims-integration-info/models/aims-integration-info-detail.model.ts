import { StandardEnumModel } from '@common-models/standard-enum.model';

export class AimsIntegrationInfoDetailModel {
  public id: string;
  public sessionCode: string;
  public bookingId: string;
  public startDate: Date;
  public endDate: Date;
  public course: string;
  public component: string;
  public employees: string;
  public status: StandardEnumModel = new StandardEnumModel();
  public message: string;
}
