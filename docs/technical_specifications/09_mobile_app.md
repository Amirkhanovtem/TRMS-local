# ТЗ: Mobile Learning Journey

## Цель

Адаптировать ключевые функции Learning Journey под мобильное приложение или мобильный web view.

## Пользователи

- Employee.
- Manager в мобильном режиме.
- Trainer для QR сценария.

## Основные экраны

1. Home.
2. Витрина.
3. Форум.
4. История.
5. Сертификаты.
6. Feedback.
7. QR scanner.
8. Notifications.

## Требования к UI

- Макет должен быть адаптирован под iPhone Pro Max class viewport.
- Нижняя навигация:
  - Home;
  - Витрина;
  - Форум;
  - История;
  - Feedback.
- AI assistant должен быть маленькой плавающей кнопкой справа внизу.
- Notification bell - сверху справа.
- Карточки должны открываться по клику.
- Текст не должен накладываться.
- Длинные списки должны скроллиться естественно.

## Feedback mobile flow

1. После тренинга участник получает notification.
2. Если тренинг очный, тренер показывает QR.
3. Участник сканирует QR.
4. Открывается feedback form.
5. После отправки:
   - feedback response сохраняется;
   - participation card status становится completed;
   - в истории обучения тренинг отображается completed.

## Витрина mobile

- Последовательные фильтры:
  - training;
  - city;
  - date range.
- Кнопка "Показать тренинги" активна только после заполнения обязательных фильтров.
- Список результатов открывается отдельным экраном.
- Карточка тренинга раскрывается.
- Кнопка "Принять участие".

## История mobile

- Education block.
- Фильтры:
  - all;
  - in progress;
  - planned;
  - completed;
  - online;
  - offline.
- Карточка курса открывает детали.

## API

Использовать те же backend endpoints, что и desktop, но payload должен быть оптимизирован.

Нужны:

- GET mobile profile summary.
- GET mobile notifications.
- GET mobile training history.
- GET mobile self enrollment filters.
- GET mobile feedback assignments.
- POST mobile feedback response.
- POST QR validation.

## Acceptance criteria

- Все ключевые действия доступны с телефона.
- QR flow завершает participation card.
- Карточки открываются без iframe.
- Дизайн соответствует общей стилистике Learning Journey.
