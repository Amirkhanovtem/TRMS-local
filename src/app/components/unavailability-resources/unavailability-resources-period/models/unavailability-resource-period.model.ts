import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { UnavailabilityResourcesLabelModel } from '@unavailability-resources-label-models/unavailability-resources-label.model';
import moment, { Moment, MomentInputObject } from 'moment/moment';

export class UnavailabilityResourcePeriodModel {
  public id: string = null;
  public resource: StandardNameIdModel = null;
  public unavailabilityResourceLabel: UnavailabilityResourcesLabelModel = null;
  public startDate: Moment = null;
  public endDate: Moment = null;

  constructor() {
    this.setDefaultPeriod();
  }

  private setDefaultPeriod(): void {
    const timeSettings: MomentInputObject = {
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
      startPeriodHour: number = 8,
      endPeriodHour: number = 17;

    timeSettings.hour = startPeriodHour;
    this.startDate = moment().set(timeSettings);

    timeSettings.hour = endPeriodHour;
    this.endDate = moment().set(timeSettings);
  }
}
