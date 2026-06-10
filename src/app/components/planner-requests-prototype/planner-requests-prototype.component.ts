import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  LearningRequest,
  LearningRequestPrototypeService,
  ManualLearningPlanGroupAssignment,
  ManualLearningPlanModule,
  PlannerAutoCreateOptions,
  PlannerDraft,
} from '@components/learning-requests-prototype/learning-request-prototype.service';
import { Subscription } from 'rxjs';

interface ModalInfo {
  title: string;
  subtitle: string;
  details: Array<[string, string]>;
}

interface LearningPlanTemplate {
  id: string;
  title: string;
  description: string;
  modules: Array<ManualLearningPlanModule>;
}

@Component({
  selector: 'app-planner-requests-prototype',
  templateUrl: './planner-requests-prototype.component.html',
  styleUrls: ['../requests-prototype/requests-prototype.component.scss'],
  standalone: false,
})
export class PlannerRequestsPrototypeComponent implements OnInit, OnDestroy {
  public requests: Array<LearningRequest> = [];
  public plannerDrafts: Array<PlannerDraft> = [];
  public toastText: string = '';
  public modalOpen: boolean = false;
  public showHiddenRequests: boolean = false;
  public manualPlanRequestId: string = '';
  public openManualGroups: Record<number, boolean> = { 1: true };
  public plannerSections = {
    queue: true,
    manual: true,
    auto: false,
  };
  public selectedModal: ModalInfo = { title: '', subtitle: '', details: [] };

  public plannerOptions = {
    groupSize: 12,
    durationHours: 4,
    startTime: '09:00',
    roomMode: 'auto',
    trainerMode: 'internal',
  };

  public autoPlanForm: PlannerAutoCreateOptions = {
    requestId: '',
    trainingTemplateId: '',
    startDate: '2026-07-01',
    startTime: '09:00',
    durationHours: 4,
    groupSize: 12,
    groupCount: 2,
    room: 'auto',
    trainer: 'Internal trainer A',
  };

  public manualPlanForm = {
    planId: 'newcomer-20-days',
    groupCount: 3,
    groupSize: 12,
    city: 'Almaty',
    periodFrom: '2026-07-01',
    periodTo: '2026-07-28',
    startTime: '09:00',
    roomMode: 'auto',
  };

  public manualPlanGroups: Array<ManualLearningPlanGroupAssignment> = [
    { groupNumber: 1, trainer: 'Internal trainer A', participants: 12 },
    { groupNumber: 2, trainer: 'Internal trainer B', participants: 12 },
    { groupNumber: 3, trainer: 'Certified trainer', participants: 12 },
  ];

  public readonly learningPlanTemplates: Array<LearningPlanTemplate> = [
    {
      id: 'newcomer-20-days',
      title: 'Адаптация нового сотрудника - 20 дней',
      description: 'Учебный план состоит из 20 последовательных дней обучения: вводный день, онлайн-программа, безопасность, IT, сервис и практика.',
      modules: [
        { day: 1, title: 'Orientation Day', durationHours: 6, format: 'Класс' },
        { day: 2, title: 'Orientation Program', durationHours: 4, format: 'Онлайн' },
        { day: 3, title: 'Охрана труда', durationHours: 4, format: 'Класс' },
        { day: 4, title: 'IT Security', durationHours: 3, format: 'Онлайн' },
        { day: 5, title: 'Security Awareness', durationHours: 4, format: 'Онлайн' },
        { day: 6, title: 'Service Excellence', durationHours: 5, format: 'Класс' },
        { day: 7, title: 'Human Factors Initial', durationHours: 4, format: 'Класс' },
        { day: 8, title: 'Dangerous Goods Basics', durationHours: 4, format: 'Класс' },
        { day: 9, title: 'Emergency Response', durationHours: 5, format: 'Класс' },
        { day: 10, title: 'CRM Basics', durationHours: 4, format: 'Класс' },
        { day: 11, title: 'TRMS Navigation', durationHours: 3, format: 'Онлайн' },
        { day: 12, title: 'Customer Experience Practice', durationHours: 5, format: 'Класс' },
        { day: 13, title: 'Compliance Basics', durationHours: 4, format: 'Онлайн' },
        { day: 14, title: 'Role Matrix Briefing', durationHours: 4, format: 'Класс' },
        { day: 15, title: 'Operational Procedures', durationHours: 5, format: 'Класс' },
        { day: 16, title: 'Practical Case Day', durationHours: 6, format: 'Класс' },
        { day: 17, title: 'Knowledge Check', durationHours: 3, format: 'Онлайн' },
        { day: 18, title: 'Supervisor Feedback', durationHours: 3, format: 'Класс' },
        { day: 19, title: 'Final Assessment', durationHours: 4, format: 'Класс' },
        { day: 20, title: 'Graduation and Enrollment Close', durationHours: 3, format: 'Класс' },
      ],
    },
    {
      id: 'safety-recurrent',
      title: 'Пакет повторного обучения по безопасности',
      description: 'Короткий учебный план для recurrent обучения по обязательным safety-навыкам.',
      modules: [
        { day: 1, title: 'Safety Refresher', durationHours: 4, format: 'Класс' },
        { day: 2, title: 'Dangerous Goods Recurrent', durationHours: 4, format: 'Класс' },
        { day: 3, title: 'Emergency Response Recurrent', durationHours: 4, format: 'Класс' },
        { day: 4, title: 'Security Awareness Recurrent', durationHours: 3, format: 'Онлайн' },
        { day: 5, title: 'Final Knowledge Check', durationHours: 3, format: 'Онлайн' },
      ],
    },
    {
      id: 'service-mastery',
      title: 'Трек Сервисное мастерство',
      description: 'Учебный план для развития клиентского сервиса и практики коммуникации.',
      modules: [
        { day: 1, title: 'Service Excellence', durationHours: 5, format: 'Класс' },
        { day: 2, title: 'Customer Experience Advanced', durationHours: 5, format: 'Класс' },
        { day: 3, title: 'Difficult Conversation Practice', durationHours: 4, format: 'Класс' },
        { day: 4, title: 'Case Simulation', durationHours: 6, format: 'Класс' },
        { day: 5, title: 'Final Feedback Session', durationHours: 3, format: 'Класс' },
      ],
    },
  ];

