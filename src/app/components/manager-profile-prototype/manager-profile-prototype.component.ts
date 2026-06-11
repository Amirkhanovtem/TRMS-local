import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  LearningRequest,
  LearningRequestPrototypeService,
  TrainingOption,
} from '@components/learning-requests-prototype/learning-request-prototype.service';
import {
  FeedbackAssignment,
  FeedbackPrototypeService,
  FeedbackResponse,
} from '@components/feedback-prototype/feedback-prototype.service';
import { Subscription } from 'rxjs';

type ManagerPage = 'self' | 'team' | 'requests' | 'feedback' | 'dashboards' | 'reports';
type RequestStatusFilter = LearningRequest['statusKey'] | 'all';

interface ModalInfo {
  kicker: string;
  title: string;
  details: Array<[string, string]>;
}

interface Employee {
  initials: string;
  name: string;
  position: string;
  grade: string;
  progress: number;
  hours: number;
  certificates: Array<[string, string, string]>;
  trainings: Array<[string, string, string, string]>;
}

@Component({
  selector: 'app-manager-profile-prototype',
  templateUrl: './manager-profile-prototype.component.html',
  styleUrls: ['./manager-profile-prototype.component.scss'],
  standalone: false,
})
export class ManagerProfilePrototypeComponent implements OnInit, OnDestroy {
  public activePage: ManagerPage = 'self';
  public selectedEmployeeIndex: number = 0;
  public modalOpen: boolean = false;
  public toastText: string = '';
  public selectedModal: ModalInfo = { kicker: '', title: '', details: [] };
  public chatText: string = '';
  public employeeSearch: string = '';
  public reportFilter: string = 'Все';
  public requestSearch: string = '';
  public requestStatusFilter: RequestStatusFilter = 'all';
  public selectedManagerRequestId: string = '';
  public trainingOptions: Array<TrainingOption> = [];
  public requests: Array<LearningRequest> = [];

  public managerRequestSections = {
    newRequest: true,
    statuses: true,
    chat: true,
  };

  public departmentOptions: Array<string> = [
    'Training Academy',
    'Operations',
    'IT',
    'Finance',
    'Commercial',
    'Другое',
  ];

  public departmentTrainingMap: Record<string, Array<string>> = {
    'Training Academy': ['digital-learning-strategy', 'leadership-workshop', 'power-bi-basics'],
    Operations: ['security-awareness-2026', 'dangerous-goods-recurrent', 'customer-experience-advanced'],
    IT: ['security-awareness-2026', 'power-bi-basics', 'digital-learning-strategy'],
    Finance: ['power-bi-basics', 'leadership-workshop'],
    Commercial: ['customer-experience-advanced', 'leadership-workshop'],
  };

  public requestForm = {
    department: 'Training Academy',
    selectedTrainingTemplateIds: ['digital-learning-strategy'],
    customTrainingTitle: '',
    periodFrom: '2026-07-01',
    periodTo: '2026-08-15',
    format: 'Смешанный',
    priority: 'High',
    peopleCount: 12,
    city: 'Almaty',
    budget: 'Есть',
    justification:
      'Нужно закрыть skill gap по digital learning и подготовить команду к запуску новых онлайн программ.',
  };

  public subtitles: Record<ManagerPage, string> = {
    self: 'Мой профиль руководителя, часы обучения, матрица позиции и рекомендации.',
    team: 'Прямое подчинение, профиль сотрудника, сертификаты, тренинги, рекомендации и зачисление.',
    requests: 'Заявки в Training Academy, статусы рассмотрения, приоритеты и чат.',
    feedback: 'Feedback по команде: ожидающие опросы, QR, NPS и ответы участников.',
    dashboards: 'Power BI зона: тренинги, часы, сотрудники, тренеры, online/offline learning analytics.',
    reports: 'Табличные отчеты с выгрузкой по TRMS и онлайн-платформе.',
  };

