import { Component } from '@angular/core';

type NewTab = 'employee' | 'manager' | 'requests' | 'planning' | 'forecast' | 'reports' | 'mobile';
type RequestStatus = 'На рассмотрении' | 'В работе' | 'Требуется уточнение' | 'Подтверждено' | 'Отказ';

interface LearningItem {
  title: string;
  format: string;
  status: string;
  date: string;
  color: string;
}

interface EmployeeCard {
  name: string;
  position: string;
  department: string;
  progress: number;
  hours: string;
  certificates: number;
  trainings: LearningItem[];
}

interface TrainingRequest {
  id: string;
  title: string;
  requester: string;
  audience: string;
  people: number;
  priority: string;
  status: RequestStatus;
  note: string;
}

@Component({
  selector: 'app-new-release',
  templateUrl: './new-release.component.html',
  styleUrls: ['./new-release.component.scss'],
  standalone: false,
})
export class NewReleaseComponent {
  public activeTab: NewTab = 'employee';
  public selectedEmployeeIndex: number = 0;
  public selectedMobileScreen: 'home' | 'showcase' | 'forum' | 'history' = 'home';
  public requestMode: 'manual' | 'auto' = 'auto';

  public tabs: Array<{ id: NewTab; title: string; icon: string }> = [
    { id: 'employee', title: 'Профиль сотрудника', icon: 'person' },
    { id: 'manager', title: 'Профиль менеджера', icon: 'supervisor_account' },
    { id: 'requests', title: 'Заявки', icon: 'assignment' },
    { id: 'planning', title: 'Планирование', icon: 'event_available' },
    { id: 'forecast', title: 'Прогнозирование', icon: 'insights' },
    { id: 'reports', title: 'Отчеты', icon: 'table_chart' },
    { id: 'mobile', title: 'Мобильные версии', icon: 'phone_iphone' },
  ];

  public employee: EmployeeCard = {
    name: 'Темирлан Амирханов',
    position: 'Supervisor Training Systems',
    department: 'Training Academy, Almaty',
    progress: 68,
    hours: '42 ч',
    certificates: 7,
    trainings: [
      { title: 'Orientation Day', format: 'Класс', status: 'Пройдено', date: '12.01.2026', color: 'done' },
      { title: 'Orientation Program', format: 'Онлайн', status: 'Пройдено', date: '14.01.2026', color: 'done' },
      { title: 'Охрана труда', format: 'Класс', status: 'В процессе', date: '24.02.2026', color: 'progress' },
      { title: 'IT Security', format: 'Онлайн', status: 'Не начато', date: '05.03.2026', color: 'late' },
      { title: 'Human Factors Initial', format: 'Класс', status: 'Запланировано', date: '16.03.2026', color: 'plan' },
    ],
  };

  public employees: Array<EmployeeCard> = [
    {
      name: 'Темирлан Амирханов',
      position: 'E-learning specialist',
      department: 'Training Academy',
      progress: 74,
      hours: '36 ч',
      certificates: 5,
      trainings: [
        { title: 'Security Awareness 2026', format: 'Онлайн', status: 'Пройдено', date: '01.06.2026', color: 'done' },
        { title: 'Boeing 787 Refresher Course', format: 'Онлайн', status: 'В процессе', date: '08.06.2026', color: 'progress' },
      ],
    },
    {
      name: 'Шерхан Жунусбай',
      position: 'Training coordinator',
      department: 'Training Academy',
      progress: 61,
      hours: '29 ч',
      certificates: 3,
      trainings: [
        { title: 'Service Excellence', format: 'Класс', status: 'Пройдено', date: '18.04.2026', color: 'done' },
        { title: 'CRM Refresher', format: 'Класс', status: 'Запланировано', date: '21.06.2026', color: 'plan' },
      ],
    },
    {
      name: 'Фатима Алекперзаде',
      position: 'Learning analyst',
      department: 'Training Academy',
      progress: 88,
      hours: '51 ч',
      certificates: 8,
      trainings: [
        { title: 'Dangerous Goods', format: 'Онлайн', status: 'Пройдено', date: '19.05.2026', color: 'done' },
        { title: 'Data Reporting Basics', format: 'Онлайн', status: 'Пройдено', date: '02.06.2026', color: 'done' },
      ],
    },
    {
      name: 'Аружан Омирзакова',
      position: 'Training administrator',
      department: 'Training Academy',
      progress: 57,
      hours: '22 ч',
      certificates: 4,
      trainings: [
        { title: 'First Aid Basics', format: 'Класс', status: 'Пройдено', date: '03.03.2026', color: 'done' },
        { title: 'Line Training', format: 'Класс', status: 'Не начато', date: '27.06.2026', color: 'late' },
      ],
    },
  ];

  public requests: Array<TrainingRequest> = [
    {
      id: 'REQ-2026-014',
      title: 'Leadership Essentials',
      requester: 'Темирлан Амирханов',
      audience: 'Training Academy',
      people: 18,
      priority: 'Высокий',
      status: 'На рассмотрении',
      note: 'Нужно для подготовки новых тимлидов на 2027 год.',
    },
    {
      id: 'REQ-2026-018',
      title: 'Power BI для менеджеров',
      requester: 'Темирлан Амирханов',
      audience: 'Corporate Learning',
      people: 12,
      priority: 'Средний',
      status: 'Требуется уточнение',
      note: 'Нужно уточнить источник онлайн-отчетов.',
    },
    {
      id: 'REQ-2026-021',
      title: 'Safety Culture Workshop',
      requester: 'Шерхан Жунусбай',
      audience: 'Ground operations',
      people: 32,
      priority: 'Высокий',
      status: 'Подтверждено',
      note: 'Передать планеру для подбора аудиторий и тренеров.',
    },
  ];

  public recommendedTrainings: Array<{ title: string; source: string; color: string }> = [
    { title: 'Human Factors Initial', source: 'Для позиции', color: 'blue' },
    { title: 'Data Storytelling', source: 'Руководитель', color: 'green' },
    { title: 'Service Excellence', source: 'Коллеги', color: 'gold' },
  ];

  public selectedEmployee(): EmployeeCard {
    return this.employees[this.selectedEmployeeIndex];
  }

  public setTab(tab: NewTab): void {
    this.activeTab = tab;
  }

  public setRequestStatus(request: TrainingRequest, status: RequestStatus): void {
    request.status = status;
    request.note = `Уведомление отправлено инициатору: статус изменен на "${status}".`;
  }

  public enrollSelectedEmployee(trainingTitle: string): void {
    this.selectedEmployee().trainings.push({
      title: trainingTitle,
      format: 'Класс',
      status: 'Запланировано',
      date: '30.06.2026',
      color: 'plan',
    });
  }

  public recommendSelectedEmployee(trainingTitle: string): void {
    this.selectedEmployee().trainings.unshift({
      title: trainingTitle,
      format: 'Рекомендация',
      status: 'Рекомендовано',
      date: 'Сегодня',
      color: 'plan',
    });
  }

  public createAutoPlan(): void {
    this.requestMode = 'auto';
  }
}
