# ТЗ: LMS integration with Docebo

## Цель

Создать раздел LMS, где администратор связывает training templates TRMS с курсами Docebo и шаблонами сертификатов TRMS.

## Пользователи

- LMS Admin.
- Training Academy.
- Admin.

## Основной сценарий

1. Пользователь открывает раздел LMS.
2. Выбирает training template из TRMS.
3. Указывает course code из Docebo.
4. Выбирает или загружает certificate template.
5. Настраивает правило синхронизации.
6. Сохраняет integration rule.

## Поля правила интеграции

- id;
- trmsTrainingTemplateId;
- trmsTrainingTemplateCode;
- trmsTrainingTemplateName;
- doceboCourseId;
- doceboCourseCode;
- doceboCourseName;
- certificateTemplateId;
- certificateTemplateFileId;
- syncEnabled;
- autoIssueCertificate;
- minCompletionScore;
- completionStatusMapping;
- lastSyncAt;
- lastSyncStatus.

## Certificate block

В блоке Certificate нужно:

- выбрать существующий certificate template TRMS;
- загрузить файл шаблона для будущего сертификата;
- видеть имя файла;
- видеть дату загрузки;
- валидировать формат;
- валидировать размер файла.

Разрешенные форматы:

- PDF;
- DOCX;
- HTML;
- PNG;
- JPG.

## Docebo integration

Нужны методы:

- получить список курсов;
- получить course by code;
- получить enrollments/completions;
- получить completion date;
- получить score;
- получить user identifier.

## Matching rules

Сопоставление участника:

- employee number;
- corporate email;
- external LMS user id.

Если пользователь не найден:

- показать sync error;
- не выпускать сертификат;
- дать возможность ручного сопоставления.

## Ошибки

Нужно логировать:

- course not found;
- user not found;
- duplicate mapping;
- certificate template missing;
- completion status unknown;
- API unavailable.

## API

- GET lms mappings.
- POST lms mapping.
- PATCH lms mapping.
- DELETE or archive lms mapping.
- GET docebo courses.
- GET docebo completions.
- POST upload certificate template file.
- GET sync logs.

## Acceptance criteria

- TRMS training template можно связать с Docebo course code.
- Certificate template можно выбрать или загрузить.
- Ошибки синхронизации видны пользователю.
- Mapping не создает дубликаты.
- Данные готовы для модуля LMS certificates.
