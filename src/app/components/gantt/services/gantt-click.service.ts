import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CreatingNewEventModalComponent } from '@event-modals-create/creating-new-event-modal.component';
import { CreateUpdateSyllabusModalComponent } from '@event-syllabus-modals-create-update/create-update-syllabus-modal.component';
import { CreateUpdateTrainingModalComponent } from '@event-training-modals-create-update/create-update-training-modal.component';
import { GanttComponent } from '@gantt/gantt.component';
import { GanttViewEnum } from '@gantt-modals-view-selection-models/gantt-view.enum';
import { EventParentTypeEnum } from '@gantt-models/event-parent-type.enum';
import { SelectedCellModel } from '@gantt-models/selected-cell.model';
import { GanttUtilService } from '@gantt-services/gantt-util.service';
import { Cit } from 'cit-angular';
import EventData = Cit.EventData;
import { ComponentType } from '@angular/cdk/overlay';
import { CreateUpdateEquipmentModalComponent } from '@equipment-modals-create-update/create-update-equipment-modal.component';
import { ParentEventModel } from '@event-models/parent-event.model';
import { GanttResourceGroupType } from '@gantt-models/gantt-resource-group-type.model';
import { GanttMovedModuleModel } from '@gantt-models/move-events/gantt-moved-module.model';
import { CreateUpdateRoomModalComponent } from '@room-modals-create-update/create-update-room-modal.component';
import { CreateUpdateTrainerModalComponent } from '@trainer-modals-create-update/create-update-trainer-modal.component';

type ParentEventModalComponentType = CreateUpdateSyllabusModalComponent | CreateUpdateTrainingModalComponent;

@Injectable({
  providedIn: 'root',
})
export class GanttClickService {
  public ganttComponent: GanttComponent;

  constructor(public ganttUtilService: GanttUtilService) {}

  eventClickHandler(args: Cit.SchedulerEventClickedArgs): void {
    const scheduler: Cit.Scheduler = args.control,
      clickedEvent: Cit.Event = args.e;

    scheduler.clearSelection();

    if (args.ctrl) {
      this.changeSingleEventSelect(clickedEvent);
    } else {
      this.changeSelectByParentEvent(clickedEvent);
    }
  }

  private changeSingleEventSelect(clickedEvent: Cit.Event): void {
    const scheduler: Cit.Scheduler = this.ganttComponent.scheduler.control,
      multiselect = scheduler.multiselect,
      isEventSelected: boolean = multiselect.isSelected(clickedEvent),
      clickedEventParentEventId: string = clickedEvent.data.eventParent.id,
      selectedEventParentId: string = multiselect.events()[0]?.data.eventParent.id,
      allEventsByModuleId: Array<Cit.Event> = scheduler.events
        .all()
        .filter(event => event.data.moduleId === clickedEvent.data.moduleId);

    allEventsByModuleId.forEach(targetEvent => {
      if (isEventSelected) {
        multiselect.remove(targetEvent);
      } else if (!selectedEventParentId || selectedEventParentId === clickedEventParentEventId) {
        this.ganttUtilService.addEventsInMultiSelect(this.ganttComponent.scheduler, targetEvent);
      }
    });
  }

  private changeSelectByParentEvent(clickedEvent: Cit.Event): void {
    const scheduler: Cit.Scheduler = this.ganttComponent.scheduler.control,
      multiselect = scheduler.multiselect,
      isEventSelected: boolean = multiselect.isSelected(clickedEvent),
      clickedEventParentEventId: string = clickedEvent.data.eventParent.id;

    multiselect.clear();

    if (!isEventSelected) {
      scheduler.events
        .all()
        .filter(event => event.data.eventParent.id === clickedEventParentEventId)
        .forEach(event => this.ganttUtilService.addEventsInMultiSelect(this.ganttComponent.scheduler, event));
    }
  }