  private toastTimer: ReturnType<typeof setTimeout>;
  private readonly subscriptions = new Subscription();

  public readonly modalData: Record<string, ModalInfo> = {
    requestRules: {
      title: 'Процесс планирования',
      subtitle: 'Подтвержденная заявка переходит в очередь планера',
      details: [
        ['Очередь планера', 'Планер видит подтвержденные заявки и может превратить их в группы и черновики календаря.'],
        ['Учебный план', 'Планер выбирает учебный план, количество групп, период и тренера на каждую группу.'],
        ['Проверка', 'После генерации планер смотрит все дни, события, аудитории и тренеров, затем подтверждает корректность.'],
        ['Календарь', 'После подтверждения черновики передаются в TRMS Calendar и доступны для drag and drop.'],
      ],
    },
    autoPlanPreview: {
      title: 'Предпросмотр автопланирования',
      subtitle: 'Симуляция конфликтов перед созданием событий',
      details: [
        ['Занятая аудитория', '902 недоступна в выбранные даты, система предлагает 901 или Conference room.'],
        ['Конфликт тренера', 'Internal trainer A перегружен на выбранной неделе.'],
        ['Альтернатива', 'Разделить группы на две недели или подключить Certified trainer.'],
        ['Статус', 'План можно создать с изменениями и затем проверить на календаре.'],
      ],
    },
  };

  constructor(
    private readonly learningRequestService: LearningRequestPrototypeService,
    private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    this.subscriptions.add(
      this.learningRequestService.requests$.subscribe(requests => {
        this.requests = requests;
        this.syncAutoPlanForm();
      }),
    );
    this.subscriptions.add(
      this.learningRequestService.plannerDrafts$.subscribe(drafts => {
        this.plannerDrafts = drafts;
      }),
    );
  }

  public ngOnDestroy(): void {
    clearTimeout(this.toastTimer);
    this.subscriptions.unsubscribe();
  }

  public get approvedRequests(): Array<LearningRequest> {
    return this.requests.filter(request => request.statusKey === 'approved' && !request.plannerHidden);
  }

  public get hiddenPlannerRequests(): Array<LearningRequest> {
    return this.requests.filter(request => request.statusKey === 'approved' && request.plannerHidden);
  }

  public get calendarDraftCount(): number {
    return this.plannerDrafts.filter(draft => draft.status === 'sentToCalendar').length;
  }

  public get draftCount(): number {
    return this.plannerDrafts.length;
  }

  public get completedCount(): number {
    return this.requests.filter(request => request.planningStatus === 'completed').length;
  }

  public get availableRooms(): Array<string> {
    return this.learningRequestService.availableRooms;
  }

  public get availableTrainers(): Array<string> {
    return this.learningRequestService.availableTrainers;
  }

  public get selectedLearningPlan(): LearningPlanTemplate {
    return this.learningPlanTemplates.find(plan => plan.id === this.manualPlanForm.planId) ?? this.learningPlanTemplates[0];
  }

  public get manualPlanDrafts(): Array<PlannerDraft> {
    return this.manualPlanRequestId ? this.plannerDraftsByRequestId(this.manualPlanRequestId) : [];
  }

