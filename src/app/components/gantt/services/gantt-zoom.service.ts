import { Injectable } from '@angular/core';
import { GanttComponent } from '@gantt/gantt.component';
import { GanttViewSelectionModalComponent } from '@gantt-modals-view-selection/gantt-view-selection-modal.component';
import { GanttRangeEnum } from '@gantt-modals-view-selection-models/gantt-range.enum';
import { GanttViewEnum } from '@gantt-modals-view-selection-models/gantt-view.enum';
import { Cit } from 'cit-angular';
// @ts-ignore
import { ZoomLevel } from 'cit-angular/lib/core/cit-core';

@Injectable({
  providedIn: 'root',
})
export class GanttZoomService {
  private readonly DAY_IN_TIME = 1000 * 60 * 60 * 24;

  private static readonly GROUP_BY_CELL = { groupBy: 'Cell', format: 'HH:mm' };
  private static readonly GROUP_BY_DAY = { groupBy: 'Day', format: 'ddd dd' };
  private static readonly GROUP_BY_DAY_ALL = { groupBy: 'Day', format: 'dd MMMM yyyy' };
  private static readonly GROUP_BY_WEEK = { groupBy: 'Week', format: Cit.Date.now().weekNumber() };
  private static readonly GROUP_BY_MONTH = { groupBy: 'Month', format: 'MMMM yyyy' };

  public getDefaultZoom(): string {
    return this.prepareZoomLevelId(
      GanttViewSelectionModalComponent.DEFAULT_RANGE,
      GanttViewSelectionModalComponent.DEFAULT_VIEW,
    );
  }

  public prepareZoomLevelId(ganttRange: string, ganttView: string): string {
    return ganttRange + '-' + ganttView;
  }

  public getZoomIndex(ganttComponent: GanttComponent, id?: string): number {
    const currentZoom = id ? id : ganttComponent.config.zoom;

    if (typeof currentZoom === 'number') {
      return currentZoom;
    }

    const zoomLevels = ganttComponent.scheduler.control.zoomLevels.map(zoomLevel => {
      return zoomLevel.id;
    });

    let zoomIndex = zoomLevels.indexOf(currentZoom);
    if (zoomIndex < 0) {
      zoomIndex = 0;
    }

    return zoomIndex;
  }

  public getShiftDaysCount(ganttComponent: GanttComponent): number {
    const zoomIndex = this.getZoomIndex(ganttComponent);

    switch (zoomIndex) {
      case 0:
      case 1:
        return 1;
      case 2:
      case 3:
        return 7;
      case 4:
      case 5:
        return 14;
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      default:
        return 30;
    }
  }

