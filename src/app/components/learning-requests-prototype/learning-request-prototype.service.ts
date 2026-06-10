import { Injectable } from '@angular/core';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { TrainingTemplateService } from '@training-template-services/training-template.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export type LearningRequestStatus = 'new' | 'review' | 'clarify' | 'approved' | 'rejected';
export type LearningRequestPlanningStatus = 'notStarted' | 'drafts' | 'calendar' | 'completed';

export interface LearningRequestChatMessage {
  author: string;
  message: string;
  date: string;
}

export interface TrainingOption {
  id: string;
  name: string;
}

export interface LearningRequest {
  id: string;
  title: string;
  trainingTemplateIds: Array<string>;
  trainingTitles: Array<string>;
  requester: string;
  owner: string;
  department: string;
  city: string;
  peopleCount: number;
  periodFrom: string;
  periodTo: string;
  format: string;
  priority: string;
  budget: string;
  justification: string;
  statusKey: LearningRequestStatus;
  planningStatus?: LearningRequestPlanningStatus;
  plannerHidden?: boolean;
  plannerCompletedAt?: string;
  plannerSummary?: string;
  createdAt: string;
  chatMessages: Array<LearningRequestChatMessage>;
}

export interface CreateLearningRequestPayload {
  trainingTemplateIds: Array<string>;
  trainingTitles?: Array<string>;
  requester: string;
  department: string;
  city: string;
  peopleCount: number;
  periodFrom: string;
  periodTo: string;
  format: string;
  priority: string;
  budget: string;
  justification: string;
}

export type PlannerDraftStatus = 'draft' | 'sentToCalendar';

export interface PlannerDraft {
  id: string;
  requestId: string;
  trainingTemplateId: string;
  trainingTitle: string;
  groupNumber: number;
  participants: number;
  startDate: string;
  endDate: string;
  room: string;
  resourceId?: string;
  trainer: string;
  equipment: string;
  status: PlannerDraftStatus;
}

export interface PlannerOptions {
  groupSize: number;
  durationHours: number;
  startTime: string;
  roomMode: string;
  trainerMode: string;
}

export interface PlannerAutoCreateOptions {
  requestId: string;
  trainingTemplateId: string;
  startDate: string;
  startTime: string;
  durationHours: number;
  groupSize: number;
  groupCount: number;
  room: string;
  trainer: string;
}

export interface ManualLearningPlanModule {
  day: number;
  title: string;
  durationHours: number;
  format: string;
}

export interface ManualLearningPlanGroupAssignment {
  groupNumber: number;
  trainer: string;
  participants: number;
}

export interface ManualLearningPlanPayload {
  planTitle: string;
  city: string;
  periodFrom: string;
  periodTo: string;
  startTime: string;
  roomMode: string;
  groups: Array<ManualLearningPlanGroupAssignment>;
  modules: Array<ManualLearningPlanModule>;
}

export interface CalendarHandoff {
  request: LearningRequest;
  drafts: Array<PlannerDraft>;
  createdAt: string;
}

const STORAGE_KEY = 'trms.learning-requests-prototype.v2';
const PLANNER_STORAGE_KEY = 'trms.learning-requests-prototype.planner-drafts.v2';
const CALENDAR_HANDOFF_KEY = 'trms.learning-requests-prototype.calendar-handoff.v2';

@Injectable({
  providedIn: 'root',
})
export class LearningRequestPrototypeService {
  public readonly availableRooms: Array<string> = [
    '901',
    '904',
    'Conference room',
    'Astana room 201',
    'Astana room 304',
    'MS Teams / LMS',
  ];
  public readonly availableTrainers: Array<string> = [
    'Internal trainer A',
    'Internal trainer B',
    'Certified trainer',
    'External provider',
  ];

  private readonly fallbackTrainingOptions: Array<TrainingOption> = [
    { id: 'security-awareness-2026', name: 'Security Awareness 2026' },
    { id: 'leadership-workshop', name: 'Leadership Workshop' },
    { id: 'digital-learning-strategy', name: 'Digital Learning Strategy' },
    { id: 'customer-experience-advanced', name: 'Customer Experience Advanced' },
    { id: 'dangerous-goods-recurrent', name: 'Dangerous Goods Recurrent' },
    { id: 'power-bi-basics', name: 'Power BI Basics' },
  ];

