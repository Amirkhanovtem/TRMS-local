import { AfterViewInit, Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CommonComponent } from '@common-components/common.component';
import {
  CalendarHandoff,
  LearningRequestPrototypeService,
} from '@components/learning-requests-prototype/learning-request-prototype.service';
import { UnavailabilityResourcePeriodModel } from '@components/unavailability-resources/unavailability-resources-period/models/unavailability-resource-period.model';
import { Config } from '@config/config';
import { Role } from '@config/role';
import { ParentEventModel } from '@event-models/parent-event.model';
import { GanttFilterSelectionComponent } from '@gantt-modals-filter-selection/gantt-filter-selection.component';
import { GanttEventTooltipComponent } from '@gantt-modals-tolltips-event/gantt-event-tooltip.component';
import { GanttResourceTooltipComponent } from '@gantt-modals-tolltips-resource/gantt-resource-tooltip.component';
import { GanttMovedModuleModel } from '@gantt-models/move-events/gantt-moved-module.model';
import { GanttClickService } from '@gantt-services/gantt-click.service';
import { GanttContextMenuService } from '@gantt-services/gantt-context-menu.service';
import { GanttLoadService } from '@gantt-services/gantt-load.service';
import { GanttMoveEventService } from '@gantt-services/gantt-move-event.service';
import { GanttRenderService } from '@gantt-services/gantt-render.service';
import { GanttScrollService } from '@gantt-services/gantt-scroll.service';
import { GanttViewRangeService } from '@gantt-services/gantt-view-range.service';
import { GanttZoomService } from '@gantt-services/gantt-zoom.service';
import { Cit, CitSchedulerComponent } from 'cit-angular';

@Component({
  selector: 'app-gant',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss', '../../../styles.scss'],
  standalone: false,
})
export class GanttComponent extends CommonComponent implements AfterViewInit, OnInit {
  public static readonly DEFAULT_EVENT_HEIGHT = 35;

  public hideBtnContainer: boolean = false;
  public offAutoRefreshScheduler: boolean = false;
  public markerEventsByAllowing: boolean = false;

  private readonly DEFAULT_ROW_HEADER_WIDTH = 200;
  public readonly DEFAULT_CELL_DURATION = 30;
  private readonly DEFAULT_CELL_WIDTH = 100;
  public readonly CELL_DURATION_OFFSET = this.DEFAULT_CELL_DURATION / 60;

  public readonly WORKLOAD_EVENT_FILTER_TYPE = 'workload';

  @ViewChild('scheduler')
  scheduler!: CitSchedulerComponent;

  checkedDraft: boolean = false;
  events: Array<Cit.EventData> = [];

  public lastStart: Cit.Date = new Cit.Date('1900-01-01');
  public lastEnd: Cit.Date = new Cit.Date('1900-01-01');
  public resourceIdWorkload = null;
  public plannedEvents: Array<Cit.EventData> = [];
  public draftEvents: Array<Cit.EventData> = [];
  public calendarHandoff: CalendarHandoff = null;
  public showPlannerHandoffSummary: boolean = true;
  public holidays: Array<Cit.Date> = [];
  public unavailabilityResourcePeriods: Array<UnavailabilityResourcePeriodModel> = [];
  public movedEvents: Map<ParentEventModel, Array<GanttMovedModuleModel>> = this.ganttMoveEventService.movedEvents;

