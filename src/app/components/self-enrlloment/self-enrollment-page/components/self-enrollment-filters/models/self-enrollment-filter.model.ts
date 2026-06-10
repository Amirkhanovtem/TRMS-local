import moment, { Moment } from 'moment';

export class SelfEnrollmentFilterModel {
  public trainingTemplateIds: Array<string> = [];
  public cityIds: Array<string> = [];
  public startDate: Moment = moment();
  public endDate: Moment = moment().add(30, 'days');
}
