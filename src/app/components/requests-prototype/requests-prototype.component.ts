import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  LearningRequest,
  LearningRequestPrototypeService,
  LearningRequestStatus,
} from '@components/learning-requests-prototype/learning-request-prototype.service';
import { Subscription } from 'rxjs';

type AcademyRequestStatus = Exclude<LearningRequestStatus, 'new'>;
type RequestStatusFilter = LearningRequestStatus | 'all';

interface ModalInfo {
  title: string;
  subtitle: string;
  details: Array<[string, string]>;
}

interface StatusConfig {
  label: string;
  className: string;
  title: string;
  text: string;
  toast: string;
}

@Component({
  selector: 'app-requests-prototype',
  templateUrl: './requests-prototype.component.html',
  styleUrls: ['./requests-prototype.component.scss'],
  standalone: false,
})
export class RequestsPrototypeComponent implements OnInit, OnDestroy {
  public activeRequestIndex: number = 0;
  public selectedRequestId: string = '';
  public requestSearch: string = '';
  public requestStatusFilter: RequestStatusFilter = 'all';
  public priorityFilter: string = 'all';
  public toastText: string = '';
  public modalOpen: boolean = false;
  public chatText: string = '';
  public approvedCount: number = 5;
  public clarifyCount: number = 3;
  public plannedCount: number = 0;
  public requests: Array<LearningRequest> = [];
  public selectedModal: ModalInfo = { title: '', subtitle: '', details: [] };
  public requestSections = {
    review: true,
    notifications: true,
    chat: true,
  };
  private toastTimer: ReturnType<typeof setTimeout>;
  private readonly subscriptions = new Subscription();

  constructor(private readonly learningRequestService: LearningRequestPrototypeService) {}

  public readonly statusConfig: Record<AcademyRequestStatus, StatusConfig> = {
    approved: {
      label: 'В работе',
      className: 'pill',
      title: 'Заявка подтверждена',
      text: 'Ваша заявка принята Академией обучения и передана в очередь планера.',
      toast: 'Заявка подтверждена и передана планеру',
    },
    review: {
      label: 'На рассмотрении',
      className: 'pill warn',
      title: 'На рассмотрении',
      text: 'Ваша заявка рассматривается Академией обучения. Ожидаемый срок ответа: 2 рабочих дня.',
      toast: 'Статус заявки: на рассмотрении',
    },
    clarify: {
      label: 'Уточнение',
      className: 'pill blue',
      title: 'Требуется уточнение',
      text: 'Академии обучения нужны дополнительные данные. Ответьте в чате заявки.',
      toast: 'Запрошено уточнение у инициатора',
    },
    rejected: {
      label: 'Отказ',
      className: 'pill bad',
      title: 'Заявка отклонена',
      text: 'Заявка отклонена. Инициатор получает причину и рекомендованные альтернативы.',
      toast: 'Заявка отклонена, уведомление отправлено',
    },
  };

  private readonly legacyRequests: Array<any> = [
    {
      title: 'Обновление клиентского сервиса для супервайзеров',
      meta: 'Коммерческий блок · 24 человека · Алматы · 3 квартал 2026',
      initiator: 'Инициатор: руководитель департамента',
      priority: 'Высокий',
      statusKey: 'review',
      modalKey: 'requestDetails',
    },
    {
      title: 'Продвинутый Excel и основы Power BI',
      meta: 'Финансы · 18 человек · онлайн/офлайн',
      initiator: 'Бюджет: есть',
      priority: 'Средний',
      statusKey: 'clarify',
      modalKey: 'requestFinance',
    },
    {
      title: 'Повторное обучение по опасным грузам',
      meta: 'Операции · 36 человек · обязательная матрица',
      initiator: 'Бюджет: внутренний',
      priority: 'Обязательная',
      statusKey: 'new',
      modalKey: 'requestDg',
    },
  ];