  config: Cit.SchedulerConfig = {
    locale: this.localization.getLanguageFromStorage(),
    theme: 'trms_gantt',
    heightSpec: 'Max100Pct',
    treeIndent: 5,
    rowHeaderWidth: this.DEFAULT_ROW_HEADER_WIDTH,
    rowHeaderWidthMin: this.DEFAULT_ROW_HEADER_WIDTH,
    rowHeaderWidthAutoFit: false,
    cellWidth: this.DEFAULT_CELL_WIDTH,
    cellWidthMin: this.DEFAULT_CELL_WIDTH,
    eventHeight: GanttComponent.DEFAULT_EVENT_HEIGHT,
    headerHeight: 30,
    weekStarts: 1,
    treeEnabled: true,
    treeAnimation: false,
    blockOnCallBack: true,
    businessWeekends: true,
    crosshairType: 'Header',
    // auto-refresh
    autoRefreshEnabled: true,
    autoRefreshInterval: Number(Config.GANTT_AUTO_REFRESH_INTERVAL),
    // infinite scroll
    infiniteScrollingMargin: 25,
    infiniteScrollingStepDays: 30,
    dynamicEventRendering: 'Progressive',
    dynamicEventRenderingMargin: 200,
    // handling
    allowMultiMove: true,
    eventMoveHandling: 'Update',
    eventResizeHandling: 'Disabled',
    multiMoveVerticalMode: 'Master',
    // click handling
    rowClickHandling: 'Select',
    // double-click handling
    eventDoubleClickHandling: 'Enabled',
    timeRangeDoubleClickHandling: 'Enabled',
    showToolTip: false,
    // bubbles
    bubble: this.ganttRenderService.createGanttEventBubble(GanttEventTooltipComponent),
    resourceBubble: this.ganttRenderService.createGanttResourceBubble(GanttResourceTooltipComponent),
    zoom: this.ganttZoomService.getDefaultZoom(),
    zoomLevels: this.ganttZoomService.getZoomLevels(this),
    onEventFilter: args => {
      this.clearSelection();

      if (args.filterParam === this.WORKLOAD_EVENT_FILTER_TYPE) {
        this.showHideEventsByWorkload(args);
      }
    },
    // before render
    onBeforeCornerRender: args => {
      this.ganttRenderService.createCorner(args);
    },
    onBeforeRowHeaderRender: args => {
      this.ganttRenderService.colorizeResources(args);
    },
    onBeforeCellRender: args => {
      this.ganttRenderService.colorizeCells(args);
    },
    onBeforeEventRender: args => {
      this.ganttRenderService.markCompletedEvent(args);
      this.ganttRenderService.markEventByAllowing(args);
    },
    // selected
    onTimeRangeSelected: args => {
      args.control.multiselect.clear();
    },
    onRowSelected: args => {
      this.ganttClickService.triggerResourceWorkload(args);
    },
    // clicked
    onEventClicked: args => {
      if (args.e.data.prototypePlannerDraftId) {
        return;
      }
      this.ganttClickService.eventClickHandler(args);
    },
    onEventMoving: args => {
      this.ganttMoveEventService.onMovingEventHandler(args);
    },
    onEventMove: args => {
      this.ganttMoveEventService.afterMoveEventHandler(args);
    },
    onEventMoved: args => {
      this.ganttMoveEventService.afterMovedEventHandler(args);
    },
    // double-clicked
    onTimeRangeDoubleClicked: args => {
      this.ganttClickService.openCreateEventModal(args);
    },
    onRowDoubleClicked: args => {
      this.ganttClickService.openResourceViewModal(args);
    },
    onEventDoubleClicked: args => {
      if (args.e.data.prototypePlannerDraftId) {
        return;
      }
      this.ganttClickService.openEventParentEditViewModal(args.e.data.eventParent);
    },
    // auto-refresh
    onAutoRefresh: args => {
      if (!this.offAutoRefreshScheduler) {
        this.ganttLoadService.loadEvents();
      }
    },
    contextMenuSelection: this.ganttContextMenuService.getContextMenuSelection(),
  };

