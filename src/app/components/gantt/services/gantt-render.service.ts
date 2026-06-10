import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
import { GanttComponent } from '@gantt/gantt.component';
import { SelectionDraftModalComponent } from '@gantt-modals-draft-selection/selection-draft-modal.component';
import { GanttTooltip } from '@gantt-modals-tolltips/gantt.tooltip';
import { GanttResourceGroupType } from '@gantt-models/gantt-resource-group-type.model';
import { GanttUtilService } from '@gantt-services/gantt-util.service';
import { TrainingFactualStatusEnum } from '@participation-card-models/training-factual-status.enum';
import { Cit } from 'cit-angular';
import EventData = Cit.EventData;
import { MatDialogRef } from '@angular/material/dialog';
import { UnavailabilityResourcePeriodModel } from '@unavailability-resources-period-models/unavailability-resource-period.model';
import moment, { Moment } from 'moment';

@Injectable({
  providedIn: 'root',
})
export class GanttRenderService {
  public ganttComponent: GanttComponent;
  public viewContainerRef: ViewContainerRef;

  private readonly COMPLETED_EVENT_CLASS = 'trms_gantt_completed_event';
  private readonly HAS_CORRECTION_CLASS = 'trms_gantt_has_correction';
  private readonly GROUP_ROW_CLASS = 'trms_gantt_group_row';
  private readonly NOT_ALLOWED_EVENT = 'trms_gantt_not_allowed_event';

  constructor(public ganttUtilService: GanttUtilService) {}

  public colorizeResources(args: any): void {
    const row = args.row,
      rowData = row.data;

    if (!rowData || rowData.group) {
      row.html = `<span title="${row.html}">${row.html}</span>`;
    }
  }

  public getGanttHeight(citSchedulerParent: HTMLDivElement): number {
    const offsetBottom: number = 10;

    return window.innerHeight - offsetBottom - citSchedulerParent.offsetTop;
  }

  public colorizeCells(args: any): void {
    const cell = args.cell,
      resourceId = cell.resource;

    const isGroupRow =
      GanttResourceGroupType.ROOM_GROUP === resourceId ||
      GanttResourceGroupType.TRAINER_GROUP === resourceId ||
      GanttResourceGroupType.EQUIPMENT_GROUP === resourceId;

    if (cell.isParent || isGroupRow) {
      cell.properties.cssClass = this.prepareCssClasses(cell.properties.cssClass, this.GROUP_ROW_CLASS);
    } else {
      if (this.ganttUtilService.isHoliday(cell.start, this.ganttComponent)) {
        args.cell.properties.business = false;
      }

      this.addHasCorrectionArea(cell);
      this.colorizeUnavailabilityResource(cell);
    }
  }

  private colorizeUnavailabilityResource(cell): void {
    const cellStartTime: Moment = moment(cell.start.value).utc(true),
      cellEndTime: Moment = moment(cell.end.value).utc(true),
      resourceId: string = cell.resource,
      loadedUnavailabilityResourcePeriods: Array<UnavailabilityResourcePeriodModel> =
        this.ganttComponent.unavailabilityResourcePeriods;

    const unavailabilityResourcePeriod: UnavailabilityResourcePeriodModel =
      this.ganttUtilService.findLoadedUnavailabilityResourceByPeriod(
        resourceId,
        cellStartTime,
        cellEndTime,
        loadedUnavailabilityResourcePeriods,
      );

    if (unavailabilityResourcePeriod) {
      cell.areas = [
        {
          backColor: unavailabilityResourcePeriod.unavailabilityResourceLabel.color,
          right: 0,
          left: 0,
          bottom: 0,
          top: 0,
        },
        {
          backColor: '#ffe599',
          right: 0,
          left: 0,
          text: unavailabilityResourcePeriod.unavailabilityResourceLabel.name,
          style:
            'text-align: center; color: #333; font-size: 14px; overflow:hidden; white-space:nowrap; text-overflow: ellipsis;',
        },
      ];
    }
  }

  private addHasCorrectionArea(cellOrEvent) {
    if (this.ganttComponent.checkedDraft) {
      return;
    }

    const hasCorrection = this.ganttComponent.draftEvents.some(draftEventInfo => {
      return (
        draftEventInfo.resource === cellOrEvent.resource &&
        // @ts-ignore
        Cit.Util.overlaps(draftEventInfo.start, draftEventInfo.end, cellOrEvent.start, cellOrEvent.end)
      );
    });

    if (hasCorrection) {
      cellOrEvent.areas = [
        {
          cssClass: this.HAS_CORRECTION_CLASS,
          onClick: args => {
            this.openDraftListModal(args);
          },
        },
      ];
    }
  }

  openDraftListModal(args): void {
    const resource = args.source.resource,
      cellStartDate = args.source.start,
      cellEndDate = args.source.end;

    const modalRef = this.ganttComponent.newModal.open(SelectionDraftModalComponent, {
      data: {
        draftModules: this.findAllDraftModuleByTimeRangeAndResource(resource, cellStartDate, cellEndDate),
      },
    });

    this.closeSelectionDraftModalComponentHandler(modalRef);
  }