  public employees: Array<Employee> = [
    {
      initials: 'ТА',
      name: 'Темирлан Амирханов',
      position: 'Supervisor Training Systems',
      grade: 'GS.5',
      progress: 72,
      hours: 36,
      trainings: [
        ['Security Awareness 2026', 'online', 'Planned', '01.06.2026'],
        ['Boeing 787 Refresher Course', 'online', 'Passed', '85%'],
        ['Digital Learning Strategy', 'online', 'Recommended', 'Q3'],
      ],
      certificates: [
        ['Security Awareness', 'Active', '01.06.2027'],
        ['HEART Basics', 'Active', '15.04.2027'],
        ['IT Security', 'Expires soon', '18.08.2026'],
      ],
    },
    {
      initials: 'ШЖ',
      name: 'Шерхан Жунусбай',
      position: 'Training coordinator',
      grade: 'GS.4',
      progress: 88,
      hours: 48,
      trainings: [
        ['First Aid Basics', 'offline', 'Passed', '18.05.2026'],
        ['Aviation Security', 'class', 'Passed', '92%'],
        ['Data Reporting in TRMS', 'offline', 'Planned', '12.07.2026'],
      ],
      certificates: [
        ['First Aid', 'Active', '18.05.2027'],
        ['Aviation Security', 'Active', '22.02.2027'],
        ['HEART Basics', 'Active', '15.04.2027'],
      ],
    },
    {
      initials: 'ФА',
      name: 'Фатима Алекперзаде',
      position: 'Instructional designer',
      grade: 'GS.5',
      progress: 51,
      hours: 24,
      trainings: [
        ['Digital Learning Strategy', 'online', 'In progress', '38%'],
        ['Customer Experience Advanced', 'class', 'Not started', 'Q3'],
        ['Security Awareness 2026', 'online', 'Planned', '01.06.2026'],
      ],
      certificates: [
        ['HEART Basics', 'Active', '11.03.2027'],
        ['Instructional Design', 'Expired', '04.05.2026'],
        ['Safety & Emergency', 'Active', '10.10.2026'],
      ],
    },
    {
      initials: 'АО',
      name: 'Аружан Омирзакова',
      position: 'Academy analyst',
      grade: 'GS.3',
      progress: 81,
      hours: 39,
      trainings: [
        ['Data Reporting in TRMS', 'offline', 'Passed', '12.04.2026'],
        ['Power BI Basics', 'online', 'In progress', '61%'],
        ['Security Awareness 2026', 'online', 'Passed', '96%'],
      ],
      certificates: [
        ['Data Reporting', 'Active', '12.04.2027'],
        ['Security Awareness', 'Active', '01.06.2027'],
        ['HEART Basics', 'Active', '18.01.2027'],
      ],
    },
  ];