  public getZoomLevels(ganttComponent: GanttComponent): Array<ZoomLevel> {
    return [
      {
        id: this.prepareZoomLevelId(GanttRangeEnum.DAY, GanttViewEnum.BY_TIME),
        properties: {
          infiniteScrollingEnabled: false,
          cellWidthSpec: 'Auto',
          scale: 'CellDuration',
          cellDuration: ganttComponent.DEFAULT_CELL_DURATION,
          startDate: args => this.calcStartDateByNow(args, ganttComponent),
          days: 1,
          timeHeaders: [GanttZoomService.GROUP_BY_DAY_ALL, GanttZoomService.GROUP_BY_CELL],
        },
      },
      {
        id: this.prepareZoomLevelId(GanttRangeEnum.DAY, GanttViewEnum.BY_DAY),
        properties: {
          infiniteScrollingEnabled: false,
          cellWidthSpec: 'Auto',
          scale: 'Day',
          startDate: args => this.calcStartDateByNow(args, ganttComponent),
          days: 1,
          timeHeaders: [GanttZoomService.GROUP_BY_MONTH, GanttZoomService.GROUP_BY_DAY],
        },
      },
      {
        id: this.prepareZoomLevelId(GanttRangeEnum.WEEK, GanttViewEnum.BY_TIME),
        properties: {
          infiniteScrollingEnabled: false,
          cellWidthSpec: 'Auto',
          scale: 'CellDuration',
          cellDuration: ganttComponent.DEFAULT_CELL_DURATION,
          startDate: args => this.calcStartDateByFirstDayOfWeek(args, ganttComponent),
          days: 7,
          timeHeaders: [
            GanttZoomService.GROUP_BY_MONTH,
            GanttZoomService.GROUP_BY_WEEK,
            GanttZoomService.GROUP_BY_DAY,
            GanttZoomService.GROUP_BY_CELL,
          ],
        },
      },
      {
        id: this.prepareZoomLevelId(GanttRangeEnum.WEEK, GanttViewEnum.BY_DAY),
        properties: {
          infiniteScrollingEnabled: false,
          cellWidthSpec: 'Auto',
          scale: 'Day',
          startDate: args => this.calcStartDateByFirstDayOfWeek(args, ganttComponent),
          days: 7,
          timeHeaders: [GanttZoomService.GROUP_BY_MONTH, GanttZoomService.GROUP_BY_WEEK, GanttZoomService.GROUP_BY_DAY],
        },
      },
      {
        id: this.prepareZoomLevelId(GanttRangeEnum.TWO_WEEKS, GanttViewEnum.BY_TIME),
        properties: {
          infiniteScrollingEnabled: false,
          cellWidthSpec: 'Auto',
          scale: 'CellDuration',
          cellDuration: ganttComponent.DEFAULT_CELL_DURATION,
          startDate: args => this.calcStartDateByFirstDayOfWeek(args, ganttComponent),
          days: 14,
          timeHeaders: [
            GanttZoomService.GROUP_BY_MONTH,
            GanttZoomService.GROUP_BY_WEEK,
            GanttZoomService.GROUP_BY_DAY,
            GanttZoomService.GROUP_BY_CELL,
          ],
        },
      },
      {
        id: this.prepareZoomLevelId(GanttRangeEnum.TWO_WEEKS, GanttViewEnum.BY_DAY),
        properties: {
          infiniteScrollingEnabled: false,
          cellWidthSpec: 'Auto',
          scale: 'Day',
          startDate: args => this.calcStartDateByFirstDayOfWeek(args, ganttComponent),
          days: 14,
          timeHeaders: [GanttZoomService.GROUP_BY_MONTH, GanttZoomService.GROUP_BY_WEEK, GanttZoomService.GROUP_BY_DAY],
        },
      },
      {
        id: this.prepareZoomLevelId(GanttRangeEnum.MONTH, GanttViewEnum.BY_TIME),
        properties: {
          infiniteScrollingEnabled: false,
          cellWidthSpec: 'Auto',
          scale: 'CellDuration',
          cellDuration: ganttComponent.DEFAULT_CELL_DURATION,
          startDate: args => this.calcStartDateByFirstDayOfMonth(args, ganttComponent),
          days: Cit.Date.now().daysInMonth(),
          timeHeaders: [GanttZoomService.GROUP_BY_MONTH, GanttZoomService.GROUP_BY_DAY, GanttZoomService.GROUP_BY_CELL],
        },
      },
      {
        id: this.prepareZoomLevelId(GanttRangeEnum.MONTH, GanttViewEnum.BY_DAY),
        properties: {
          infiniteScrollingEnabled: false,
          cellWidthSpec: 'Auto',
          scale: 'Day',
          cellDuration: ganttComponent.DEFAULT_CELL_DURATION,
          startDate: args => this.calcStartDateByFirstDayOfMonth(args, ganttComponent),
          days: Cit.Date.now().daysInMonth(),
          timeHeaders: [GanttZoomService.GROUP_BY_MONTH, GanttZoomService.GROUP_BY_DAY],
        },
      },
      {
        id: this.prepareZoomLevelId(GanttRangeEnum.RANGE, GanttViewEnum.BY_TIME),
        properties: {
          infiniteScrollingEnabled: false,
          cellWidthSpec: 'Auto',
          scale: 'CellDuration',
          cellDuration: ganttComponent.DEFAULT_CELL_DURATION,
          startDate: args => this.calcStartDateByFirstDayOfMonth(args, ganttComponent),
          days: args => this.calcDaysForRangeZoom(args, ganttComponent),
          timeHeaders: [GanttZoomService.GROUP_BY_MONTH, GanttZoomService.GROUP_BY_DAY, GanttZoomService.GROUP_BY_CELL],
        },
      },
      {
        id: this.prepareZoomLevelId(GanttRangeEnum.RANGE, GanttViewEnum.BY_DAY),
        properties: {
          infiniteScrollingEnabled: false,
          cellWidthSpec: 'Auto',
          scale: 'Day',
          startDate: args => this.calcStartDateByFirstDayOfMonth(args, ganttComponent),
          days: args => this.calcDaysForRangeZoom(args, ganttComponent),
          timeHeaders: [GanttZoomService.GROUP_BY_MONTH, GanttZoomService.GROUP_BY_DAY],
        },
      },
      {
        id: this.prepareZoomLevelId(GanttRangeEnum.INFINITE, GanttViewEnum.BY_TIME),
        properties: {
          infiniteScrollingEnabled: true,
          cellWidthSpec: null,
          scale: 'CellDuration',
          cellDuration: ganttComponent.DEFAULT_CELL_DURATION,
          days: 150,
          timeHeaders: [GanttZoomService.GROUP_BY_MONTH, GanttZoomService.GROUP_BY_DAY, GanttZoomService.GROUP_BY_CELL],
        },
      },
      {
        id: this.prepareZoomLevelId(GanttRangeEnum.INFINITE, GanttViewEnum.BY_DAY),
        properties: {
          infiniteScrollingEnabled: true,
          cellWidthSpec: null,
          cellWidth: 100,
          scale: 'Day',
          days: 150,
          timeHeaders: [GanttZoomService.GROUP_BY_MONTH, GanttZoomService.GROUP_BY_DAY],
        },
      },
    ];
  }