  private closeSelectionDraftModalComponentHandler(modalRef: MatDialogRef<SelectionDraftModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.ganttComponent.ganttClickService.openEventParentEditViewModal(data.event.eventParent);
        }
      },
      error: e => {
        this.ganttComponent.errorResponseHandler(e);
      },
    });
  }

  private findAllDraftModuleByTimeRangeAndResource(resource: string, cellStartDate, cellEndDate): Array<EventData> {
    const targetDraftList: Array<EventData> = [];

    cellStartDate = new Date(cellStartDate);
    cellEndDate = new Date(cellEndDate);

    this.ganttComponent.draftEvents.forEach(draftEventInfo => {
      const hasDraft: boolean =
        draftEventInfo.resource === resource && // @ts-ignore
        cellStartDate <= draftEventInfo.start.toDate() && // @ts-ignore
        draftEventInfo.end.toDate() <= cellEndDate;

      if (hasDraft) {
        targetDraftList.push(draftEventInfo);
      }
    });

    return targetDraftList;
  }

  public markCompletedEvent(args): void {
    if (args.data.trainingFactualStatus.id === TrainingFactualStatusEnum.COMPLETED) {
      args.data.cssClass = this.prepareCssClasses(args.data.cssClass, this.COMPLETED_EVENT_CLASS);
    }
  }

  public markEventByAllowing(args): void {
    if (this.ganttComponent.markerEventsByAllowing && !args.data.eventParent.isEditable) {
      console.log(args);

      args.data.cssClass = this.prepareCssClasses(args.data.cssClass, this.NOT_ALLOWED_EVENT);
    }
  }

  public createGanttEventBubble<C extends GanttTooltip>(componentType: Type<C>): Cit.Bubble {
    return new Cit.Bubble({
      theme: 'trms_gantt_tooltip',
      hideOnClick: true,
      onDomAdd: args => {
        const eventTooltipComponent = this.createTooltipComponent(args.source, componentType);
        args.element = eventTooltipComponent.location.nativeElement;
        (<any>args).component = eventTooltipComponent;
      },
      onDomRemove: args => {
        (<any>args).component.destroy();
      },
    });
  }

  public createGanttResourceBubble<C extends GanttTooltip>(componentType: Type<C>): Cit.Bubble {
    return new Cit.Bubble({
      theme: 'trms_gantt_tooltip',
      hideOnClick: true,
      onLoad: args => {
        args.async = true;

        if (!this.ganttUtilService.isRowGroupHeader(args.source.id, this.ganttComponent.scheduler)) {
          const resourceTooltipComponent = this.createTooltipComponent(args.source, componentType);
          resourceTooltipComponent.location.nativeElement.style.visibility = 'hidden';

          setTimeout(() => {
            args.html = resourceTooltipComponent.location.nativeElement.innerHTML;
            resourceTooltipComponent.destroy();
            args.loaded();
          }, 500);
        }
      },
    });
  }

  private createTooltipComponent<C extends GanttTooltip>(source: any, componentType: Type<C>): ComponentRef<C> {
    const component: ComponentRef<C> = this.viewContainerRef.createComponent(componentType);

    component.instance.source = source;
    component.instance.scheduler = this.ganttComponent.scheduler.control;
    component.changeDetectorRef.detectChanges();

    return component;
  }

  /**
   * Method prepare string of cssClasses
   * @param cssClass is current cssClass string
   * @param className is cssClass, which needs to add or remove
   * @param operation - if true - then class will be added, else - class will be deleted
   * @param delimiter is delimiter for string of classes
   * @return new string of cssClasses (string has 'class1,class2,...' format)
   */
  private prepareCssClasses(
    cssClass: string,
    className: string,
    operation: boolean = true,
    delimiter: string = ' ',
  ): string {
    const classes = cssClass ? cssClass.trim().toLowerCase().split(delimiter) : [];

    const index = classes.indexOf(className);

    if (operation) {
      if (index === -1) {
        classes.push(className);
      }
    } else if (index > -1) {
      classes.splice(index, 1);
    }

    return classes.join(delimiter);
  }

  public createCorner(args: any): void {
    const zoomIndex = this.ganttComponent.ganttZoomService.getZoomIndex(this.ganttComponent);

    switch (zoomIndex) {
      case 0:
        args.html = `
        <div class="trms_gantt_corner_row trms_gantt_corner_date">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerDate')}
        </div>
        <div class="trms_gantt_corner_row trms_gantt_corner_time">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerTime')}
        </div>
        `;
        break;
      case 1:
      case 7:
      case 9:
      case 11:
        args.html = `
        <div class="trms_gantt_corner_row trms_gantt_corner_date">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerDate')}
        </div>
        <div class="trms_gantt_corner_row trms_gantt_corner_day">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerDay')}
        </div>
        `;
        break;
      case 2:
      case 4:
        args.html = `
        <div class="trms_gantt_corner_row trms_gantt_corner_date">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerDate')}
        </div>
        <div class="trms_gantt_corner_row trms_gantt_corner_week">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerWeek')}
        </div>
        <div class="trms_gantt_corner_row trms_gantt_corner_day">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerDay')}
        </div>
        <div class="trms_gantt_corner_row trms_gantt_corner_time">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerTime')}
        </div>
        `;
        break;
      case 3:
      case 5:
        args.html = `
        <div class="trms_gantt_corner_row trms_gantt_corner_date">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerDate')}
        </div>
        <div class="trms_gantt_corner_row trms_gantt_corner_week">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerWeek')}
        </div>
        <div class="trms_gantt_corner_row trms_gantt_corner_day">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerDay')}
        </div>
        `;
        break;
      case 6:
      case 8:
      case 10:
        args.html = `
        <div class="trms_gantt_corner_row trms_gantt_corner_date">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerDate')}
        </div>
        <div class="trms_gantt_corner_row trms_gantt_corner_day">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerDay')}
        </div>
        <div class="trms_gantt_corner_row trms_gantt_corner_time">
          ${this.ganttComponent.localization.getLocalTextFromKey('ganttCornerTime')}
        </div>
        `;
        break;
    }
  }
}
