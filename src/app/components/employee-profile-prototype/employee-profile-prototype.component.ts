import { Component } from '@angular/core';

type EmployeePage = 'home' | 'store' | 'forum' | 'rewards' | 'history';
type CourseFilter = 'all' | 'progress' | 'planned' | 'completed';
type CourseMode = 'all' | 'online' | 'offline';

interface ModalInfo {
  kicker: string;
  title: string;
  details: Array<[string, string]>;
}

interface Course {
  title: string;
  mode: CourseMode;
  status: CourseFilter;
  statusText: string;
  result: string;
  modalKey: string;
}

@Component({
  selector: 'app-employee-profile-prototype',
  templateUrl: './employee-profile-prototype.component.html',
  styleUrls: ['./employee-profile-prototype.component.scss'],
  standalone: false,
})
export class EmployeeProfilePrototypeComponent {
  public activePage: EmployeePage = 'home';
  public courseFilter: CourseFilter = 'all';
  public courseMode: CourseMode = 'all';
  public modalOpen: boolean = false;
  public toastText: string = '';
  public selectedModal: ModalInfo = { kicker: '', title: '', details: [] };
  public forumText: string = '';
  public enrolled: Record<string, boolean> = {};
  public selectedRewardBanner: string = 'emerald';
  public customRewardField: string = 'Фокус месяца: закрыть Digital Learning Strategy и получить бейдж Mentor.';
  private toastTimer: ReturnType<typeof setTimeout>;

  public subtitles: Record<EmployeePage, string> = {
    home: 'Профиль, путь обучения и рекомендации.',
    store: 'Самозачисление на тренинги по фильтрам.',
    forum: 'Сообщество сотрудников, FAQ и обсуждения.',
    rewards: 'Reward Shop, бейджи, ачивки и персональный баннер.',
    history: 'История обучения, сертификаты и курсы.',
  };

  public storeFilter = {
    training: '',
    city: '',
    from: '2026-06-05',
    to: '2026-08-30',
  };

  public rewardPurchases = [
    { title: 'Priority parking voucher', date: '02.06.2026', cost: '320 pts', status: 'Активно' },
    { title: 'Air Astana travel mug', date: '19.05.2026', cost: '180 pts', status: 'Получено' },
    { title: 'Extra coffee coupon', date: '10.05.2026', cost: '60 pts', status: 'Использовано' },
  ];

  public rewardBadges = [
    { title: 'Learning Streak', subtitle: '5 недель подряд без пропусков', level: 'Gold' },
    { title: 'Forum Helper', subtitle: '12 полезных ответов коллегам', level: 'Silver' },
    { title: 'Safety Champion', subtitle: '100% обязательных safety-модулей', level: 'Gold' },
  ];

  public achievements = [
    { title: 'Orientation completed', value: '100%', note: 'Закрыт учебный план новичка' },
    { title: 'Certificates active', value: '8/8', note: 'Нет просроченных сертификатов' },
    { title: 'Reward points earned', value: '1 240', note: 'За обучение, форум и участие' },
  ];

  public rewardBanners = [
    { id: 'emerald', title: 'Emerald Academy' },
    { id: 'sky', title: 'Sky Progress' },
    { id: 'gold', title: 'Gold Recognition' },
  ];
  public discussions: Array<{ title: string; subtitle: string; likes: number; modalKey: string }> = [
    {
      title: 'Как применять HEART в ночную смену?',
      subtitle: '6 ответов · Front Office',
      likes: 6,
      modalKey: 'topicHeart',
    },
    {
      title: 'Лучшие практики по жалобам гостей',
      subtitle: '12 ответов · Service',
      likes: 12,
      modalKey: 'topicService',
    },
  ];

  public courses: Array<Course> = [
    {
      title: 'Security Awareness 2026 (Air Astana)',
      mode: 'online',
      status: 'planned',
      statusText: 'Planned',
      result: 'Score 0',
      modalKey: 'courseSecurity',
    },
    {
      title: 'Boeing 787 Refresher Course',
      mode: 'online',
      status: 'completed',
      statusText: 'Passed',
      result: 'Score 85',
      modalKey: 'courseBoeing',
    },
    {
      title: 'Leadership Workshop: Learning Academy',
      mode: 'offline',
      status: 'progress',
      statusText: 'In progress',
      result: '45%',
      modalKey: 'courseLeadership',
    },
  ];

