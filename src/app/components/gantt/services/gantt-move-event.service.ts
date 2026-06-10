import { Injectable } from '@angular/core';
import { LearningRequestPrototypeService } from '@components/learning-requests-prototype/learning-request-prototype.service';
import { ParentEventModel } from '@event-models/parent-event.model';
import { GanttComponent } from '@gantt/gantt.component';
import { GanttResourceGroupType } from '@gantt-models/gantt-resource-group-type.model';
import { GanttEventGroupType } from '@gantt-models/GanttEventGroupType.enum';
import { GanttEventChangeResourceModel } from '@gantt-models/move-events/gantt-event-change-resource.model';
import { GanttMovedModuleModel } from '@gantt-models/move-events/gantt-moved-module.model';
import { GanttUtilService } from '@gantt-services/gantt-util.service';
import { Cit } from 'cit-angular';

@Injectable({
  providedIn: 'root',
})
export class GanttMoveEventService {
  public ganttComponent: GanttComponent;
  public movedEvents: Map<ParentEventModel, Array<GanttMovedModuleModel>> = new Map<
    ParentEventModel,
    Array<GanttMovedModuleModel>
  >();

  constructor(
    private ganttUtilService: GanttUtilService,
    private learningRequestPrototypeService: LearningRequestPrototypeService,
  ) {}

  onMovingEventHandler(args: Cit.SchedulerEventMovingArgs): void {
    if (this.isPrototypePlannerMove(args)) {
      args.allowed = true;
      this.ganttComponent.offAutoRefreshScheduler = true;
      return;
    }
    this.ganttComponent.offAutoRefreshScheduler = true;
    this.setAllowedMoveEvent(args);
    this.addInMultiselectByModuleId(args);
  }

  afterMoveEventHandler(args: Cit.SchedulerEventMoveArgs): void {
    if (this.isPrototypePlannerMove(args)) {
      return;
    }
    this.moveHiddenEvents(args);
    this.collectMovedEvents(args);
  }

  afterMovedEventHandler(args: Cit.SchedulerEventMovedArgs): void {
    if (this.isPrototypePlannerMove(args)) {
      this.updatePrototypeDraftFromMove(args);
      return;
    }
    args.multimove.forEach(moveParams => {
      this.ganttUtilService.addEventsInMultiSelect(this.ganttComponent.scheduler, moveParams.event);
    });
  }

  private updatePrototypeDraftFromMove(args: Cit.SchedulerEventMovedArgs): void {
    args.multimove
      .filter(moveParams => moveParams.event.data.prototypePlannerDraftId)
      .forEach(moveParams => {
        const draftId = moveParams.event.data.prototypePlannerDraftId,
          resourceId = moveParams.resource?.toString(),
          rowData = this.ganttComponent.scheduler.control.rows.find(resourceId)?.data as any,
          resource = rowData?.name ?? rowData?.text ?? resourceId,
          start = moveParams.start as any,
          end = moveParams.end as any,
          startDate = start.toDate ? start.toDate().toISOString() : new Date(start.value ?? start).toISOString(),
          endDate = end.toDate ? end.toDate().toISOString() : new Date(end.value ?? end).toISOString();

        if (draftId) {
          this.learningRequestPrototypeService.updatePlannerDraftSchedule(
            draftId,
            resource,
            startDate,
            endDate,
            resourceId,
          );
        }
      });
    this.ganttComponent.calendarHandoff = this.learningRequestPrototypeService.getCalendarHandoff();
    this.ganttComponent.offAutoRefreshScheduler = false;
    this.ganttComponent.ganttLoadService.setEvents();
  }

  private isPrototypePlannerMove(
    args: Cit.SchedulerEventMovingArgs | Cit.SchedulerEventMoveArgs | Cit.SchedulerEventMovedArgs,
  ): boolean {
    return Boolean(
      args.e?.data?.prototypePlannerDraftId ||
        args.multimove?.some(moveParams => moveParams.event?.data?.prototypePlannerDraftId),
    );
  }

  confirmMoveEvent(): void {
    if (this.movedEvents.size > 0) {
      const key: ParentEventModel = this.movedEvents.keys().next().value,
        value: Array<GanttMovedModuleModel> = this.movedEvents.get(key);

      this.ganttComponent.ganttClickService.openEventParentEditViewModal(key, value);
    }
  }

  public clearMovedEvents(): void {
    this.movedEvents.clear();
    this.ganttComponent.offAutoRefreshScheduler = false;
  }

  private setAllowedMoveEvent(args: Cit.SchedulerEventMovingArgs): void {
    const movedParentEventId: string = this.movedEvents.keys().next().value?.id,
      currentEventParentEventId: string = args.e.data.eventParent.id,
      allowedByParentEvent: boolean = !movedParentEventId || movedParentEventId === currentEventParentEventId;

    const newResourceId: string = args.row.id,
      newGroupId: GanttResourceGroupType = this.ganttUtilService.getGroupByResourceId(
        newResourceId,
        this.ganttComponent.scheduler,
      ),
      oldGroupId: GanttResourceGroupType = this.ganttUtilService.getGroupByResourceId(
        args.e.data.resource,
        this.ganttComponent.scheduler,
      ),
      allowedByResourceGroup: boolean = newGroupId === oldGroupId;

    const isNotPastDate: boolean = args.multimove.every(moveEvent => Cit.Date.now() < moveEvent.start);

    args.allowed = allowedByParentEvent && isNotPastDate && allowedByResourceGroup;
  }

