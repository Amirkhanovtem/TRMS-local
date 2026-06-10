import { Injectable } from '@angular/core';
import { GanttComponent } from '@gantt/gantt.component';
import { GanttFilterService } from '@gantt-modals-filter-selection-services/gantt-filter.service';
import { GanttRangeEnum } from '@gantt-modals-view-selection-models/gantt-range.enum';
import { GanttService } from '@gantt-services/gantt.service';
import { HolidayService } from '@holiday-services/holiday.service';
import { UnavailabilityResourcesPeriodService } from '@unavailability-resources-period-services/unavailability-resources-period.service';
import { Cit } from 'cit-angular';
import moment from 'moment';
import SchedulerViewPort = Cit.SchedulerViewPort;
import { ParentEventModel } from '@event-models/parent-event.model';

@Injectable({
  providedIn: 'root',
})
export class GanttLoadService {
  public ganttComponent: GanttComponent;
  private readonly fallbackResources = [
    {
      id: 'ROOM_GROUP',
      name: 'Rooms',
      expanded: true,
      group: true,
      groupId: 'ROOM_GROUP',
      children: [
        { id: '901', name: '901', groupId: 'ROOM_GROUP' },
        { id: '904', name: '904', groupId: 'ROOM_GROUP' },
        { id: 'Conference room', name: 'Conference room', groupId: 'ROOM_GROUP' },
        { id: 'Astana room 201', name: 'Astana room 201', groupId: 'ROOM_GROUP' },
        { id: 'Astana room 304', name: 'Astana room 304', groupId: 'ROOM_GROUP' },
        { id: 'MS Teams / LMS', name: 'MS Teams / LMS', groupId: 'ROOM_GROUP' },
      ],
    },
    {
      id: 'TRAINER_GROUP',
      name: 'Trainers',
      expanded: true,
      group: true,
      groupId: 'TRAINER_GROUP',
      children: [
        { id: 'Internal trainer A', name: 'Internal trainer A', groupId: 'TRAINER_GROUP' },
        { id: 'Internal trainer B', name: 'Internal trainer B', groupId: 'TRAINER_GROUP' },
        { id: 'Certified trainer', name: 'Certified trainer', groupId: 'TRAINER_GROUP' },
      ],
    },
    {
      id: 'EQUIPMENT_GROUP',
      name: 'Equipment',
      expanded: true,
      group: true,
      groupId: 'EQUIPMENT_GROUP',
      children: [
        { id: 'Projector + laptops', name: 'Projector + laptops', groupId: 'EQUIPMENT_GROUP' },
        { id: 'Laptops', name: 'Laptops', groupId: 'EQUIPMENT_GROUP' },
      ],
    },
  ] as Array<Cit.ResourceData>;

  constructor(
    private ganttFilterService: GanttFilterService,
    private holidayService: HolidayService,
    private ganttService: GanttService,
    private unavailabilityResourcesPeriodService: UnavailabilityResourcesPeriodService,
  ) {}

  public afterViewInitLoad(): void {
    this.loadUserSelectedRange();
    this.loadBusinessLogic();
    this.loadHolidays();
    this.loadResources();
  }

  private loadUnavailabilityResourcePeriods(start?: Cit.Date, end?: Cit.Date): void {
    this.unavailabilityResourcesPeriodService.listByPeriod(start, end).subscribe({
      next: data => {
        data.forEach(unavailabilityResourcePeriod => {
          unavailabilityResourcePeriod.startDate = moment(unavailabilityResourcePeriod.startDate).utc(true);
          unavailabilityResourcePeriod.endDate = moment(unavailabilityResourcePeriod.endDate).utc(true);
        });
        this.ganttComponent.unavailabilityResourcePeriods = data;
      },
      error: e => {
        this.ganttComponent.unavailabilityResourcePeriods = [];
      },
    });
  }

  public loadEventParentByTrainingSessionCode(
    trainingSessionCode: string,
    loadParentEventHandler: (parentEvent: ParentEventModel) => void,
  ): void {
    this.ganttService.getParentEventInfoByTrainingSessionCode(trainingSessionCode).subscribe({
      next: (parentEvent: ParentEventModel) => {
        loadParentEventHandler(parentEvent);
      },
      error: e => {
        this.ganttComponent.ganttViewRangeService.ganttViewRangeChanged(
          this.ganttComponent.ganttViewRangeService.ganttViewRangeData,
        );
      },
    });
  }