  public modalData: Record<string, ModalInfo> = {
    learningPlan: {
      kicker: 'Next learning journey',
      title: 'Учебный план нового сотрудника',
      details: [
        ['Orientation Day', 'Класс · Пройдено'],
        ['Orientation Program', 'Онлайн · В процессе'],
        ['Охрана труда', 'Онлайн + тест · Не начато'],
        ['IT безопасность', 'Онлайн · Не начато'],
      ],
    },
    profileDetails: {
      kicker: 'Профиль сотрудника',
      title: 'Темирлан Амирханов',
      details: [
        ['Должность', 'Supervisor Training Systems'],
        ['Подразделение', 'Training Academy'],
        ['Город', 'Almaty'],
        ['План внедрения', '68% выполнено'],
      ],
    },
    hoursDetails: {
      kicker: 'Часы обучения',
      title: 'План и фактическая активность',
      details: [
        ['Общий прогресс', '68%'],
        ['Онлайн', '18 ч'],
        ['Оффлайн', '24 ч'],
        ['До полного внедрения', '4 тренинга'],
      ],
    },
    employeeFilter: {
      kicker: 'Employee Way',
      title: 'Фильтр по годам',
      details: [
        ['2024', 'Service Excellence, First Aid Basics, CRM Refresher'],
        ['2025', 'Emergency Response, Dangerous Goods'],
        ['2026', 'Orientation Program, Aviation Security, Line Training'],
      ],
    },
    recommendFilter: {
      kicker: 'Рекомендации',
      title: 'Фильтр источника',
      details: [
        ['Коллеги', 'Learning Experience Design'],
        ['Позиция', 'Digital Learning Strategy'],
        ['Руководитель', 'Academy Budget Planning'],
      ],
    },
    notifications: {
      kicker: 'Уведомления',
      title: 'Ближайшие события',
      details: [
        ['Зачисление', 'Вы записаны на ERP training · 23.06.2026'],
        ['Предстоящий тренинг', 'Orientation Program нужно завершить до 12.06.2026'],
        ['Напоминание', 'IT безопасность ожидает прохождения теста'],
      ],
    },
    aiAssistant: {
      kicker: 'AI assistant',
      title: 'Помощник Learning Journey',
      details: [
        ['Что умеет', 'Подсказывает тренинги, сертификаты и правила зачисления'],
        ['Интеграции', 'Портал сотрудника, LMS, HR-система'],
        ['Пример запроса', 'Какие тренинги мне нужно закрыть в июне?'],
      ],
    },
    wayOrientation: {
      kicker: 'Employee Way',
      title: 'Orientation Program',
      details: [
        ['Статус', 'Пройден'],
        ['Формат', 'онлайн'],
        ['Период', 'Январь 2026'],
        ['Результат', '100%'],
      ],
    },
    waySecurity: {
      kicker: 'Employee Way',
      title: 'Aviation Security',
      details: [
        ['Статус', 'Пройден'],
        ['Формат', 'класс'],
        ['Период', 'Февраль 2026'],
        ['Сертификат', 'Активен'],
      ],
    },
    wayLine: {
      kicker: 'Employee Way',
      title: 'Line Training',
      details: [
        ['Статус', 'В процессе'],
        ['Формат', 'практика'],
        ['Период', 'Июнь 2026'],
        ['Следующий шаг', 'Чекпоинт с тренером'],
      ],
    },
    wayHuman: {
      kicker: 'Employee Way',
      title: 'Human Factors Initial',
      details: [
        ['Статус', 'Не начато'],
        ['Формат', 'онлайн'],
        ['Период', 'Июль 2026'],
        ['Действие', 'Откроется после Line Training'],
      ],
    },
    positionLeadership: {
      kicker: 'Мой путь по позиции',
      title: 'Leadership Curriculum',
      details: [
        ['Статус', 'В процессе'],
        ['Прогресс', '2 из 3 модулей'],
        ['Следующий модуль', 'Coaching for performance'],
        ['Приоритет', 'Высокий'],
      ],
    },
    positionDigital: {
      kicker: 'Мой путь по позиции',
      title: 'Digital Learning Strategy',
      details: [
        ['Статус', 'Не начато'],
        ['Почему нужно', 'Рекомендовано для позиции'],
        ['Формат', 'онлайн'],
        ['Плановая дата', 'Июль 2026'],
      ],
    },
    positionGovernance: {
      kicker: 'Мой путь по позиции',
      title: 'Academy Governance',
      details: [
        ['Статус', 'Пройдено'],
        ['Формат', 'класс'],
        ['Дата', '18.04.2026'],
        ['Результат', 'Passed'],
      ],
    },
    recExperience: {
      kicker: 'Рекомендованный тренинг',
      title: 'Learning Experience Design',
      details: [
        ['Источник', 'Рекомендовано коллегами'],
        ['Лайки', '8 рекомендаций'],
        ['Формат', 'онлайн'],
        ['Действие', 'Можно добавить в план'],
      ],
    },
    recDigital: {
      kicker: 'Рекомендованный тренинг',
      title: 'Digital Learning Strategy',
      details: [
        ['Источник', 'Рекомендовано для позиции'],
        ['Статус', 'Обязательный трек'],
        ['Формат', 'онлайн'],
        ['Период', 'Q3 2026'],
      ],
    },
    recBudget: {
      kicker: 'Рекомендованный тренинг',
      title: 'Academy Budget Planning',
      details: [
        ['Источник', 'Рекомендовано руководителем'],
        ['Приоритет', 'Q3'],
        ['Формат', 'класс'],
        ['Город', 'Almaty'],
      ],
    },
    storeErp: {
      kicker: 'Витрина',
      title: 'ERP training for Special Assistance Team Volunteers',
      details: [
        ['Дата', '23.06.2026'],
        ['Город', 'Алматы'],
        ['Адрес', 'Кульджинский тракт, 4в корпус Ю, St 311'],
        ['Свободные места', '4'],
      ],
    },
    storeTax: {
      kicker: 'Витрина',
      title: 'International Taxation for Business Initiators',
      details: [
        ['Дата', '19.06.2026'],
        ['Город', 'Алматы'],
        ['Адрес', 'Достык 38, KD London'],
        ['Свободные места', '8'],
      ],
    },
    courseSecurity: {
      kicker: 'Education',
      title: 'Security Awareness 2026 (Air Astana)',
      details: [
        ['Format', 'online'],
        ['Status', 'Planned'],
        ['Enrollment', '01.06.2026'],
        ['Course code', 'AvSec_Awareness_KC_staff'],
        ['Score', '0'],
      ],
    },
    courseBoeing: {
      kicker: 'Education',
      title: 'Boeing 787 Refresher Course',
      details: [
        ['Format', 'online'],
        ['Status', 'Passed'],
        ['Duration', '3 hours'],
        ['Course code', 'B787_REF_2026'],
        ['Score', '85'],
      ],
    },
    courseLeadership: {
      kicker: 'Education',
      title: 'Leadership Workshop: Learning Academy',
      details: [
        ['Format', 'offline'],
        ['Status', 'In progress'],
        ['Duration', '6 hours'],
        ['Enrollment', '15.06.2026'],
        ['Progress', '45%'],
      ],
    },
    certHeart: {
      kicker: 'Сертификат',
      title: 'HEART Basics',
      details: [
        ['Статус', 'Активен'],
        ['Certificate ID', 'HB-2026-184'],
        ['Дата выдачи', '28.05.2026'],
        ['Действует до', '28.05.2027'],
      ],
    },
    certSafety: {
      kicker: 'Сертификат',
      title: 'Safety & Emergency',
      details: [
        ['Статус', 'Активен'],
        ['Certificate ID', 'SE-2026-090'],
        ['Дата выдачи', '23.05.2026'],
        ['Результат', 'Тест 91%'],
      ],
    },
    recentHeart: {
      kicker: 'Последнее обучение',
      title: 'HEART Basics',
      details: [
        ['Дата', '28 мая 2026'],
        ['Формат', 'оффлайн'],
        ['Длительность', '8 ч'],
        ['Статус', 'Пройдено'],
      ],
    },
    recentSafety: {
      kicker: 'Последнее обучение',
      title: 'Safety & Emergency',
      details: [
        ['Дата', '23 мая 2026'],
        ['Формат', 'онлайн'],
        ['Результат', 'Тест 91%'],
        ['Длительность', '3 ч'],
      ],
    },
    topicCertificate: {
      kicker: 'Форум',
      title: 'Где скачать сертификат после теста?',
      details: [
        ['Ответов', '17'],
        ['Лайков', '12'],
        ['Последний ответ', 'Training Academy · сегодня'],
        ['FAQ', 'Сертификат доступен в разделе История'],
      ],
    },
    topicOrientation: {
      kicker: 'Форум',
      title: 'Как быстро закрыть Orientation Program?',
      details: [
        ['Ответов', '24'],
        ['Лайков', '18'],
        ['Топ тема', '1 место'],
        ['Лучший ответ', 'Пройти онлайн-модули и финальный чек-лист'],
      ],
    },
    topicIt: {
      kicker: 'Форум',
      title: 'IT безопасность: тест не открылся',
      details: [
        ['Ответов', '14'],
        ['Лайков', '9'],
        ['Статус', 'Передано IT support'],
        ['Решение', 'Очистить кеш и открыть модуль заново'],
      ],
    },
    topicHeart: {
      kicker: 'Форум',
      title: 'Как применять HEART в ночную смену?',
      details: [
        ['Ответов', '6'],
        ['Раздел', 'Front Office'],
        ['Лучший ответ', 'Использовать чек-лист ситуаций смены'],
        ['Статус', 'Открыто'],
      ],
    },
    topicService: {
      kicker: 'Форум',
      title: 'Лучшие практики по жалобам гостей',
      details: [
        ['Ответов', '12'],
        ['Раздел', 'Service'],
        ['Лайков', '12'],
        ['Статус', 'Открыто'],
      ],
    },
  };