  private readonly trainingOptionsSubject = new BehaviorSubject<Array<TrainingOption>>(this.fallbackTrainingOptions);
  private readonly requestsSubject = new BehaviorSubject<Array<LearningRequest>>(this.loadStoredRequests());
  private readonly plannerDraftsSubject = new BehaviorSubject<Array<PlannerDraft>>(this.loadStoredPlannerDrafts());

  public readonly trainingOptions$: Observable<Array<TrainingOption>> = this.trainingOptionsSubject.asObservable();
  public readonly requests$: Observable<Array<LearningRequest>> = this.requestsSubject.asObservable();
  public readonly plannerDrafts$: Observable<Array<PlannerDraft>> = this.plannerDraftsSubject.asObservable();

  constructor(private readonly trainingTemplateService: TrainingTemplateService) {
    this.loadTrainingOptions();
  }

  public createRequest(payload: CreateLearningRequestPayload): LearningRequest {
    const trainings = payload.trainingTitles?.length
      ? payload.trainingTitles
      : this.resolveTrainingTitles(payload.trainingTemplateIds);
    const request: LearningRequest = {
      id: `lr-${Date.now()}`,
      title: trainings.length > 1 ? `${trainings[0]} +${trainings.length - 1}` : trainings[0] || 'Новая заявка на обучение',
      trainingTemplateIds: payload.trainingTemplateIds,
      trainingTitles: trainings,
      requester: payload.requester,
      owner: 'Training Academy',
      department: payload.department,
      city: payload.city,
      peopleCount: payload.peopleCount,
      periodFrom: payload.periodFrom,
      periodTo: payload.periodTo,
      format: payload.format,
      priority: payload.priority,
      budget: payload.budget,
      justification: payload.justification,
      statusKey: 'review',
      createdAt: new Date().toISOString(),
      chatMessages: [
        {
          author: payload.requester,
          message: 'Заявка создана и отправлена в Training Academy.',
          date: this.formatDateTime(new Date()),
        },
      ],
    };

    this.setRequests([request, ...this.requestsSubject.value]);
    return request;
  }

  public updateStatus(id: string, statusKey: LearningRequestStatus): void {
    this.setRequests(
      this.requestsSubject.value.map(request => {
        if (request.id !== id) {
          return request;
        }
        return {
          ...request,
          statusKey,
          planningStatus: statusKey === 'approved' ? request.planningStatus ?? 'notStarted' : request.planningStatus,
          plannerHidden: statusKey === 'approved' ? request.plannerHidden ?? false : request.plannerHidden,
          chatMessages: [
            ...request.chatMessages,
            {
              author: 'Training Academy',
              message: this.getStatusMessage(statusKey),
              date: this.formatDateTime(new Date()),
            },
          ],
        };
      }),
    );
  }

  public addChatMessage(id: string, author: string, message: string): void {
    this.setRequests(
      this.requestsSubject.value.map(request =>
        request.id === id
          ? {
              ...request,
              chatMessages: [
                ...request.chatMessages,
                {
                  author,
                  message,
                  date: this.formatDateTime(new Date()),
                },
              ],
            }
          : request,
      ),
    );
  }

  public getRequestById(id: string): LearningRequest {
    return this.requestsSubject.value.find(request => request.id === id) ?? null;
  }

  public getDraftsByRequestId(requestId: string): Array<PlannerDraft> {
    return this.plannerDraftsSubject.value.filter(draft => draft.requestId === requestId);
  }