  public modalData: Record<string, ModalInfo> = {
    requestRules: {
      title: 'Процесс заявки',
      subtitle: 'Внутренний процесс Академии обучения',
      details: [
        ['Новая', 'Заявка появляется в очереди рассмотрения'],
        ['На рассмотрении', 'Менеджер обучения проверяет бюджет, аудиторию, даты и тип тренинга'],
        ['Уточнение', 'Инициатор получает сообщение в чате и список недостающих полей'],
        ['Подтверждено', 'Потребность уходит в очередь планера'],
        ['Отказ', 'Инициатор получает причину и альтернативную рекомендацию'],
      ],
    },
    requestDetails: {
      title: 'Заявка на обучение',
      subtitle: 'Обновление клиентского сервиса для супервайзеров',
      details: [
        ['Инициатор', 'Руководитель департамента'],
        ['Количество людей', '24'],
        ['Предпочтительные даты', '3 квартал 2026'],
        ['Приоритет', 'Высокий'],
        ['Бюджет', 'Подтвержден'],
        ['Следующий шаг', 'Подтвердить или запросить уточнение'],
      ],
    },
    requestFinance: {
      title: 'Заявка на обучение',
      subtitle: 'Продвинутый Excel и основы Power BI',
      details: [
        ['Инициатор', 'Финансовый менеджер'],
        ['Количество людей', '18'],
        ['Формат', 'онлайн/офлайн'],
        ['Бюджет', 'Да'],
        ['Не хватает данных', 'Нужны точная целевая аудитория и уровень навыков'],
      ],
    },
    requestDg: {
      title: 'Заявка на обучение',
      subtitle: 'Повторное обучение по опасным грузам',
      details: [
        ['Инициатор', 'Руководитель операций'],
        ['Количество людей', '36'],
        ['Тип', 'Обязательный повторный'],
        ['Требование', 'Сертифицированный тренер'],
        ['Риск планирования', 'Емкость тренеров'],
      ],
    },
  };