  public switchPage(page: EmployeePage): void {
    this.activePage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  public like(event: Event, item?: { likes: number }): void {
    event.stopPropagation();
    if (item) {
      item.likes += 1;
    }
    this.showToast('Лайк добавлен');
  }

  public enroll(key: string, event: Event): void {
    event.stopPropagation();
    this.enrolled[key] = true;
    this.showToast('Вы записаны на тренинг');
  }

  public showTrainings(): void {
    this.modalData['storeSearch'] = {
      kicker: 'Витрина',
      title: 'Найденные тренинги',
      details: [
        ['Тренинг', this.storeFilter.training || 'Все тренинги'],
        ['Город', this.storeFilter.city || 'Все города'],
        ['Период', `${this.storeFilter.from} - ${this.storeFilter.to}`],
        ['Результат', '2 доступные сессии'],
      ],
    };
    this.openModal('storeSearch');
  }

  public clearTrainings(): void {
    this.storeFilter = {
      training: '',
      city: '',
      from: '2026-06-05',
      to: '2026-08-30',
    };
    this.showToast('Фильтры очищены');
  }

  public createTopic(): void {
    this.switchPage('forum');
    this.forumText = '';
    this.showToast('Введите текст и нажмите Отправить');
  }

  public sendTopic(): void {
    const text = this.forumText.trim();
    if (!text) {
      return;
    }

    const modalKey = `topicCreated${Date.now()}`;
    this.discussions.unshift({
      title: text,
      subtitle: '0 ответов · создано вами',
      likes: 0,
      modalKey,
    });
    this.modalData[modalKey] = {
      kicker: 'Форум',
      title: text,
      details: [
        ['Ответов', '0'],
        ['Статус', 'Новая тема'],
        ['Автор', 'Вы'],
        ['Раздел', 'Общее обучение'],
      ],
    };
    this.forumText = '';
    this.showToast('Тема создана');
  }


  public openRewardDetails(title: string, type: string, status: string, event?: Event): void {
    event?.stopPropagation();
    this.selectedModal = {
      kicker: type,
      title,
      details: [
        ['Владелец', 'Темирлан Амирханов'],
        ['Статус', status],
        ['Источник', 'Reward Shop / Learning Journey'],
        ['Профиль', this.customRewardField],
      ],
    };
    this.modalOpen = true;
  }

  public saveRewardProfile(): void {
    this.showToast('Настройки наград сохранены');
  }
  public isCourseVisible(course: Course): boolean {
    const statusMatch = this.courseFilter === 'all' || course.status === this.courseFilter;
    const modeMatch = this.courseMode === 'all' || course.mode === this.courseMode;
    return statusMatch && modeMatch;
  }

  private showToast(message: string): void {
    clearTimeout(this.toastTimer);
    this.toastText = message;
    this.toastTimer = setTimeout(() => {
      this.toastText = '';
    }, 2200);
  }
}


