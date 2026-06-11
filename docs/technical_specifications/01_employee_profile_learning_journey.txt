# ТЗ: Профиль сотрудника / Learning Journey

## Цель

Создать единый профиль сотрудника в TRMS, где сотрудник видит свой путь обучения, историю, сертификаты, учебные планы, рекомендации, витрину тренингов, форум, награды и feedback.

## Пользователи

- Employee.
- Manager в режиме просмотра профиля сотрудника.
- Training Academy при необходимости аудита.

## Основные разделы

1. Home.
2. История обучения.
3. Сертификаты.
4. Employee Way.
5. Next Learning Journey.
6. Витрина.
7. Форум.
8. Мои награды.
9. Feedback.

## Функциональные требования

### Home

- Показывать данные сотрудника:
  - ФИО;
  - должность;
  - подразделение;
  - город;
  - грейд;
  - руководитель;
  - прогресс обязательного обучения.
- Показывать быстрые кнопки:
  - история обучения;
  - сертификаты;
  - feedback;
  - recommended trainings.
- Показывать уведомления:
  - зачисление на тренинг;
  - предстоящий тренинг;
  - завершение тренинга;
  - необходимость заполнить feedback.

### История обучения

- Показывать completed, planned, in progress, did not participate.
- Фильтры:
  - год;
  - диапазон дат;
  - месяц;
  - online/offline;
  - статус;
  - training category.
- Карточка тренинга должна открываться и показывать детали:
  - название;
  - формат;
  - дата начала;
  - дата окончания;
  - длительность;
  - код курса;
  - статус;
  - результат;
  - сертификат, если есть.

### Сертификаты

- Показывать активные, истекающие, просроченные сертификаты.
- При клике открывать карточку сертификата.
- Поля:
  - certificate template;
  - issue date;
  - expiry date;
  - training source;
  - certificate number;
  - download/view.

### Employee Way

- Показывать путь обучения сотрудника в виде вертикального дерева по текущему году.
- Для других лет использовать фильтр.
- Статусы:
  - completed - зеленый;
  - in progress - желтый;
  - not started - красный;
  - planned - синий.
- Внизу должна быть кнопка All для просмотра всех лет.

### Next Learning Journey

- Показывать учебный план, который сотруднику предстоит пройти.
- Пример для нового сотрудника:
  - Orientation Day - classroom;
  - Orientation Program - online;
  - Охрана труда;
  - IT Security;
  - Security Awareness.
- Каждый шаг должен показывать:
  - порядок прохождения;
  - формат;
  - статус;
  - дедлайн;
  - зависимость от предыдущих шагов.

### Витрина

- Сотрудник может сам записаться на доступные тренинги.
- Фильтры:
  - тренинг;
  - город;
  - даты;
  - online/offline;
  - категория;
  - доступные места.
- После записи создается участие или заявка на участие в зависимости от правил TRMS.

### Recommended trainings

- Показать каталог рекомендованных тренингов.
- Источники рекомендации:
  - recommended by colleagues;
  - recommended for position;
  - recommended by manager.
- Использовать цветовое обозначение источника рекомендации.

## Данные

Использовать реальные данные:

- person;
- position;
- subdivision;
- training templates;
- training sessions;
- participation cards;
- certificate issue;
- notification;
- feedback assignments.

## API

Нужны endpoints или расширение существующих:

- GET employee profile summary.
- GET employee learning history.
- GET employee certificates.
- GET employee learning journey.
- GET employee recommended trainings.
- POST self enrollment.
- GET employee feedback assignments.

## Acceptance criteria

- Сотрудник видит свой профиль без mock данных.
- История и сертификаты совпадают с реальными TRMS данными.
- Самозачисление создает реальную запись.
- Feedback assignment появляется после завершения тренинга.
- При изменении статуса участия данные обновляются в профиле.
