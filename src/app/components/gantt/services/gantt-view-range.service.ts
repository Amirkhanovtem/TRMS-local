import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GanttComponent } from '@gantt/gantt.component';
import { GanttViewSelectionModalComponent } from '@gantt-modals-view-selection/gantt-view-selection-modal.component';
import { GanttViewRangeData } from '@gantt-modals-view-selection-models/gantt-view-range-data.model';

@Injectable({
  providedIn: 'root',
})
export class GanttViewRangeService {
  public ganttComponent: GanttComponent;
  public ganttViewRangeData: GanttViewRangeData = new GanttViewRangeData(
    GanttViewSelectionModalComponent.DEFAULT_RANGE,
    GanttViewSelectionModalComponent.DEFAULT_VIEW,
  );

  ganttViewRangeChanged(ganttViewRangeData: GanttViewRangeData): void {
    this.ganttViewRangeData = ganttViewRangeData;

    const zoomLevel = this.ganttComponent.ganttZoomService.prepareZoomLevelId(
        this.ganttViewRangeData.ganttRange.id,
        this.ganttViewRangeData.ganttView.id,
      ),
      zoomIndex = this.ganttComponent.ganttZoomService.getZoomIndex(this.ganttComponent, zoomLevel);

    this.ganttComponent.config.zoom = zoomIndex;

    this.ganttComponent.scheduler.control.update(this.ganttComponent.config);

    if (zoomIndex === 10 || zoomIndex === 11) {
      this.ganttComponent.scheduler.control.scrollTo(ganttViewRangeData.startDate);
    }

    this.ganttComponent.ganttLoadService.loadEvents();
  }

  openGanttViewRangeModal(): void {
    const modalRef = this.ganttComponent.newModal.open(GanttViewSelectionModalComponent, {
      data: {
        ganttViewRangeData: this.ganttViewRangeData,
      },
    });

    this.closeGanttViewRangeModalHandler(modalRef);
  }

  private closeGanttViewRangeModalHandler(modalRef: MatDialogRef<GanttViewSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.ganttViewRangeChanged(data);
        }
      },
      error: e => {
        this.ganttComponent.errorResponseHandler(e);
      },
    });
  }
}