  private loadUserSelectedRange(): void {
    this.ganttFilterService.selectedRange().subscribe({
      next: data => {
        if (data) {
          data.startDate = Cit.Date.now();
          this.ganttComponent.ganttViewRangeService.ganttViewRangeChanged(data);
        }
      },
      error: e => {
        this.ganttComponent.ganttViewRangeService.ganttViewRangeChanged(
          this.ganttComponent.ganttViewRangeService.ganttViewRangeData,
        );
      },
    });
  }

  private loadBusinessLogic(): void {
    this.holidayService.getBusinessLogic().subscribe({
      next: data => {
        this.ganttComponent.scheduler.config.businessBeginsHour = data.businessBeginsHour;
        this.ganttComponent.scheduler.config.businessEndsHour =
          data.businessEndsHour + this.ganttComponent.CELL_DURATION_OFFSET;
      },
      error: e => {
        this.ganttComponent.scheduler.config.businessBeginsHour = 8;
        this.ganttComponent.scheduler.config.businessEndsHour = 18 + this.ganttComponent.CELL_DURATION_OFFSET;
      },
    });
  }

  private loadHolidays(): void {
    this.holidayService.getHolidaysAsCitDate().subscribe({
      next: data => {
        this.ganttComponent.holidays = data;
      },
      error: e => {
        this.ganttComponent.holidays = [];
      },
    });
  }

  public loadResources(callback?): void {
    this.ganttService.getResources().subscribe({
      next: data => {
        this.ganttComponent.config.resources = data;
        this.ganttComponent.scheduler?.control?.update(this.ganttComponent.config);

        if (callback) {
          callback();
        }
      },
      error: e => {
        this.ganttComponent.config.resources = this.fallbackResources;
        this.ganttComponent.scheduler?.control?.update(this.ganttComponent.config);

        if (callback) {
          callback();
        }
      },
    });
  }

  /**
   * Method load events only
   * @param args - from scrollEvent
   */
  loadEvents(): void {
    const schedulerControl: Cit.Scheduler = this.ganttComponent.scheduler.control,
      viewPort: SchedulerViewPort = schedulerControl.getViewPort();

    schedulerControl.loadingStart();

    let start, end;

    if (this.ganttComponent.ganttViewRangeService.ganttViewRangeData.ganttRange.id === GanttRangeEnum.INFINITE) {
      start = viewPort.start.addMonths(-1);
      end = viewPort.end.addMonths(3);
    } else {
      start = schedulerControl.visibleStart();
      end = schedulerControl.visibleEnd();
    }

    const setEventsCallback = () => {
      this.setEvents();
    };

    const plannedEventCallback = () => {
      this.loadPlannedEvents(setEventsCallback, start, end);
    };

    this.ganttComponent.lastStart = start;
    this.ganttComponent.lastEnd = end;
    this.loadDraftEvents(plannedEventCallback, start, end);
    this.loadUnavailabilityResourcePeriods(start, end);
    this.ganttComponent.ganttMoveEventService.clearMovedEvents();
  }

  private loadPlannedEvents(callback, start?: Cit.Date, end?: Cit.Date): void {
    this.ganttService.getPlannedEvents(start, end).subscribe({
      next: data => {
        this.ganttComponent.plannedEvents = data;

        if (callback) {
          callback();
        }
      },
      error: e => {
        this.ganttComponent.plannedEvents = [];

        if (callback) {
          callback();
        }
      },
    });
  }

  private loadDraftEvents(callback, start?: Cit.Date, end?: Cit.Date): void {
    this.ganttService.getDraftEvents(start, end).subscribe({
      next: data => {
        this.ganttComponent.draftEvents = data;

        if (callback) {
          callback();
        }
      },
      error: e => {
        this.ganttComponent.draftEvents = [];

        if (callback) {
          callback();
        }
      },
    });
  }

  public setEvents(): void {
    let events;

    if (this.ganttComponent.checkedDraft) {
      events = this.ganttComponent.draftEvents;
    } else {
      events = this.ganttComponent.plannedEvents;
    }

    events = [...events, ...this.ganttComponent.getPrototypePlannerEvents()];

    this.ganttComponent.scheduler.control.events.list = events;

    this.ganttComponent.scheduler.control.update();
    this.ganttComponent.scheduler.control.events.filter(this.ganttComponent.WORKLOAD_EVENT_FILTER_TYPE);
    this.ganttComponent.scheduler.control.loadingStop();
  }
}