  private addInMultiselectByModuleId(args: Cit.SchedulerEventMovingArgs): void {
    const multiselect = this.ganttComponent.scheduler.control.multiselect;

    if (!multiselect.isSelected(args.e)) {
      multiselect.clear();
    }

    this.ganttComponent.scheduler.control.events
      .all()
      .filter(event => {
        const notSelected: boolean = !multiselect.isSelected(event),
          isSameModule: boolean = args.multimove.map(move => move.event.data.moduleId).includes(event.data.moduleId);

        return isSameModule && notSelected;
      })
      .forEach(event => this.ganttUtilService.addEventsInMultiSelect(this.ganttComponent.scheduler, event));
  }

  private moveHiddenEvents(args: Cit.SchedulerEventMoveArgs): void {
    this.ganttComponent.scheduler.control.multiselect
      .events()
      .filter(selectedEvent => {
        return !args.multimove.some(movedEvent => {
          return movedEvent.event.id() === selectedEvent.id();
        });
      })
      .forEach(selectedEvent => {
        this.moveEventByMoveArgs(selectedEvent, args);
      });
  }

  private moveEventByMoveArgs(event: Cit.Event, args: Cit.SchedulerEventMoveArgs): void {
    const timeDelta: number = args.newStart.getTime() - args.e['cache'].start.getTime();

    event['cache'] = Object.assign({}, event.data);
    event.data.start = event.start().addMilliseconds(timeDelta);
    event.data.end = event.end().addMilliseconds(timeDelta);

    this.ganttComponent.scheduler.control.events.update(event);

    args.multimove.push({
      event: event,
      start: event.start(),
      end: event.end(),
      resource: event.resource(),
      overlapping: false,
    });
  }

  private collectMovedEvents(args: Cit.SchedulerEventMovedArgs): void {
    args.multimove.forEach(moveParams => {
      const movedEvent: Cit.Event = moveParams.event,
        movedEventData = movedEvent.data,
        moduleId: string = movedEventData.moduleId,
        movedEventParent: ParentEventModel = movedEventData.eventParent,
        movedModule: GanttMovedModuleModel = this.getGanttMovedModuleByModuleId(moduleId, movedEventParent);

      this.changeModuleResource(movedModule, moveParams);
    });
  }

  private getGanttMovedModuleByModuleId(moduleId: string, newEventParent: ParentEventModel): GanttMovedModuleModel {
    let oldEventParent: ParentEventModel = this.findMovedParentEventFromMovedEvents(newEventParent.id),
      movedModule: GanttMovedModuleModel = this.movedEvents
        .get(oldEventParent)
        ?.find(movedEvent => movedEvent.moduleId === moduleId);

    if (!movedModule) {
      movedModule = new GanttMovedModuleModel();
      movedModule.moduleId = moduleId;

      this.movedEvents.has(oldEventParent)
        ? this.movedEvents.get(oldEventParent).push(movedModule)
        : this.movedEvents.set(newEventParent, [movedModule]);
    }

    return movedModule;
  }

  private findMovedParentEventFromMovedEvents(eventParentId: string): ParentEventModel {
    let eventParent: ParentEventModel;

    this.movedEvents.forEach((value, key) => {
      if (key.id === eventParentId) {
        eventParent = key;
      }
    });

    return eventParent;
  }

  private changeModuleResource(movedModule: GanttMovedModuleModel, moveParams): void {
    const movedEvent: Cit.Event = moveParams.event,
      movedEventId: string = movedEvent.id().toString(),
      newResourceId: string = moveParams.resource.toString(),
      newStart: Cit.Date = moveParams.start,
      newEnd: Cit.Date = moveParams.end;

    let changedResource: GanttEventChangeResourceModel = movedModule.getChangedResourceByEventId(movedEventId);

    if (!changedResource) {
      changedResource = this.createChangeResourceModel(movedEvent);
      movedModule.changedResources.push(changedResource);
    }

    changedResource.newResourceId = newResourceId;
    changedResource.newStart = newStart;
    changedResource.newEnd = newEnd;

    movedModule.timeDelta = changedResource.newStart.getTime() - changedResource.oldStart.getTime();
  }

  private createChangeResourceModel(movedEvent: Cit.Event): GanttEventChangeResourceModel {
    const changedResource: GanttEventChangeResourceModel = new GanttEventChangeResourceModel(),
      eventCache = movedEvent['cache'],
      oldResourceId: string = eventCache.resource.toString(),
      oldStart: Cit.Date = eventCache.start,
      oldEnd: Cit.Date = eventCache.end,
      eventGroup: GanttEventGroupType = movedEvent.data.eventGroup;

    changedResource.eventId = movedEvent.id().toString();
    changedResource.oldResourceId = oldResourceId;
    changedResource.oldStart = oldStart;
    changedResource.oldEnd = oldEnd;
    changedResource.eventGroup = eventGroup;

    return changedResource;
  }
}