  public ngOnInit(): void {
    this.subscriptions.add(
      this.learningRequestService.requests$.subscribe(requests => {
        this.requests = requests;
        if (!this.selectedRequestId && requests.length) {
          this.selectedRequestId = requests[0].id;
        }
        if (this.selectedRequestId && !requests.some(request => request.id === this.selectedRequestId)) {
          this.selectedRequestId = requests[0]?.id ?? '';
        }
        this.approvedCount = requests.filter(request => request.statusKey === 'approved').length;
        this.clarifyCount = requests.filter(request => request.statusKey === 'clarify').length;
        this.plannedCount = requests.filter(request => request.planningStatus === 'completed').length;
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get activeRequest(): LearningRequest {
    return this.requests.find(request => request.id === this.selectedRequestId) ?? this.filteredRequests[0] ?? this.requests[0] ?? null;
  }

  public get notification(): StatusConfig {
    if (!this.activeRequest) {
      return this.statusConfig.review;
    }
    const status = this.activeRequest.statusKey === 'new' ? 'review' : this.activeRequest.statusKey;
    return this.statusConfig[status];
  }

  public get requestNewCount(): number {
    return this.requests.filter(request => request.statusKey === 'new' || request.statusKey === 'review').length;
  }

  public get activeRequestMessages() {
    return this.activeRequest?.chatMessages ?? [];
  }

  public get filteredRequests(): Array<LearningRequest> {
    const query = this.requestSearch.trim().toLowerCase();
    return this.requests.filter(request => {
      const matchesStatus = this.requestStatusFilter === 'all' || request.statusKey === this.requestStatusFilter;
      const matchesPriority = this.priorityFilter === 'all' || request.priority === this.priorityFilter;
      const text = [
        request.title,
        request.trainingTitles.join(' '),
        request.requester,
        request.department,
        request.city,
        request.priority,
        this.statusLabel(request),
        this.planningLabel(request),
      ]
        .join(' ')
        .toLowerCase();
      return matchesStatus && matchesPriority && (!query || text.includes(query));
    });
  }

  public get uniquePriorities(): Array<string> {
    return Array.from(new Set(this.requests.map(request => request.priority))).filter(Boolean);
  }

  public selectRequest(request: LearningRequest): void {
    this.selectedRequestId = request.id;
    this.showToast('Заявка выбрана');
  }

  public setStatusFilter(status: RequestStatusFilter): void {
    this.requestStatusFilter = status;
  }

  public clearFilters(): void {
    this.requestSearch = '';
    this.requestStatusFilter = 'all';
    this.priorityFilter = 'all';
  }

  public toggleRequestSection(section: keyof RequestsPrototypeComponent['requestSections']): void {
    this.requestSections[section] = !this.requestSections[section];
  }

  public setRequestStatus(status: AcademyRequestStatus): void {
    if (!this.activeRequest) {
      return;
    }
    this.learningRequestService.updateStatus(this.activeRequest.id, status);
    this.showToast(this.statusConfig[status].toast);
  }

  public statusLabel(request: LearningRequest): string {
    return request.statusKey === 'new' ? 'Новая' : this.statusConfig[request.statusKey].label;
  }

  public statusClass(request: LearningRequest): string {
    return request.statusKey === 'new' ? 'pill gray' : this.statusConfig[request.statusKey].className;
  }

  public planningLabel(request: LearningRequest): string {
    if (request.statusKey !== 'approved') {
      return 'Планирование не начато';
    }
    switch (request.planningStatus) {
      case 'completed':
        return 'Планирование завершено';
      case 'calendar':
        return 'Передано в календарь';
      case 'drafts':
        return 'Сформированы черновики';
      default:
        return 'Ожидает планера';
    }
  }

  public planningClass(request: LearningRequest): string {
    switch (request.planningStatus) {
      case 'completed':
        return 'pill';
      case 'calendar':
        return 'pill blue';
      case 'drafts':
        return 'pill warn';
      default:
        return 'pill gray';
    }
  }

  public planningText(request: LearningRequest): string {
    if (request.planningStatus === 'completed') {
      return request.plannerSummary || 'Планер завершил планирование. Инициатор и утверждающий менеджер видят итог по тренингам.';
    }
    if (request.planningStatus === 'calendar') {
      return 'Планер передал события в календарь. После финальной проверки заявка будет закрыта планером.';
    }
    if (request.planningStatus === 'drafts') {
      return 'Планер сформировал группы и уточняет ресурсы: аудитории, тренеров и оборудование.';
    }
    return 'После подтверждения заявка ожидает действий планера.';
  }

  public requestMeta(request: LearningRequest): string {
    return `${request.department} · ${request.peopleCount} чел. · ${request.city} · ${request.periodFrom} - ${request.periodTo}`;
  }

  public requestInitiator(request: LearningRequest): string {
    return `${request.requester} · бюджет: ${request.budget}`;
  }

  public requestTrainingList(request: LearningRequest): string {
    return request.trainingTitles.join(', ');
  }

  public openModal(key: string, event?: Event): void {
    event?.stopPropagation();
    const request = this.learningRequestService.getRequestById(key);
    const data = request ? this.buildRequestModal(request) : this.modalData[key];
    if (!data) {
      return;
    }
    this.selectedModal = data;
    this.modalOpen = true;
  }

  public closeModal(): void {
    this.modalOpen = false;
  }

  public sendChat(): void {
    if (!this.chatText.trim()) {
      this.showToast('Введите сообщение для уточнения');
      return;
    }
    if (!this.activeRequest) {
      return;
    }
    this.learningRequestService.addChatMessage(this.activeRequest.id, 'Training Academy', this.chatText.trim());
    this.chatText = '';
    this.setRequestStatus('clarify');
  }

  private buildRequestModal(request: LearningRequest): ModalInfo {
    return {
      title: 'Заявка на обучение',
      subtitle: request.title,
      details: [
        ['Инициатор', request.requester],
        ['Тренинги из справочника', request.trainingTitles.join(', ')],
        ['Количество людей', `${request.peopleCount}`],
        ['Период', `${request.periodFrom} - ${request.periodTo}`],
        ['Формат', request.format],
        ['Приоритет', request.priority],
        ['Бюджет', request.budget],
        ['Обоснование', request.justification],
        ['Статус', this.statusLabel(request)],
      ],
    };
  }

  private showToast(message: string): void {
    clearTimeout(this.toastTimer);
    this.toastText = message;
    this.toastTimer = setTimeout(() => {
      this.toastText = '';
    }, 2200);
  }
}