  openCreateEventModal(args: Cit.SchedulerTimeRangeDoubleClickedArgs): void {
    if (!this.ganttComponent.currentUserCanCreateEvent()) {
      return;
    }

    let selectedCell: SelectedCellModel = this.getSelectedCell(),
      startDate = this.prepareStartDateByGanttViewAndWorkTime(selectedCell?.startDate);

    if (args) {
      if (!this.ganttUtilService.isRowGroupHeader(args.resource.toString(), this.ganttComponent.scheduler)) {
        startDate = this.prepareStartDateByGanttViewAndWorkTime(args.start);
      } else {
        return;
      }
    }

    const openCreateModalCallback = () => {
      const modalRef = this.ganttComponent.newModal.open(CreatingNewEventModalComponent);
      this.closeCreateEventModalHandler(startDate, modalRef, selectedCell);
    };

    const isHoliday = this.ganttUtilService.isHoliday(startDate, this.ganttComponent),
      isNotWorkTime = this.ganttUtilService.isNotWorkTime(startDate, this.ganttComponent.scheduler);

    if (startDate && (isHoliday || isNotWorkTime)) {
      const modalRef = this.ganttComponent.showConfirmModal(
        this.ganttComponent.localization.getLocalTextFromKey('ganttCreateEventOnHolidayOrNotWorkTimeConfirmMessage'),
      );

      modalRef.afterClosed().subscribe({
        next: data => {
          if (data) {
            openCreateModalCallback();
          }
        },
        error: e => {
          this.ganttComponent.errorResponseHandler(e);
        },
      });
    } else {
      openCreateModalCallback();
    }
  }

  public prepareStartDateByGanttViewAndWorkTime(startDate: Cit.Date): Cit.Date {
    if (startDate) {
      const ganttView = this.ganttComponent.ganttViewRangeService.ganttViewRangeData.ganttView.id;

      if (ganttView === GanttViewEnum.BY_TIME) {
        return startDate;
      }

      return startDate.getDatePart().addHours(this.ganttComponent.config.businessBeginsHour);
    }

    return Cit.Date.today().addHours(this.ganttComponent.config.businessBeginsHour);
  }