  private calcStartDateByNow(args: any, ganttComponent: GanttComponent): Cit.Date {
    return ganttComponent.ganttViewRangeService.ganttViewRangeData?.startDate
      ? ganttComponent.ganttViewRangeService.ganttViewRangeData.startDate
      : Cit.Date.now();
  }

  private calcStartDateByFirstDayOfWeek(args: any, ganttComponent: GanttComponent): Cit.Date {
    return ganttComponent.ganttViewRangeService.ganttViewRangeData?.startDate
      ? ganttComponent.ganttViewRangeService.ganttViewRangeData.startDate
      : Cit.Date.now().firstDayOfWeek();
  }

  private calcStartDateByFirstDayOfMonth(args: any, ganttComponent: GanttComponent): Cit.Date {
    return ganttComponent.ganttViewRangeService.ganttViewRangeData?.startDate
      ? ganttComponent.ganttViewRangeService.ganttViewRangeData.startDate
      : Cit.Date.now().firstDayOfMonth();
  }

  private calcEndDateByFirstDayOfMonth(args: any, ganttComponent: GanttComponent): Cit.Date {
    return ganttComponent.ganttViewRangeService.ganttViewRangeData?.endDate
      ? ganttComponent.ganttViewRangeService.ganttViewRangeData.endDate
      : Cit.Date.now().lastDayOfMonth();
  }

  private calcDaysForRangeZoom(args: any, ganttComponent: GanttComponent): number {
    const startDate = this.calcStartDateByFirstDayOfMonth(args, ganttComponent),
      endDate = this.calcEndDateByFirstDayOfMonth(args, ganttComponent);

    const days = (endDate.getTime() - startDate.getTime()) / this.DAY_IN_TIME + 1;

    return days > 0 ? days : Cit.Date.now().daysInMonth();
  }
}