  public get groupedManualPlanDrafts(): Array<{ groupNumber: number; drafts: Array<PlannerDraft> }> {
    const groups = new Map<number, Array<PlannerDraft>>();
    this.manualPlanDrafts.forEach(draft => {
      const items = groups.get(draft.groupNumber) ?? [];
      items.push(draft);
      groups.set(draft.groupNumber, items);
    });
    return Array.from(groups.entries())
      .sort(([left], [right]) => left - right)
      .map(([groupNumber, drafts]) => ({
        groupNumber,
        drafts: drafts.sort((left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime()),
      }));
  }

  public get selectedAutoRequest(): LearningRequest {
    return this.requests.find(request => request.id === this.autoPlanForm.requestId) ?? this.approvedRequests[0] ?? null;
  }

  public get autoTrainingOptions(): Array<{ id: string; title: string }> {
    const request = this.selectedAutoRequest;
    if (!request) {
      return [];
    }
    return request.trainingTemplateIds.map((id, index) => ({
      id,
      title: request.trainingTitles[index] ?? request.trainingTitles[0] ?? request.title,
    }));
  }

  public plannerDraftsByRequest(request: LearningRequest): Array<PlannerDraft> {
    return this.plannerDraftsByRequestId(request.id);
  }

  public plannerDraftsByRequestId(requestId: string): Array<PlannerDraft> {
    return this.plannerDrafts.filter(draft => draft.requestId === requestId);
  }

  public planProgress(request: LearningRequest): string {
    if (request.planningStatus === 'completed') {
      return 'Планирование завершено';
    }
    const drafts = this.plannerDraftsByRequest(request);
    if (!drafts.length) {
      return 'Не запланировано';
    }
    const sent = drafts.filter(draft => draft.status === 'sentToCalendar').length;
    return sent ? `В календаре: ${sent}/${drafts.length}` : `Черновики: ${drafts.length}`;
  }

  public generatePlan(request: LearningRequest): void {
    const drafts = this.learningRequestService.generatePlannerDrafts(request.id, this.plannerOptions);
    this.showToast(`Сформировано черновиков: ${drafts.length}`);
  }

  public sendPlanToCalendar(request: LearningRequest): void {
    if (!this.plannerDraftsByRequest(request).length) {
      this.generatePlan(request);
    }
    this.learningRequestService.sendDraftsToCalendar(request.id);
    this.showToast('Пакет передан в общий календарь');
  }

  public completePlanning(request: LearningRequest): void {
    if (!this.plannerDraftsByRequest(request).length) {
      this.generatePlan(request);
    }
    this.learningRequestService.completePlannerRequest(request.id);
    this.showToast('Планирование завершено, заявка скрыта из активной очереди');
  }

  public restoreToQueue(request: LearningRequest): void {
    this.learningRequestService.setPlannerHidden(request.id, false);
    this.showToast('Заявка возвращена в очередь планера');
  }

  public togglePlannerSection(section: keyof PlannerRequestsPrototypeComponent['plannerSections']): void {
    this.plannerSections[section] = !this.plannerSections[section];
  }

  public hideFromQueue(request: LearningRequest): void {
    this.learningRequestService.setPlannerHidden(request.id, true);
    this.showToast('Заявка скрыта из очереди планера');
  }

  public onAutoRequestChange(): void {
    this.autoPlanForm.trainingTemplateId = this.autoTrainingOptions[0]?.id ?? '';
  }

  public onManualGroupCountChange(): void {
    const groupCount = Math.max(Number(this.manualPlanForm.groupCount) || 1, 1);
    const current = [...this.manualPlanGroups];
    this.manualPlanGroups = Array.from({ length: groupCount }, (_, index) => {
      const groupNumber = index + 1;
      return (
        current[index] ?? {
          groupNumber,
          trainer: this.availableTrainers[index % this.availableTrainers.length],
          participants: Number(this.manualPlanForm.groupSize) || 12,
        }
      );
    }).map((group, index) => ({ ...group, groupNumber: index + 1 }));
  }

  public applyGroupSizeToGroups(): void {
    this.manualPlanGroups = this.manualPlanGroups.map(group => ({
      ...group,
      participants: Number(this.manualPlanForm.groupSize) || group.participants,
    }));
  }

  public createLearningPlan(): void {
    this.onManualGroupCountChange();
    const handoff = this.learningRequestService.createManualLearningPlanDrafts({
      planTitle: this.selectedLearningPlan.title,
      city: this.manualPlanForm.city,
      periodFrom: this.manualPlanForm.periodFrom,
      periodTo: this.manualPlanForm.periodTo,
      startTime: this.manualPlanForm.startTime,
      roomMode: this.manualPlanForm.roomMode,
      groups: this.manualPlanGroups,
      modules: this.selectedLearningPlan.modules,
    });
    this.manualPlanRequestId = handoff.request.id;
    this.openManualGroups = this.manualPlanGroups.reduce(
      (state, group) => ({
        ...state,
        [group.groupNumber]: group.groupNumber === 1,
      }),
      {},
    );
    this.showToast(`Учебный план создан: ${handoff.drafts.length} событий для проверки`);
  }

  public toggleManualGroup(groupNumber: number): void {
    this.openManualGroups = {
      ...this.openManualGroups,
      [groupNumber]: !this.openManualGroups[groupNumber],
    };
  }

  public confirmManualLearningPlan(): void {
    if (!this.manualPlanRequestId || !this.manualPlanDrafts.length) {
      this.createLearningPlan();
    }
    this.learningRequestService.sendDraftsToCalendar(this.manualPlanRequestId);
    this.learningRequestService.completePlannerRequest(this.manualPlanRequestId);
    this.showToast('Планер подтвердил учебный план. События переданы в календарь');
  }

  public openManualPlanCalendar(): void {
    if (!this.manualPlanRequestId || !this.manualPlanDrafts.length) {
      this.createLearningPlan();
    }
    this.learningRequestService.setCalendarHandoff(this.manualPlanRequestId);
    this.router.navigate(['gant']);
  }

  public createAutoCalendarEvents(): void {
    if (!this.autoPlanForm.requestId || !this.autoPlanForm.trainingTemplateId) {
      this.showToast('Выберите заявку и тренинг для автосоздания');
      return;
    }
    const handoff = this.learningRequestService.createCalendarDraftsFromCriteria(this.autoPlanForm);
    if (!handoff?.drafts?.length) {
      this.showToast('Не удалось создать события календаря');
      return;
    }
    this.showToast(`Создано событий на календаре: ${handoff.drafts.length}`);
    this.router.navigate(['gant']);
  }

  public openCalendarForRequest(request: LearningRequest): void {
    if (!this.plannerDraftsByRequest(request).length) {
      this.generatePlan(request);
    }
    this.learningRequestService.setCalendarHandoff(request.id);
    this.router.navigate(['gant']);
  }

  public updateDraft(draft: PlannerDraft, patch: Partial<PlannerDraft>): void {
    this.learningRequestService.updatePlannerDraft(draft.id, patch);
  }

  public updateDraftStart(draft: PlannerDraft, value: string): void {
    const startDate = new Date(value);
    const currentStart = new Date(draft.startDate);
    const currentEnd = new Date(draft.endDate);
    const durationMs = currentEnd.getTime() - currentStart.getTime();
    const endDate = new Date(startDate.getTime() + durationMs);
    this.updateDraft(draft, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'draft',
    });
  }