  constructor(
    private viewContainerRef: ViewContainerRef,
    public route: ActivatedRoute,
    public ganttClickService: GanttClickService,
    public ganttScrollService: GanttScrollService,
    public ganttViewRangeService: GanttViewRangeService,
    public ganttMoveEventService: GanttMoveEventService,
    public ganttRenderService: GanttRenderService,
    public ganttLoadService: GanttLoadService,
    public ganttZoomService: GanttZoomService,
    injector: Injector,
    public ganttContextMenuService: GanttContextMenuService,
    public learningRequestPrototypeService: LearningRequestPrototypeService,
  ) {
    super(injector);
    ganttMoveEventService.ganttComponent = this;
    ganttClickService.ganttComponent = this;
    ganttScrollService.ganttComponent = this;
    ganttViewRangeService.ganttComponent = this;
    ganttLoadService.ganttComponent = this;
    ganttRenderService.ganttComponent = this;
    ganttContextMenuService.ganttComponent = this;
    ganttRenderService.viewContainerRef = viewContainerRef;
  }

  ngOnInit(): void {
    this.calendarHandoff = this.learningRequestPrototypeService.getCalendarHandoff();
    this.showPlannerHandoffSummary = Boolean(this.calendarHandoff?.drafts?.length);
    this.openTrainingModalByURL();
  }

  override ngAfterViewInit(): void {
    this.ganttLoadService.afterViewInitLoad();
    this.ganttScrollService.registerScrollHandler();

    this.scheduler.config = this.config;
    this.scrollToPlannerHandoffStart();

    super.ngAfterViewInit();
  }

  private openTrainingModalByURL(): void {
    const trainingSessionCode: string = this.route.snapshot.params['trainingSessionCode'];

    if (trainingSessionCode) {
      this.ganttClickService.openTrainingModalBySessionCode(trainingSessionCode);
    }
  }

  openGanttFilterSelectionModal(): void {
    const modalRef = this.newModal.open(GanttFilterSelectionComponent);

    this.closeGanttFilterSelectionModalHandler(modalRef);
  }

  currentUserCanViewDraft(): boolean {
    const allowedRoles = [Role.ADMIN, Role.PLANER, Role.SENIOR_PLANER];

    return this.currentUserHasSomeRole(allowedRoles);
  }

  switchEventsDisplay(isCheckedDraft: boolean): void {
    this.clearSelection();

    this.checkedDraft = isCheckedDraft;

    this.ganttLoadService.setEvents();
  }

  markEventsByAllowing(): void {
    this.markerEventsByAllowing = !this.markerEventsByAllowing;

    this.scheduler.control.update();
  }

  public getPrototypePlannerEvents(): Array<Cit.EventData> {
    if (!this.calendarHandoff?.drafts?.length) {
      return [];
    }

    return this.calendarHandoff.drafts.map(draft => {
      const resourceId = draft.resourceId ?? this.resolvePrototypeResourceId(draft.room);

      return {
        id: `prototype-${draft.id}`,
        text: `${draft.trainingTitle} · гр. ${draft.groupNumber}`,
        start: new Cit.Date(new Date(draft.startDate), true),
        end: new Cit.Date(new Date(draft.endDate), true),
        resource: resourceId,
        backColor: '#006251',
        fontColor: '#ffffff',
        cssClass: 'prototype-planner-event',
        moveDisabled: false,
        prototypePlannerDraftId: draft.id,
        moduleId: `prototype-module-${draft.id}`,
        trainingTemplateName: draft.trainingTitle,
        trainingGroup: `Группа ${draft.groupNumber}`,
        trainingName: draft.trainingTitle,
        roomName: draft.room,
        mainTrainersNames: draft.trainer,
        linearTrainersNames: '',
        trainingFactualStatus: { id: 'DRAFT' },
        eventParent: {
          id: `prototype-parent-${draft.requestId}`,
          name: this.calendarHandoff.request.title,
          isEditable: true,
          eventParentType: { id: 'TRAINING', name: 'Training' },
          author: 'Planner',
          targetTrainingSessionCode: '',
        },
      } as Cit.EventData;
    });
  }

  public get handoffGroupCount(): number {
    if (!this.calendarHandoff?.drafts?.length) {
      return 0;
    }
    return new Set(this.calendarHandoff.drafts.map(draft => draft.groupNumber)).size;
  }

