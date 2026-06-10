import { Injectable } from '@angular/core';
import { GanttComponent } from '@gantt/gantt.component';
import { GanttResourceGroupType } from '@gantt-models/gantt-resource-group-type.model';
import { UnavailabilityResourcePeriodModel } from '@unavailability-resources-period-models/unavailability-resource-period.model';
import { Cit, CitSchedulerComponent } from 'cit-angular';
import { Moment } from 'moment';

@Injectable({
  providedIn: 'root',
})
export class GanttUtilService {
  public readonly DEFAULT_CELL_DURATION = 30;
  private readonly CELL_DURATION_OFFSET = this.DEFAULT_CELL_DURATION / 60;

  public isRowGroupHeader(id: string, scheduler: CitSchedulerComponent): boolean {
    return scheduler.control.rows.find(id)?.data?.group;
  }

  public isNotWorkTime(startDate: Cit.Date, scheduler: CitSchedulerComponent): boolean {
    const hours = startDate.getHours(),
      businessBeginsHour = scheduler.config.businessBeginsHour,
      businessEndsHour = scheduler.config.businessEndsHour - this.CELL_DURATION_OFFSET;

    return businessBeginsHour > hours || hours >= businessEndsHour;
  }

  public isHoliday(startDate: Cit.Date, ganttComponent: GanttComponent): boolean {
    const checkStartDate: number = startDate.getDatePart().getTime();

    return ganttComponent.holidays.some(holidayStartDate => {
      return holidayStartDate.getTime() === checkStartDate;
    });
  }

  public getGroupByResourceId(resourceId: string, scheduler: CitSchedulerComponent): GanttResourceGroupType {
    return scheduler.control.rows.find(resourceId)?.data.groupId;
  }

  public addEventsInMultiSelect(scheduler: CitSchedulerComponent, ...events: Array<Cit.Event>): void {
    const multiselect = scheduler.control.multiselect;

    events.forEach(event => {
      if (!multiselect.isSelected(event)) {
        multiselect.add(event);
      }
    });
  }

  public findLoadedUnavailabilityResourceByPeriod(
    resourceId: string,
    targetStartTime: Moment,
    targetEndTime: Moment,
    unavailabilityResourceList: Array<UnavailabilityResourcePeriodModel>,
  ): UnavailabilityResourcePeriodModel {
    return unavailabilityResourceList.find(period => {
      const unavailabilityStartTime: Moment = period.startDate,
        unavailabilityEndTime: Moment = period.endDate,
        checkResource: boolean = period.resource.id === resourceId,
        checkPeriod =
          targetStartTime.isBefore(unavailabilityEndTime) && unavailabilityStartTime.isBefore(targetEndTime);

      return checkResource && checkPeriod;
    });
  }
}