  public updateDraftDuration(draft: PlannerDraft, hours: number): void {
    const startDate = new Date(draft.startDate);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + Number(hours || 1));
    this.updateDraft(draft, {
      endDate: endDate.toISOString(),
      status: 'draft',
    });
  }

  public draftDateTimeValue(value: string): string {
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  public draftDurationHours(draft: PlannerDraft): number {
    const startDate = new Date(draft.startDate);
    const endDate = new Date(draft.endDate);
    return Math.max(Math.round((endDate.getTime() - startDate.getTime()) / 3600000), 1);
  }

  public runAutoPlan(): void {
    this.createAutoCalendarEvents();
  }

  public openModal(key: string, event?: Event): void {
    event?.stopPropagation();
    const data = this.modalData[key];
    if (!data) {
      return;
    }
    this.selectedModal = data;
    this.modalOpen = true;
  }

  public closeModal(): void {
    this.modalOpen = false;
  }

  private showToast(message: string): void {
    clearTimeout(this.toastTimer);
    this.toastText = message;
    this.toastTimer = setTimeout(() => {
      this.toastText = '';
    }, 2200);
  }

  private syncAutoPlanForm(): void {
    const request =
      this.requests.find(item => item.id === this.autoPlanForm.requestId && item.statusKey === 'approved') ??
      this.approvedRequests[0];

    if (!request) {
      this.autoPlanForm.requestId = '';
      this.autoPlanForm.trainingTemplateId = '';
      return;
    }

    this.autoPlanForm.requestId = request.id;
    if (!request.trainingTemplateIds.includes(this.autoPlanForm.trainingTemplateId)) {
      this.autoPlanForm.trainingTemplateId = request.trainingTemplateIds[0] ?? '';
    }
    this.autoPlanForm.startDate = request.periodFrom || this.autoPlanForm.startDate;
    this.autoPlanForm.groupSize = Number(this.autoPlanForm.groupSize) || Math.min(request.peopleCount, 12);
  }
}