  public modalData: Record<string, ModalInfo> = {
    managerProfile: {
      kicker: 'Профиль руководителя',
      title: 'Темирлан Амирханов',
      details: [
        ['Position', 'Supervisor Training Systems'],
        ['Subdivision', 'Training Academy'],
        ['Cost center', 'CLD'],
        ['City', 'Almaty'],
        ['TRMS role', 'Manager'],
        ['Direct reports', '4'],
      ],
    },
    notifications: {
      kicker: 'Уведомления',
      title: 'Manager alerts',
      details: [
        ['Заявка', 'Digital Learning Strategy на рассмотрении Training Academy'],
        ['Сертификаты', '3 сотрудника имеют риск просрочки'],
        ['Зачисление', 'Шерхан Жунусбай записан на Data Reporting in TRMS'],
      ],
    },
    aiAssistant: {
      kicker: 'AI assistant',
      title: 'Manager copilot',
      details: [
        ['Подсказка', 'Кому назначить Security Awareness до конца месяца?'],
        ['Ответ', 'Темирлан, Фатима и 2 новых сотрудника'],
        ['Интеграции', 'TRMS + online learning platform'],
      ],
    },
    managerLearningPlan: {
      kicker: 'Next learning journey',
      title: 'Manager Development Plan',
      details: [
        ['Leadership Curriculum', 'В процессе'],
        ['Digital Learning Strategy', 'Следующий шаг'],
        ['Academy Budget Planning', 'Q3'],
        ['People Analytics', 'Рекомендовано'],
      ],
    },
    selfMatrix: {
      kicker: 'Матрица позиции',
      title: 'Supervisor Training Systems',
      details: [
        ['Completed', '68%'],
        ['Required trainings', '11'],
        ['Open trainings', '4'],
        ['Next', 'Digital Learning Strategy'],
      ],
    },
    recommendTraining: {
      kicker: 'Рекомендовать тренинг',
      title: 'Для выбранного сотрудника',
      details: [
        ['Training', 'Digital Learning Strategy'],
        ['Reason', 'Skill gap по online program design'],
        ['Notification', 'Сотрудник получит рекомендацию в Learning Journey'],
        ['Action', 'Рекомендация сохранена'],
      ],
    },
    enrollEmployee: {
      kicker: 'Зачислить сотрудника',
      title: 'Manager enrollment',
      details: [
        ['Training', 'Security Awareness 2026'],
        ['Session', '01.06.2026 - online'],
        ['Employee', 'Выбранный сотрудник'],
        ['Status', 'Зачисление будет создано в TRMS'],
      ],
    },
    powerBiFilters: {
      kicker: 'Power BI filters',
      title: 'Доступные срезы',
      details: [
        ['People', 'Subdivision, cost center, position, grade, gender, age'],
        ['Training', 'Category, type, format, factual status, attendance'],
        ['Certificates', 'Template, issue date, expiry date'],
        ['Trainer', 'Main trainer, linear trainer, internal/external'],
      ],
    },
    onlineOfflineReports: {
      kicker: 'Online/offline reports',
      title: 'Связка отчетов',
      details: [
        ['Offline', 'TRMS attended/completed trainings, certificates'],
        ['Online', 'External LMS completion, scores, attempts'],
        ['Scope', 'My team / selected employee / whole base'],
        ['Export', 'CSV/XLSX from TRMS report page'],
      ],
    },
    dataSources: {
      kicker: 'Источники данных',
      title: 'Ориентир по TRMS',
      details: [
        ['Profile', 'Person, position, company, city, subdivision, cost center'],
        ['Training summary', 'Training template, category, format, status, dates'],
        ['Certificates', 'Certificate template, serial, expiry'],
        ['External LMS', 'Online completions and scores'],
      ],
    },
    trainingSummary: {
      kicker: 'Report',
      title: 'Training summary report',
      details: [
        ['Columns', 'Person, position, cost center, training, status'],
        ['Source', 'TRMS'],
      ],
    },
    onlineSummary: {
      kicker: 'Report',
      title: 'Online learning completion',
      details: [
        ['Columns', 'Course, completion, score, attempts'],
        ['Source', 'Online platform'],
      ],
    },
    certificateExpiry: {
      kicker: 'Report',
      title: 'Certificate expiry report',
      details: [
        ['Columns', 'Employee, certificate, expiry date, status'],
        ['Source', 'TRMS certificates'],
      ],
    },
    trainerLoad: {
      kicker: 'Report',
      title: 'Trainer workload report',
      details: [
        ['Columns', 'Trainer, event, hours, participants'],
        ['Source', 'TRMS calendar'],
      ],
    },
  };

