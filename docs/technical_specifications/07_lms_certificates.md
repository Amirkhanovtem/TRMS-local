# ТЗ: LMS сертификаты

## Цель

Создать раздел, где Training Academy или LMS Admin выпускает сертификаты TRMS на основании завершения курсов в Docebo.

## Пользователи

- LMS Admin.
- Training Academy.
- Admin.

## Основной сценарий

1. Система получает completion data из Docebo.
2. Пользователь открывает "LMS сертификаты".
3. Фильтрует участников.
4. Проверяет eligibility.
5. Выпускает сертификат одному участнику или группе.
6. Сертификат сохраняется в существующем модуле сертификатов TRMS.

## Фильтры

- курс;
- course code;
- training template code;
- департамент;
- сотрудник;
- completion status;
- certificate status;
- completion date range;
- issue date range.

## Статусы

Completion status:

- not started;
- in progress;
- completed;
- failed;
- expired.

Certificate status:

- not eligible;
- ready to issue;
- issued;
- issue failed;
- reissue required.

## Проверки перед выпуском

- Есть mapping TRMS training template - Docebo course.
- Есть certificate template.
- Участник найден в TRMS.
- Completion status = completed.
- Score >= минимального порога, если задан.
- Сертификат еще не был выпущен или разрешен reissue.

## Выпуск сертификата

Использовать существующую логику TRMS certificate module.

Не создавать отдельный механизм генерации сертификатов, если текущий модуль уже умеет:

- выпускать сертификат;
- хранить файл;
- скачивать сертификат;
- показывать историю.

## Таблица

Колонки:

- participant;
- employee number;
- department;
- course name;
- course code;
- completion date;
- score;
- certificate template;
- certificate status;
- actions.

## Export

- Excel.
- PDF summary.

## API

- GET lms certificate candidates.
- POST issue certificate by candidate id.
- POST bulk issue certificates.
- GET lms certificate issue logs.
- GET certificate issue details.

## Acceptance criteria

- Завершенный Docebo course может привести к выпуску TRMS certificate.
- Сертификат выпускается через существующий certificate module.
- Пользователь видит причину, если сертификат нельзя выпустить.
- Массовый выпуск не создает дубликаты.
