# ТЗ: Заявки на обучение

## Цель

Дать руководителю удобный способ запросить обучение у Training Academy, а академии - принять заявку в работу, уточнить детали, подтвердить или отказать.

## Пользователи

- Manager - инициатор заявки.
- Training Academy Manager - рассматривает заявку.
- Planner - получает подтвержденные заявки.
- Admin - поддержка и аудит.

## Сценарий

1. Руководитель открывает "Запросы на обучение".
2. Выбирает департамент.
3. Система показывает список тренингов для выбранного департамента.
4. Если нужного департамента или тренинга нет, выбирается "Другое".
5. Руководитель указывает:
   - название предполагаемого тренинга;
   - даты;
   - формат;
   - город;
   - количество людей;
   - бюджет;
   - приоритет;
   - обоснование.
6. Заявка уходит в Training Academy.
7. Академия меняет статус и ведет чат.
8. При подтверждении заявка уходит планеру.

## Статусы

- Draft.
- Submitted.
- In review.
- Clarification required.
- Approved.
- Rejected.
- Sent to planner.
- Planned.
- Closed.

## Функциональные требования

### Форма заявки

- Выбор департамента обязателен.
- Список тренингов зависит от департамента.
- Для "Другое" появляется свободное поле названия тренинга.
- Можно выбрать несколько тренингов.
- Обязательные поля:
  - период;
  - формат;
  - город;
  - количество участников;
  - приоритет;
  - обоснование.

### Статусы заявки

- Инициатор видит все изменения статуса.
- Training Academy видит очередь заявок.
- Каждый статус отправляет notification инициатору.

### Чат

- Чат хранится внутри заявки.
- Сообщения видят инициатор, Training Academy и Planner после передачи заявки.
- Цель - убрать уточнения из email.

### Уведомления

- Submitted - заявка отправлена.
- Clarification required - нужно уточнение.
- Approved - заявка подтверждена.
- Rejected - заявка отклонена.
- Planned - обучение запланировано.

## Данные

Сущность LearningRequest:

- id;
- requesterPersonId;
- departmentId;
- trainingTemplateIds;
- customTrainingTitle;
- periodFrom;
- periodTo;
- format;
- cityId;
- peopleCount;
- budgetFlag;
- priority;
- justification;
- status;
- plannerStatus;
- createdAt;
- updatedAt.

Сущность LearningRequestMessage:

- id;
- requestId;
- authorPersonId;
- message;
- createdAt.

## API

- GET requests.
- GET request by id.
- POST request.
- PATCH request.
- PATCH request status.
- POST request message.
- GET training templates by department.

## Acceptance criteria

- Руководитель создает заявку без ручного выбора из общего огромного списка.
- Training Academy видит заявку сразу после отправки.
- Статусы синхронны во всех связанных экранах.
- Чат сохраняется в заявке.
- Подтвержденная заявка доступна планеру.