  private toastTimer: ReturnType<typeof setTimeout>;
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly learningRequestService: LearningRequestPrototypeService,
    public readonly feedbackService: FeedbackPrototypeService,
  ) {}

  public ngOnInit(): void {
    this.subscriptions.add(
      this.learningRequestService.trainingOptions$.subscribe(options => {
        this.trainingOptions = options;
        this.ensureTrainingSelectionForDepartment();
      }),
    );

    this.subscriptions.add(
      this.learningRequestService.requests$.subscribe(requests => {
        this.requests = requests;
        if (!this.selectedManagerRequestId && requests.length) {
          this.selectedManagerRequestId = requests[0].id;
        }
      }),
    );
  }

  public ngOnDestroy(): void {
    clearTimeout(this.toastTimer);
    this.subscriptions.unsubscribe();
  }

  public get selectedEmployee(): Employee {
    return this.employees[this.selectedEmployeeIndex] ?? this.employees[0];
  }

  public get filteredTrainingOptions(): Array<TrainingOption> {
    if (this.requestForm.department === 'Другое') {
      return [];
    }

    const allowed = this.departmentTrainingMap[this.requestForm.department] ?? [];
    const filtered = this.trainingOptions.filter(option => {
      const normalizedName = option.name.toLowerCase();
      return allowed.some(item => option.id === item || normalizedName.includes(item.replace(/-/g, ' ')));
    });

    return filtered.length ? filtered : this.trainingOptions.slice(0, 6);
  }

  public get selectedTrainingNames(): Array<string> {
    if (this.requestForm.department === 'Другое') {
      const customName = this.requestForm.customTrainingTitle.trim();
      return customName ? [customName] : [];
    }

    return this.requestForm.selectedTrainingTemplateIds
      .map(id => this.trainingOptions.find(training => training.id === id)?.name)
      .filter(Boolean);
  }

  public get requestFormReady(): boolean {
    return [
      this.requestForm.department,
      this.selectedTrainingNames.length > 0,
      this.requestForm.periodFrom,
      this.requestForm.periodTo,
      this.requestForm.format,
      Number(this.requestForm.peopleCount) > 0,
      this.requestForm.city,
      this.requestForm.justification.trim(),
    ].every(Boolean);
  }

  public get requestFormProgress(): number {
    const checks = [
      this.requestForm.department,
      this.selectedTrainingNames.length > 0,
      this.requestForm.periodFrom,
      this.requestForm.periodTo,
      this.requestForm.format,
      Number(this.requestForm.peopleCount) > 0,
      this.requestForm.city,
      this.requestForm.budget,
      this.requestForm.justification.trim(),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }

  public get requestDraftTitle(): string {
    if (!this.selectedTrainingNames.length) {
      return 'Новая заявка на обучение';
    }
    return this.selectedTrainingNames.length > 1
      ? `${this.selectedTrainingNames[0]} +${this.selectedTrainingNames.length - 1}`
      : this.selectedTrainingNames[0];
  }

  public get filteredManagerRequests(): Array<LearningRequest> {
    const query = this.requestSearch.trim().toLowerCase();
    return this.requests.filter(request => {
      const matchesStatus = this.requestStatusFilter === 'all' || request.statusKey === this.requestStatusFilter;
      const text = [
        request.title,
        request.trainingTitles.join(' '),
        request.owner,
        request.city,
        request.priority,
        request.format,
        request.department,
        this.statusLabel(request.statusKey),
        this.planningLabel(request),
      ]
        .join(' ')
        .toLowerCase();
      return matchesStatus && (!query || text.includes(query));
    });
  }

  public get openRequestCount(): number {
    return this.requests.filter(request => request.statusKey === 'new' || request.statusKey === 'review').length;
  }

  public get clarifyRequestCount(): number {
    return this.requests.filter(request => request.statusKey === 'clarify').length;
  }

  public get approvedRequestCount(): number {
    return this.requests.filter(request => request.statusKey === 'approved').length;
  }

  public get selectedManagerRequest(): LearningRequest {
    return this.requests.find(request => request.id === this.selectedManagerRequestId) ?? this.requests[0] ?? null;
  }

  public get selectedManagerRequestMessages(): Array<LearningRequest['chatMessages'][number]> {
    return this.selectedManagerRequest?.chatMessages ?? [];
  }

  public get filteredEmployees(): Array<Employee> {
    const query = this.employeeSearch.trim().toLowerCase();
    if (!query) {
      return this.employees;
    }
    return this.employees.filter(employee =>
      `${employee.name} ${employee.position} ${employee.grade}`.toLowerCase().includes(query),
    );
  }

  public get teamFeedbackAssignments(): Array<FeedbackAssignment> {
    const employeeNames = this.employees.map(employee => employee.name);
    return this.feedbackService.assignments.filter(assignment => employeeNames.includes(assignment.participantName));
  }

  public get teamFeedbackResponses(): Array<FeedbackResponse> {
    const employeeNames = this.employees.map(employee => employee.name);
    return this.feedbackService.responses.filter(response => employeeNames.includes(response.participantName));
  }

  public get pendingTeamFeedbackCount(): number {
    return this.teamFeedbackAssignments.filter(assignment => assignment.status === 'pending').length;
  }

  public get teamFeedbackCompletion(): number {
    if (!this.teamFeedbackAssignments.length) {
      return 0;
    }
    const completed = this.teamFeedbackAssignments.filter(assignment => assignment.status === 'completed').length;
    return Math.round((completed / this.teamFeedbackAssignments.length) * 100);
  }

  public completeTeamFeedback(assignmentId: string): void {
    this.feedbackService.completeAssignment(assignmentId, 'notification');
    this.showToast('Feedback и статус участия обновлены');
  }

  public switchPage(page: ManagerPage): void {
    this.activePage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public selectEmployee(employee: Employee): void {
    this.selectedEmployeeIndex = this.employees.indexOf(employee);
  }

  public openEmployeeHome(employee?: Employee): void {
    if (employee) {
      this.selectEmployee(employee);
    }
    this.switchPage('team');
    this.showToast(`Открыт профиль сотрудника: ${this.selectedEmployee.name}`);
  }

  public openModal(key: string, event?: Event): void {
    event?.stopPropagation();
    const employee = this.selectedEmployee;
    if (key === 'employeeFullProfile') {
      this.selectedModal = {
        kicker: 'Профиль сотрудника',
        title: employee.name,
        details: [
          ['Position', employee.position],
          ['Grade', employee.grade],
          ['Progress', `${employee.progress}%`],
          ['Trainings', `${employee.trainings.length}`],
          ['Certificates', `${employee.certificates.length}`],
        ],
      };
    } else if (key === 'recommendTraining' || key === 'enrollEmployee') {
      const base = this.modalData[key];
      this.selectedModal = {
        ...base,
        title: employee.name,
        details: base.details.map(([label, value]) => [label, label === 'Employee' ? employee.name : value]),
      };
    } else {
      const data = this.modalData[key];
      if (!data) {
        return;
      }
      this.selectedModal = data;
    }
    this.modalOpen = true;
  }

  public closeModal(): void {
    this.modalOpen = false;
  }

  public onRequestDepartmentChange(): void {
    if (this.requestForm.department === 'Другое') {
      this.requestForm.selectedTrainingTemplateIds = [];
      return;
    }

    this.requestForm.customTrainingTitle = '';
    this.ensureTrainingSelectionForDepartment();
  }

  public submitRequest(): void {
    if (!this.requestFormReady) {
      this.showToast('Заполните департамент, тренинг, даты и обоснование');
      return;
    }

    const isCustomTraining = this.requestForm.department === 'Другое';
    const request = this.learningRequestService.createRequest({
      trainingTemplateIds: isCustomTraining
        ? [`custom-${Date.now()}`]
        : this.requestForm.selectedTrainingTemplateIds,
      trainingTitles: this.selectedTrainingNames,
      requester: 'Темирлан Амирханов',
      department: this.requestForm.department,
      city: this.requestForm.city,
      peopleCount: Number(this.requestForm.peopleCount) || 1,
      periodFrom: this.requestForm.periodFrom,
      periodTo: this.requestForm.periodTo,
      format: this.requestForm.format,
      priority: this.requestForm.priority,
      budget: this.requestForm.budget,
      justification: this.requestForm.justification,
    });
    this.selectedManagerRequestId = request.id;
    this.requestStatusFilter = 'all';
    this.showToast('Заявка отправлена в Training Academy');
  }

  public resetRequestForm(): void {
    this.requestForm = {
      department: 'Training Academy',
      selectedTrainingTemplateIds: [],
      customTrainingTitle: '',
      periodFrom: '2026-07-01',
      periodTo: '2026-08-15',
      format: 'Смешанный',
      priority: 'High',
      peopleCount: 12,
      city: 'Almaty',
      budget: 'Есть',
      justification: '',
    };
    this.ensureTrainingSelectionForDepartment();
    this.showToast('Форма очищена');
  }

  public setRequestStatusFilter(filter: RequestStatusFilter): void {
    this.requestStatusFilter = filter;
  }

  public toggleManagerRequestSection(section: keyof ManagerProfilePrototypeComponent['managerRequestSections']): void {
    this.managerRequestSections[section] = !this.managerRequestSections[section];
  }

  public sendChat(): void {
    if (!this.chatText.trim()) {
      this.showToast('Введите сообщение для чата');
      return;
    }
    if (!this.selectedManagerRequest) {
      this.showToast('Выберите заявку для чата');
      return;
    }
    this.learningRequestService.addChatMessage(this.selectedManagerRequest.id, 'Темирлан Амирханов', this.chatText.trim());
    this.chatText = '';
    this.showToast('Сообщение добавлено в чат заявки');
  }

  public selectManagerRequest(request: LearningRequest): void {
    this.selectedManagerRequestId = request.id;
    this.showToast(`Чат переключен: ${request.title}`);
  }

  public statusLabel(statusKey: LearningRequest['statusKey']): string {
    const labels: Record<LearningRequest['statusKey'], string> = {
      new: 'Новая',
      review: 'На рассмотрении',
      clarify: 'Требуется уточнение',
      approved: 'Подтверждено',
      rejected: 'Отказ',
    };
    return labels[statusKey];
  }

  public statusPillClass(statusKey: LearningRequest['statusKey']): string {
    if (statusKey === 'approved') {
      return 'pill';
    }
    if (statusKey === 'clarify' || statusKey === 'review') {
      return 'pill warn';
    }
    if (statusKey === 'rejected') {
      return 'pill bad';
    }
    return 'pill blue';
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

  public planningPillClass(request: LearningRequest): string {
    switch (request.planningStatus) {
      case 'completed':
        return 'pill';
      case 'calendar':
        return 'pill blue';
      case 'drafts':
        return 'pill warn';
      default:
        return 'pill blue';
    }
  }

  public planningSummary(request: LearningRequest): string {
    if (request.plannerSummary) {
      return request.plannerSummary;
    }
    if (request.planningStatus === 'calendar') {
      return 'Планер передал события в календарь TRMS.';
    }
    if (request.planningStatus === 'drafts') {
      return 'Планер сформировал черновики и уточняет ресурсы.';
    }
    return 'Итог планирования пока не сформирован.';
  }

  public requestPeriod(request: LearningRequest): string {
    return `${request.peopleCount} чел. · ${request.periodFrom} - ${request.periodTo}`;
  }

  public requestTrainingList(request: LearningRequest): string {
    return request.trainingTitles.join(', ');
  }

  public exportReport(): void {
    this.showToast('Экспорт отчета подготовлен');
  }

  public showToast(message: string): void {
    clearTimeout(this.toastTimer);
    this.toastText = message;
    this.toastTimer = setTimeout(() => {
      this.toastText = '';
    }, 2200);
  }

  private ensureTrainingSelectionForDepartment(): void {
    if (this.requestForm.department === 'Другое') {
      return;
    }

    const availableIds = this.filteredTrainingOptions.map(training => training.id);
    const selectedIds = this.requestForm.selectedTrainingTemplateIds.filter(id => availableIds.includes(id));
    this.requestForm.selectedTrainingTemplateIds = selectedIds.length
      ? selectedIds
      : availableIds.slice(0, 1);
  }
}
