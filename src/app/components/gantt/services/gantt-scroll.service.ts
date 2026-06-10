import { Injectable } from '@angular/core';
import { GanttComponent } from '@gantt/gantt.component';
import { GanttRangeEnum } from '@gantt-modals-view-selection-models/gantt-range.enum';
import { Cit } from 'cit-angular';
import SchedulerViewPort = Cit.SchedulerViewPort;

@Injectable({
  providedIn: 'root',
})
export class GanttScrollService {
  public ganttComponent: GanttComponent;

  registerScrollHandler(): void {
    const element = document.querySelector('.trms_gantt_scrollable'),
      $self = this;

    let scrollTimeout = null;
    element.addEventListener('scroll', event => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(function () {
        $self.onScrollHandler();
      }, 500);
    });
  }

  onScrollHandler(): void {
    if (
      this.ganttComponent.offAutoRefreshScheduler ||
      this.ganttComponent.ganttViewRangeService.ganttViewRangeData.ganttRange.id !== GanttRangeEnum.INFINITE
    ) {
      return;
    }

    const viewport: SchedulerViewPort = this.ganttComponent.scheduler.control.getViewPort(),
      viewStart: Cit.Date = viewport.start,
      viewEnd: Cit.Date = viewport.end,
      lastStart: Cit.Date = this.ganttComponent.lastStart,
      lastEnd: Cit.Date = this.ganttComponent.lastEnd,
      inBound: boolean = viewStart > lastStart && viewStart < lastEnd && viewEnd > lastStart && viewEnd < lastEnd;

    if (inBound) {
      return;
    }

    this.ganttComponent.ganttLoadService.loadEvents();
  }

  scrollToDate(date?: Cit.Date): void {
    const scrollToDate = date ? date : Cit.Date.now(),
      zoomIndex = this.ganttComponent.ganttZoomService.getZoomIndex(this.ganttComponent),
      scheduler: Cit.Scheduler = this.ganttComponent.scheduler.control;

    if (zoomIndex == 10 || zoomIndex == 11) {
      scheduler.scrollTo(scrollToDate);
    } else if (scrollToDate < scheduler.visibleStart() || scrollToDate > scheduler.visibleEnd()) {
      scheduler.startDate = scrollToDate;
      scheduler.update();
    } else {
      scheduler.scrollTo(scrollToDate);
    }
  }
}
