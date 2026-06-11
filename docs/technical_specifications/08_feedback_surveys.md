# ТЗ: Feedback and Surveys

## Цель

Создать модуль Feedback, где после завершения тренинга участник получает опрос, а Training Academy собирает ответы, управляет формами, анализирует результаты и выгружает отчеты.

## Пользователи

- Employee.
- Manager.
- Training Academy.
- Planner.
- Trainer.
- Admin.

## Основной сценарий

1. Planner переводит тренинг или participation card в статус completed.
2. TRMS проверяет, есть ли feedback form, связанная с training template.
3. Система создает feedback assignment для участника.
4. Участник получает notification.
5. В мобильном сценарии тренер показывает QR code.
6. Участник открывает форму и отправляет ответы.
7. Attendance status становится completed, если QR подтверждает участие.
8. Ответ сохраняется в Feedback module.
9. Training Academy видит результаты и дашборд.

## Типы вопросов

- Text.
- Single choice.
- Multi choice.
- Likert scale.
- NPS.
- Numeric scale.
- SCAT.
- Date.
- Rating.

## Управление формами

Форма должна иметь:

- title;
- description;
- status;
- training template link;
- question list;
- required flags;
- version;
- archive flag;
- createdBy;
- updatedAt.

Статусы формы:

- draft;
- active;
- archived.

Нельзя удалять active form, если по ней уже есть ответы. Нужно архивировать.

## QR module

QR должен содержать безопасный token:

- feedbackAssignmentId;
- trainingSessionId;
- participantCardId;
- expiration time;
- signature.

После сканирования:

- проверить token;
- проверить участника;
- открыть форму;
- после отправки ответа изменить attendanceStatus на completed.

## Ответы

Хранить:

- response id;
- form id;
- assignment id;
- person id;
- training session id;
- participant card id;
- answers;
- submittedAt;
- source: notification or QR;
- score metrics.

## Дашборды

Показатели:

- response rate;
- average score;
- NPS;
- trainer rating;
- material rating;
- organization rating;
- comments;
- by training;
- by trainer;
- by department;
- by month.

## Export

- Excel raw responses.
- Excel aggregated report.
- PDF summary.

## API

- GET feedback forms.
- POST feedback form.
- PATCH feedback form.
- POST archive feedback form.
- POST link form to training template.
- GET feedback assignments.
- POST create feedback assignments for completed training.
- GET feedback form by QR token.
- POST feedback response.
- GET feedback responses.
- GET feedback dashboard.
- GET feedback export.

## Acceptance criteria

- После завершения тренинга участнику создается feedback assignment.
- Участник может заполнить форму через notification или QR.
- Повторная отправка одной формы одним участником запрещена.
- Ответы видны в Feedback module.
- Manager видит feedback только по своей команде.
- Training Academy видит полную аналитику.