  private closeCreateEventModalHandler(
    startDate: Cit.Date,
    modalRef: MatDialogRef<CreatingNewEventModalComponent>,
    selectedCell?: SelectedCellModel,
  ): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.openEventParentCreateModal(data, startDate, selectedCell);
        }
      },
      error: e => {
        this.ganttComponent.errorResponseHandler(e);
      },
    });
  }

  public openEventParentCreateModal(data: any, startDate: Cit.Date, selectedCell?: SelectedCellModel): void {
    const modalComponent: ComponentType<ParentEventModalComponentType> = this.getModalComponentByEventType(
      data.eventType.toUpperCase(),
    );

    if (!modalComponent) {
      return;
    }

    const modalRef: MatDialogRef<ParentEventModalComponentType> = this.ganttComponent.newModal.open(modalComponent, {
      data: {
        model: data.model,
        startDate: startDate,
        isCreate: true,
        resourceId: selectedCell?.resourceId,
        groupId: selectedCell?.groupId,
      },
    });

    this.closeCreateUpdateEventHandler(modalRef);
  }

  public openTrainingModalBySessionCode(trainingSessionCode: string): void {
    this.ganttComponent.ganttLoadService.loadEventParentByTrainingSessionCode(
      trainingSessionCode,
      this.loadParentEventBySessionCodeHandler,
    );
  }

  private loadParentEventBySessionCodeHandler: (eventParent: ParentEventModel) => void = eventParent => {
    if (!eventParent) {
      return;
    }

    this.openEventParentEditViewModal(eventParent);
  };

  public openEventParentEditViewModal(
    eventParent: ParentEventModel,
    movedModules?: Array<GanttMovedModuleModel>,
  ): void {
    if (!this.ganttComponent.currentUserCanViewEventModal()) {
      return;
    }

    const eventParentType: string = eventParent.eventParentType?.id,
      isCurrentUserCanEditEvent: boolean = this.ganttComponent.currentUserCanEditEvent(eventParent),
      modalComponent: ComponentType<ParentEventModalComponentType> = this.getModalComponentByEventType(eventParentType);

    if (!modalComponent) {
      return;
    }

    const modalRef: MatDialogRef<ParentEventModalComponentType> = this.ganttComponent.newModal.open(modalComponent, {
      data: {
        model: eventParent,
        isUpdate: isCurrentUserCanEditEvent,
        isView: !isCurrentUserCanEditEvent,
        movedModules: movedModules,
        targetTrainingSessionCode: eventParent.targetTrainingSessionCode,
      },
    });

    this.closeCreateUpdateEventHandler(modalRef);
  }

  private getModalComponentByEventType(eventTypeId: string): ComponentType<ParentEventModalComponentType> {
    switch (eventTypeId) {
      case EventParentTypeEnum.SYLLABUS: {
        return CreateUpdateSyllabusModalComponent;
      }
      case EventParentTypeEnum.TRAINING: {
        return CreateUpdateTrainingModalComponent;
      }
      default: {
        return null;
      }
    }
  }

  private closeCreateUpdateEventHandler(modalRef: MatDialogRef<ParentEventModalComponentType>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.ganttComponent.ganttLoadService.loadEvents();
        }
      },
      error: e => {
        this.ganttComponent.errorResponseHandler(e);
      },
    });
  }

  public triggerResourceWorkload(args): void {
    this.ganttComponent.clearSelection();

    const resourceId = args.row.id;

    if (this.ganttUtilService.isRowGroupHeader(resourceId, this.ganttComponent.scheduler)) {
      return;
    }

    if (this.ganttComponent.resourceIdWorkload !== resourceId) {
      this.ganttComponent.resourceIdWorkload = resourceId;
    } else {
      this.ganttComponent.resourceIdWorkload = null;
      this.ganttComponent.scheduler.control.rows.selection.clear();
    }

    this.ganttComponent.scheduler.control.events.filter(this.ganttComponent.WORKLOAD_EVENT_FILTER_TYPE);
  }

  public openResourceViewModal(args: Cit.SchedulerRowDoubleClickedArgs): void {
    if (!this.ganttComponent.currentUserCanViewResource()) {
      return;
    }

    const data = args.row.data,
      isGroup = data.group;

    if (isGroup) {
      return;
    }

    const groupId = data.groupId;
    let component = null,
      model = new StandardNameIdModel();

    model.id = data.id;

    switch (groupId) {
      case GanttResourceGroupType.ROOM_GROUP:
        component = CreateUpdateRoomModalComponent;
        break;
      case GanttResourceGroupType.EQUIPMENT_GROUP:
        component = CreateUpdateEquipmentModalComponent;
        break;
      case GanttResourceGroupType.TRAINER_GROUP:
        component = CreateUpdateTrainerModalComponent;
        break;
    }

    if (component) {
      this.ganttComponent.newModal.open(component, {
        data: {
          model: model,
          isView: true,
        },
      });
    }
  }

  public getSelectedCell(): SelectedCellModel {
    const selectedCell: SelectedCellModel = new SelectedCellModel(),
      selectedEvents: Array<Cit.Event> = this.ganttComponent.scheduler.control.multiselect.events(),
      selectedTimeRange: Array<Cit.Selection> = this.ganttComponent.scheduler.control.range.all();

    let data;

    if (selectedEvents.length === 1) {
      data = selectedEvents[0].data;
    } else if (selectedTimeRange.length === 1) {
      data = selectedTimeRange[0];
    } else {
      return null;
    }

    selectedCell.resourceId = data.resource.toString();
    selectedCell.groupId = this.ganttUtilService.getGroupByResourceId(data.resource, this.ganttComponent.scheduler);
    selectedCell.startDate = data.start;
    selectedCell.endDate = data.end;
    selectedCell.event = selectedEvents[0];

    return selectedCell;
  }
}