  public get handoffRoomSummary(): string {
    if (!this.calendarHandoff?.drafts?.length) {
      return '';
    }
    const rooms = Array.from(new Set(this.calendarHandoff.drafts.map(draft => draft.room))).filter(Boolean);
    return rooms.length <= 2 ? rooms.join(', ') : `${rooms.length} аудиторий`;
  }

  public get handoffDateRange(): string {
    if (!this.calendarHandoff?.drafts?.length) {
      return '';
    }
    const timestamps = this.calendarHandoff.drafts
      .map(draft => new Date(draft.startDate).getTime())
      .filter(value => !Number.isNaN(value))
      .sort((left, right) => left - right);
    const first = new Date(timestamps[0]);
    const last = new Date(timestamps[timestamps.length - 1]);
    return `${first.toLocaleDateString('ru-RU')} - ${last.toLocaleDateString('ru-RU')}`;
  }

  public hidePlannerHandoff(): void {
    this.showPlannerHandoffSummary = false;
  }

  private scrollToPlannerHandoffStart(): void {
    if (!this.calendarHandoff?.drafts?.length) {
      return;
    }

    const firstDraft = [...this.calendarHandoff.drafts].sort(
      (left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime(),
    )[0];

    setTimeout(() => {
      const startDate = new Cit.Date(new Date(firstDraft.startDate), true);
      this.scheduler?.control?.scrollTo(startDate);
      this.ganttLoadService.setEvents();
    }, 600);
  }

  private resolvePrototypeResourceId(roomName: string): string {
    const flatResources = this.flattenResources(this.config.resources ?? []);
    const exact = flatResources.find(resource => {
      const data: any = resource;
      return data.name === roomName || data.text === roomName || data.id === roomName;
    });

    if (exact) {
      return exact.id;
    }

    const firstRoom = flatResources.find(resource => {
      const data: any = resource;
      return !data.children?.length && (data.groupId === 'ROOM_GROUP' || data.group === false || data.group === undefined);
    });

    return firstRoom?.id ?? roomName;
  }

  private flattenResources(resources: Array<any>): Array<any> {
    return resources.flatMap(resource => [resource, ...this.flattenResources(resource.children ?? [])]);
  }

  private closeGanttFilterSelectionModalHandler(modalRef: MatDialogRef<GanttFilterSelectionComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.ganttLoadService.loadResources();
          this.ganttLoadService.loadEvents();
        }
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  public clearSelection(): void {
    this.scheduler.control.clearSelection();
    this.scheduler.control.multiselect.clear();
  }

  currentUserCanViewResource(): boolean {
    const allowedRoles = [
      Role.USER,
      Role.POWER_USER,
      Role.EXTERNAL_USER,
      Role.ADMIN,
      Role.PLANER,
      Role.SENIOR_PLANER,
      Role.TRAINER,
    ];

    return this.currentUserHasSomeRole(allowedRoles);
  }

  currentUserCanCreateEvent(): boolean {
    const allowedRoles = [Role.ADMIN, Role.PLANER, Role.SENIOR_PLANER];

    return this.currentUserHasSomeRole(allowedRoles);
  }

  currentUserCanViewEventModal(): boolean {
    const rolesCanView: Array<string> = [Role.ADMIN, Role.SENIOR_PLANER, Role.PLANER, Role.TRAINER];

    return this.currentUserHasSomeRole(rolesCanView);
  }

  currentUserCanEditEvent(event): boolean {
    return event.isEditable;
  }

  private showHideEventsByWorkload(args) {
    if (!this.resourceIdWorkload) {
      args.visible = true;
      return;
    }

    args.visible = this.scheduler.control.events.list.some(event => {
      return event.moduleId === args.e.data.moduleId && event.resource === this.resourceIdWorkload;
    });
  }
}