  public generatePlannerDrafts(requestId: string, options: PlannerOptions): Array<PlannerDraft> {
    const request = this.getRequestById(requestId);
    if (!request) {
      return [];
    }

    const groupSize = Math.max(Number(options.groupSize) || 1, 1);
    const groupCount = Math.max(Math.ceil(request.peopleCount / groupSize), 1);
    const startDate = new Date(request.periodFrom);
    const existingOtherDrafts = this.plannerDraftsSubject.value.filter(draft => draft.requestId !== requestId);
    const drafts: Array<PlannerDraft> = [];

    request.trainingTemplateIds.forEach((trainingTemplateId, trainingIndex) => {
      const trainingTitle = request.trainingTitles[trainingIndex] ?? request.trainingTitles[0] ?? request.title;

      for (let groupNumber = 1; groupNumber <= groupCount; groupNumber++) {
        const eventDate = new Date(startDate);
        eventDate.setDate(startDate.getDate() + trainingIndex * 7 + (groupNumber - 1) * 2);
        const eventStart = this.withTime(eventDate, options.startTime);
        const eventEnd = new Date(eventStart);
        eventEnd.setHours(eventStart.getHours() + Number(options.durationHours || 4));

        drafts.push({
          id: `${requestId}-${trainingIndex + 1}-${groupNumber}-${Date.now()}`,
          requestId,
          trainingTemplateId,
          trainingTitle,
          groupNumber,
          participants:
            groupNumber === groupCount
              ? request.peopleCount - groupSize * (groupCount - 1) || groupSize
              : groupSize,
          startDate: eventStart.toISOString(),
          endDate: eventEnd.toISOString(),
          room: this.pickRoom(groupNumber, request.city, options.roomMode),
          trainer: this.pickTrainer(groupNumber, options.trainerMode),
          equipment: request.format === 'Онлайн' ? 'Online room' : 'Projector + laptops',
          status: 'draft',
        });
      }
    });

    this.setPlannerDrafts([...existingOtherDrafts, ...drafts]);
    this.updatePlanningState(requestId, {
      planningStatus: 'drafts',
      plannerHidden: false,
      plannerSummary: `Сформировано ${drafts.length} черновиков, групп: ${groupCount}.`,
    });
    this.addChatMessage(
      requestId,
      'Planner',
      `Сформирован пакет планирования: ${drafts.length} черновиков календаря, групп: ${groupCount}.`,
    );
    return drafts;
  }

  public sendDraftsToCalendar(requestId: string): CalendarHandoff {
    const request = this.getRequestById(requestId);
    if (!request) {
      return null;
    }

    const drafts = this.getDraftsByRequestId(requestId);
    const sentDrafts = drafts.map(draft => ({ ...draft, status: 'sentToCalendar' as PlannerDraftStatus }));
    this.setPlannerDrafts([
      ...this.plannerDraftsSubject.value.filter(draft => draft.requestId !== requestId),
      ...sentDrafts,
    ]);
    this.updatePlanningState(requestId, {
      planningStatus: 'calendar',
      plannerHidden: false,
      plannerSummary: `Передано в календарь: ${sentDrafts.length}/${sentDrafts.length}.`,
    });

    const handoff: CalendarHandoff = {
      request,
      drafts: sentDrafts,
      createdAt: this.formatDateTime(new Date()),
    };
    localStorage.setItem(CALENDAR_HANDOFF_KEY, JSON.stringify(handoff));
    this.addChatMessage(requestId, 'Planner', 'Пакет черновиков передан в общий календарь TRMS.');
    return handoff;
  }

  public createCalendarDraftsFromCriteria(options: PlannerAutoCreateOptions): CalendarHandoff {
    const request = this.getRequestById(options.requestId);
    if (!request) {
      return null;
    }

    const trainingIndex = request.trainingTemplateIds.indexOf(options.trainingTemplateId);
    const trainingTitle = request.trainingTitles[trainingIndex] ?? request.trainingTitles[0] ?? request.title;
    const groupSize = Math.max(Number(options.groupSize) || 1, 1);
    const groupCount = Math.max(Number(options.groupCount) || 1, 1);
    const durationHours = Math.max(Number(options.durationHours) || 1, 1);
    const startDate = new Date(options.startDate);

    const drafts: Array<PlannerDraft> = Array.from({ length: groupCount }, (_, index) => {
      const eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + index * 2);
      const eventStart = this.withTime(eventDate, options.startTime);
      const eventEnd = new Date(eventStart);
      eventEnd.setHours(eventStart.getHours() + durationHours);
      const room =
        options.room === 'auto'
          ? this.pickRoom(index + 1, request.city, request.format === 'Онлайн' ? 'online' : 'auto')
          : options.room;

      return {
        id: `${request.id}-auto-${options.trainingTemplateId}-${index + 1}-${Date.now()}`,
        requestId: request.id,
        trainingTemplateId: options.trainingTemplateId,
        trainingTitle,
        groupNumber: index + 1,
        participants: groupSize,
        startDate: eventStart.toISOString(),
        endDate: eventEnd.toISOString(),
        room,
        trainer: options.trainer,
        equipment: request.format === 'Онлайн' || room === 'MS Teams / LMS' ? 'Online room' : 'Projector + laptops',
        status: 'sentToCalendar',
      };
    });

    const existingDrafts = this.plannerDraftsSubject.value.filter(
      draft => !(draft.requestId === request.id && draft.trainingTemplateId === options.trainingTemplateId),
    );
    this.setPlannerDrafts([...existingDrafts, ...drafts]);
    this.updatePlanningState(request.id, {
      planningStatus: 'calendar',
      plannerHidden: false,
      plannerSummary: `Автосоздано и передано в календарь: ${drafts.length} событий по тренингу ${trainingTitle}.`,
    });

    const handoff: CalendarHandoff = {
      request,
      drafts,
      createdAt: this.formatDateTime(new Date()),
    };
    localStorage.setItem(CALENDAR_HANDOFF_KEY, JSON.stringify(handoff));
    this.addChatMessage(
      request.id,
      'Planner',
      `Автосоздание: ${trainingTitle}, ${drafts.length} групп, старт ${options.startDate} ${options.startTime}, тренер ${options.trainer}.`,
    );
    return handoff;
  }

  public createManualLearningPlanDrafts(payload: ManualLearningPlanPayload): CalendarHandoff {
    const requestId = `manual-plan-${Date.now()}`;
    const trainingTemplateIds = payload.modules.map(module => `manual-day-${module.day}-${this.slugify(module.title)}`);
    const trainingTitles = payload.modules.map(module => module.title);
    const request: LearningRequest = {
      id: requestId,
      title: payload.planTitle,
      trainingTemplateIds,
      trainingTitles,
      requester: 'Planner',
      owner: 'Planner queue',
      department: 'Training Academy',
      city: payload.city,
      peopleCount: payload.groups.reduce((sum, group) => sum + Number(group.participants || 0), 0),
      periodFrom: payload.periodFrom,
      periodTo: payload.periodTo,
      format: 'Учебный план',
      priority: 'Medium',
      budget: 'Планирование без заявки',
      justification: 'Учебный план создан планером вручную из справочника учебных планов.',
      statusKey: 'approved',
      planningStatus: 'drafts',
      plannerHidden: false,
      plannerSummary: `Сформирован учебный план: ${payload.groups.length} групп, ${payload.modules.length} дней обучения.`,
      createdAt: new Date().toISOString(),
      chatMessages: [
        {
          author: 'Planner',
          message: `Создан учебный план "${payload.planTitle}" для проверки перед подтверждением.`,
          date: this.formatDateTime(new Date()),
        },
      ],
    };

    const startDate = new Date(payload.periodFrom);
    const drafts = payload.groups.flatMap(group =>
      payload.modules.map(module => {
        const eventDate = this.addBusinessDays(startDate, module.day - 1);
        const eventStart = this.withTime(eventDate, payload.startTime);
        const eventEnd = new Date(eventStart);
        eventEnd.setHours(eventStart.getHours() + Number(module.durationHours || 4));

        return {
          id: `${requestId}-g${group.groupNumber}-d${module.day}-${Date.now()}`,
          requestId,
          trainingTemplateId: `manual-day-${module.day}-${this.slugify(module.title)}`,
          trainingTitle: `${payload.planTitle}: день ${module.day} - ${module.title}`,
          groupNumber: group.groupNumber,
          participants: Number(group.participants) || 1,
          startDate: eventStart.toISOString(),
          endDate: eventEnd.toISOString(),
          room: this.pickRoom(group.groupNumber, payload.city, payload.roomMode),
          trainer: group.trainer,
          equipment: module.format === 'Онлайн' ? 'Online room' : 'Projector + laptops',
          status: 'draft' as PlannerDraftStatus,
        };
      }),
    );

    this.setRequests([request, ...this.requestsSubject.value]);
    this.setPlannerDrafts([...this.plannerDraftsSubject.value, ...drafts]);
    const handoff: CalendarHandoff = {
      request,
      drafts,
      createdAt: this.formatDateTime(new Date()),
    };
    localStorage.setItem(CALENDAR_HANDOFF_KEY, JSON.stringify(handoff));
    return handoff;
  }

  public completePlannerRequest(requestId: string): void {
    const drafts = this.getDraftsByRequestId(requestId);
    const sentCount = drafts.filter(draft => draft.status === 'sentToCalendar').length;
    const summary = drafts.length
      ? `Планирование завершено. В календарь передано ${sentCount}/${drafts.length} событий.`
      : 'Планирование завершено без сформированных черновиков.';

    this.updatePlanningState(requestId, {
      planningStatus: 'completed',
      plannerHidden: true,
      plannerCompletedAt: this.formatDateTime(new Date()),
      plannerSummary: summary,
    });
    this.addChatMessage(requestId, 'Planner', summary);
  }

  public setPlannerHidden(requestId: string, hidden: boolean): void {
    this.updatePlanningState(requestId, {
      plannerHidden: hidden,
    });
  }

  public updatePlannerDraft(draftId: string, patch: Partial<PlannerDraft>): void {
    const currentDraft = this.plannerDraftsSubject.value.find(draft => draft.id === draftId);
    this.setPlannerDrafts(
      this.plannerDraftsSubject.value.map(draft => (draft.id === draftId ? { ...draft, ...patch } : draft)),
    );
    if (currentDraft) {
      this.setCalendarHandoff(currentDraft.requestId);
    }
  }

  public updatePlannerDraftSchedule(
    draftId: string,
    resource: string,
    startDate: string,
    endDate: string,
    resourceId?: string,
  ): void {
    this.updatePlannerDraft(draftId, {
      room: resource,
      resourceId,
      startDate,
      endDate,
    });
    const draft = this.plannerDraftsSubject.value.find(item => item.id === draftId);
    if (draft) {
      this.setCalendarHandoff(draft.requestId);
    }
  }

  public setCalendarHandoff(requestId: string): CalendarHandoff {
    const request = this.getRequestById(requestId);
    if (!request) {
      return null;
    }
    const handoff: CalendarHandoff = {
      request,
      drafts: this.getDraftsByRequestId(requestId),
      createdAt: this.formatDateTime(new Date()),
    };
    localStorage.setItem(CALENDAR_HANDOFF_KEY, JSON.stringify(handoff));
    return handoff;
  }

  public getCalendarHandoff(): CalendarHandoff {
    const raw = localStorage.getItem(CALENDAR_HANDOFF_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as CalendarHandoff;
    } catch {
      localStorage.removeItem(CALENDAR_HANDOFF_KEY);
      return null;
    }
  }

  private updatePlanningState(requestId: string, patch: Partial<LearningRequest>): void {
    this.setRequests(
      this.requestsSubject.value.map(request => (request.id === requestId ? { ...request, ...patch } : request)),
    );
  }

  private loadTrainingOptions(): void {
    this.trainingTemplateService
      .getTrainingTemplateListForCreatingEvent()
      .pipe(
        map((items: Array<StandardNameIdModel>) =>
          items?.length ? items.map(item => ({ id: item.id, name: item.name })) : this.fallbackTrainingOptions,
        ),
        catchError(() => of(this.fallbackTrainingOptions)),
      )
      .subscribe(options => this.trainingOptionsSubject.next(options));
  }

  private resolveTrainingTitles(ids: Array<string>): Array<string> {
    const options = this.trainingOptionsSubject.value;
    return ids
      .map(id => options.find(option => option.id === id)?.name)
      .filter(Boolean);
  }

  private setRequests(requests: Array<LearningRequest>): void {
    this.requestsSubject.next(requests);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }

  private setPlannerDrafts(drafts: Array<PlannerDraft>): void {
    this.plannerDraftsSubject.next(drafts);
    localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(drafts));
  }

  private loadStoredRequests(): Array<LearningRequest> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as Array<LearningRequest>;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return this.createSeedRequests();
  }

  private loadStoredPlannerDrafts(): Array<PlannerDraft> {
    const raw = localStorage.getItem(PLANNER_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as Array<PlannerDraft>;
      } catch {
        localStorage.removeItem(PLANNER_STORAGE_KEY);
      }
    }
    return [];
  }

  private withTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(value => Number(value));
    const result = new Date(date);
    result.setHours(hours || 9, minutes || 0, 0, 0);
    return result;
  }

  private addBusinessDays(date: Date, days: number): Date {
    const result = new Date(date);
    let remaining = days;
    while (remaining > 0) {
      result.setDate(result.getDate() + 1);
      const day = result.getDay();
      if (day !== 0 && day !== 6) {
        remaining -= 1;
      }
    }
    return result;
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 42);
  }

  private pickRoom(groupNumber: number, city: string, roomMode: string): string {
    if (roomMode === 'online') {
      return 'MS Teams / LMS';
    }
    const rooms = city === 'Astana' ? ['Astana room 201', 'Astana room 304'] : ['901', '904', 'Conference room'];
    return rooms[(groupNumber - 1) % rooms.length];
  }

  private pickTrainer(groupNumber: number, trainerMode: string): string {
    if (trainerMode === 'external') {
      return 'External provider';
    }
    const trainers = ['Internal trainer A', 'Internal trainer B', 'Certified trainer'];
    return trainers[(groupNumber - 1) % trainers.length];
  }

  private createSeedRequests(): Array<LearningRequest> {
    return [
      {
        id: 'seed-digital-learning',
        title: 'Digital Learning Strategy',
        trainingTemplateIds: ['digital-learning-strategy'],
        trainingTitles: ['Digital Learning Strategy'],
        requester: 'Темирлан Амирханов',
        owner: 'Training Academy',
        department: 'Training Academy',
        city: 'Almaty',
        peopleCount: 12,
        periodFrom: '2026-07-01',
        periodTo: '2026-08-15',
        format: 'Смешанный',
        priority: 'High',
        budget: 'Есть',
        justification: 'Нужно закрыть skill gap по digital learning и подготовить команду к запуску новых онлайн программ.',
        statusKey: 'review',
        createdAt: '2026-06-09T08:00:00.000Z',
        chatMessages: [
          {
            author: 'Training Academy',
            message: 'Уточните, нужен ли внешний провайдер или достаточно внутреннего тренера?',
            date: '09.06.2026 10:30',
          },
          {
            author: 'Темирлан Амирханов',
            message: 'Предпочтительно внутренний тренер, но нужен benchmark по внешнему рынку.',
            date: '09.06.2026 10:42',
          },
        ],
      },
      {
        id: 'seed-customer-experience',
        title: 'Customer Experience Advanced',
        trainingTemplateIds: ['customer-experience-advanced'],
        trainingTitles: ['Customer Experience Advanced'],
        requester: 'Темирлан Амирханов',
        owner: 'Training Academy',
        department: 'Commercial',
        city: 'Almaty',
        peopleCount: 24,
        periodFrom: '2026-07-10',
        periodTo: '2026-09-30',
        format: 'Класс',
        priority: 'Medium',
        budget: 'Есть',
        justification: 'Нужно обновить клиентский сервис для супервайзеров.',
        statusKey: 'clarify',
        createdAt: '2026-06-08T08:00:00.000Z',
        chatMessages: [
          {
            author: 'Training Academy',
            message: 'Нужны точная целевая аудитория и уровень текущих навыков.',
            date: '08.06.2026 15:10',
          },
        ],
      },
      {
        id: 'seed-external-provider',
        title: 'External facilitation provider',
        trainingTemplateIds: ['leadership-workshop'],
        trainingTitles: ['Leadership Workshop'],
        requester: 'Темирлан Амирханов',
        owner: 'Planner queue',
        department: 'Training Academy',
        city: 'Almaty',
        peopleCount: 8,
        periodFrom: '2026-09-01',
        periodTo: '2026-09-30',
        format: 'Внешний поставщик',
        priority: 'High',
        budget: 'Нужно найти поставщика',
        justification: 'Нужен внешний фасилитатор для стратегической сессии.',
        statusKey: 'approved',
        planningStatus: 'notStarted',
        plannerHidden: false,
        createdAt: '2026-06-07T08:00:00.000Z',
        chatMessages: [
          {
            author: 'Training Academy',
            message: 'Заявка подтверждена и передана планеру.',
            date: '07.06.2026 14:20',
          },
        ],
      },
    ];
  }

  private getStatusMessage(statusKey: LearningRequestStatus): string {
    switch (statusKey) {
      case 'approved':
        return 'Заявка подтверждена и передана планеру.';
      case 'review':
        return 'Заявка находится на рассмотрении Training Academy.';
      case 'clarify':
        return 'Требуется уточнение по заявке. Ответьте в чате.';
      case 'rejected':
        return 'Заявка отклонена. Причина и альтернативы указаны в карточке заявки.';
      default:
        return 'Заявка создана.';
    }
  }

  private formatDateTime(date: Date): string {
    return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  }
}
