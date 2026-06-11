import { Component, OnInit } from '@angular/core';
import { CertificateTemplateModel } from '@certificate-template-models/certificate-template.model';
import { CertificateTemplateService } from '@certificate-template-services/certificate-template.service';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';
import { TrainingTemplateService } from '@training-template-services/training-template.service';

type MappingStatus = 'Активна' | 'Курс не найден' | 'Нет сертификата' | 'Дубликат' | 'Отключена';

interface TrainingTemplate {
  code: string;
  title: string;
  department: string;
  format: string;
  certificateModule: string;
}

interface DoceboCourse {
  id: string;
  code: string;
  title: string;
  platform: string;
  hours: number;
  active: boolean;
  lastCompletionAt: string;
}

interface CertificateTemplate {
  code: string;
  title: string;
  language: string;
  validity: string;
}

interface LmsMapping {
  trainingCode: string;
  doceboCourseId: string;
  doceboCourseCode: string;
  certificateCode: string;
  certificateFileName?: string;
  certificateFileUploadedAt?: string;
  status: MappingStatus;
  autoIssue: boolean;
  reviewRequired: boolean;
  updatedAt: string;
}

@Component({
  selector: 'app-lms-prototype',
  standalone: false,
  templateUrl: './lms-prototype.component.html',
  styleUrls: ['./lms-prototype.component.scss'],
})
export class LmsPrototypeComponent implements OnInit {
  private readonly fallbackTrainingTemplates: TrainingTemplate[] = [
    {
      code: 'TRMS-SEC-2026',
      title: 'Security Awareness 2026',
      department: 'IT Security',
      format: 'online',
      certificateModule: 'Certificate issue',
    },
    {
      code: 'TRMS-DL-STRATEGY',
      title: 'Digital Learning Strategy',
      department: 'Training Academy',
      format: 'online',
      certificateModule: 'Certificate issue',
    },
    {
      code: 'TRMS-HF-P145',
      title: 'Initial Human Factors P145',
      department: 'Engineering',
      format: 'mixed',
      certificateModule: 'Certificate issue',
    },
    {
      code: 'TRMS-DG-RECURRENT',
      title: 'Dangerous Goods Recurrent',
      department: 'Operations',
      format: 'offline',
      certificateModule: 'Certificate issue',
    },
  ];

  readonly doceboCourses: DoceboCourse[] = [
    {
      id: 'docebo-10422',
      code: 'LMS-SEC-AW-2026',
      title: 'Security Awareness 2026 (Air Astana)',
      platform: 'Docebo',
      hours: 2,
      active: true,
      lastCompletionAt: '10.06.2026 14:22',
    },
    {
      id: 'docebo-10487',
      code: 'LMS-DL-2026',
      title: 'Digital Learning Strategy',
      platform: 'Docebo',
      hours: 6,
      active: true,
      lastCompletionAt: '10.06.2026 09:12',
    },
    {
      id: 'docebo-10770',
      code: 'LMS-HF-P145',
      title: 'Human Factors Initial P145',
      platform: 'Docebo',
      hours: 4,
      active: true,
      lastCompletionAt: '08.06.2026 16:40',
    },
    {
      id: 'docebo-10911',
      code: 'LMS-DG-REC',
      title: 'Dangerous Goods Recurrent',
      platform: 'Docebo',
      hours: 5,
      active: true,
      lastCompletionAt: '07.06.2026 10:15',
    },
    {
      id: 'docebo-11015',
      code: 'LMS-CUST-EXP-ADV',
      title: 'Customer Experience Advanced',
      platform: 'Docebo',
      hours: 3,
      active: true,
      lastCompletionAt: 'нет завершений',
    },
  ];

  trainingTemplates: TrainingTemplate[] = [...this.fallbackTrainingTemplates];

  private readonly fallbackCertificateTemplates: CertificateTemplate[] = [
    {
      code: 'CERT-SEC-2026',
      title: 'Security Awareness Certificate',
      language: 'RU / EN',
      validity: '12 месяцев',
    },
    {
      code: 'CERT-DL-STRATEGY',
      title: 'Digital Learning Certificate',
      language: 'RU / EN',
      validity: 'Бессрочно',
    },
    {
      code: 'CERT-HF-P145',
      title: 'Human Factors Certificate',
      language: 'EN',
      validity: '24 месяца',
    },
    {
      code: 'CERT-DG-REC',
      title: 'Dangerous Goods Certificate',
      language: 'RU / EN',
      validity: '24 месяца',
    },
  ];

  certificateTemplates: CertificateTemplate[] = [...this.fallbackCertificateTemplates];

  mappings: LmsMapping[] = [
    {
      trainingCode: 'TRMS-SEC-2026',
      doceboCourseId: 'docebo-10422',
      doceboCourseCode: 'LMS-SEC-AW-2026',
      certificateCode: 'CERT-SEC-2026',
      status: 'Активна',
      autoIssue: false,
      reviewRequired: true,
      updatedAt: '10.06.2026',
    },
    {
      trainingCode: 'TRMS-HF-P145',
      doceboCourseId: 'docebo-10770',
      doceboCourseCode: 'LMS-HF-P145',
      certificateCode: 'CERT-HF-P145',
      status: 'Активна',
      autoIssue: false,
      reviewRequired: false,
      updatedAt: '09.06.2026',
    },
    {
      trainingCode: 'TRMS-DG-RECURRENT',
      doceboCourseId: 'docebo-10911',
      doceboCourseCode: 'LMS-DG-REC',
      certificateCode: '',
      status: 'Нет сертификата',
      autoIssue: false,
      reviewRequired: true,
      updatedAt: '08.06.2026',
    },
  ];

  selectedTrainingCode = this.trainingTemplates[1].code;
  selectedCourseId = this.doceboCourses[1].id;
  selectedCertificateCode = this.certificateTemplates[1].code;
  autoIssue = false;
  reviewRequired = true;
  uploadedCertificateTemplateName = '';
  uploadedCertificateTemplateSize = '';
  uploadedCertificateTemplateStatus = 'Файл шаблона еще не загружен';
  searchText = '';
  toastText = '';
  syncState = 'Docebo webhook: включен · reconciliation: каждые 2 часа';
  lastSyncAt = '11.06.2026 09:30';
  dictionaryState = 'TRMS справочники: используется fallback до успешной загрузки backend';

  constructor(
    private trainingTemplateService: TrainingTemplateService,
    private certificateTemplateService: CertificateTemplateService,
  ) {}

  ngOnInit(): void {
    this.loadTrmsDictionaries();
  }

  get selectedTraining(): TrainingTemplate | undefined {
    return this.trainingTemplates.find(item => item.code === this.selectedTrainingCode);
  }

  get selectedCourse(): DoceboCourse | undefined {
    return this.doceboCourses.find(item => item.id === this.selectedCourseId);
  }

  get selectedCertificate(): CertificateTemplate | undefined {
    return this.certificateTemplates.find(item => item.code === this.selectedCertificateCode);
  }

  get activeMappingsCount(): number {
    return this.mappings.filter(mapping => mapping.status === 'Активна').length;
  }

  get issueReadyCount(): number {
    return this.mappings.filter(mapping => mapping.status === 'Активна' && mapping.certificateCode).length;
  }

  get qualityProblemsCount(): number {
    return this.mappings.filter(mapping => mapping.status !== 'Активна').length + this.unmappedCourses.length;
  }

  get unmappedCourses(): DoceboCourse[] {
    const mappedCourseIds = new Set(this.mappings.map(mapping => mapping.doceboCourseId));
    return this.doceboCourses.filter(course => !mappedCourseIds.has(course.id));
  }

  get filteredMappings(): LmsMapping[] {
    const query = this.searchText.trim().toLowerCase();

    if (!query) {
      return this.mappings;
    }

    return this.mappings.filter(mapping => {
      const training = this.getTraining(mapping.trainingCode);
      const course = this.getCourse(mapping.doceboCourseId);
      const certificate = this.getCertificate(mapping.certificateCode);
      return [
        mapping.trainingCode,
        mapping.doceboCourseCode,
        mapping.certificateCode,
        mapping.status,
        training?.title,
        course?.title,
        certificate?.title,
      ]
        .filter(Boolean)
        .some(value => value!.toLowerCase().includes(query));
    });
  }

  getTraining(code: string): TrainingTemplate | undefined {
    return this.trainingTemplates.find(item => item.code === code);
  }

  getCourse(id: string): DoceboCourse | undefined {
    return this.doceboCourses.find(item => item.id === id);
  }

  getCertificate(code: string): CertificateTemplate | undefined {
    return this.certificateTemplates.find(item => item.code === code);
  }

  private loadTrmsDictionaries(): void {
    this.trainingTemplateService.list().subscribe({
      next: trainingTemplates => {
        const mappedTemplates = trainingTemplates.map(template => this.mapTrainingTemplate(template));

        if (mappedTemplates.length) {
          this.trainingTemplates = mappedTemplates;
          this.selectedTrainingCode = this.resolveSelectedCode(
            this.selectedTrainingCode,
            this.trainingTemplates.map(item => item.code),
          );
        }

        this.dictionaryState = `TRMS training templates: ${mappedTemplates.length || this.trainingTemplates.length}`;
      },
      error: () => {
        this.trainingTemplates = [...this.fallbackTrainingTemplates];
        this.dictionaryState = 'TRMS training templates: backend недоступен, включен fallback';
      },
    });

    this.certificateTemplateService.list().subscribe({
      next: certificateTemplates => {
        const mappedTemplates = certificateTemplates.map(template => this.mapCertificateTemplate(template));

        if (mappedTemplates.length) {
          this.certificateTemplates = mappedTemplates;
          this.selectedCertificateCode = this.resolveSelectedCode(
            this.selectedCertificateCode,
            this.certificateTemplates.map(item => item.code),
          );
        }
      },
      error: () => {
        this.certificateTemplates = [...this.fallbackCertificateTemplates];
      },
    });
  }

  private mapTrainingTemplate(template: TrainingTemplateModel): TrainingTemplate {
    return {
      code: template.code || template.id || '',
      title: template.name || template.code || 'Без названия',
      department: template.trainingCategory?.name || template.trainingType?.name || 'TRMS',
      format: template.format?.nameRu || template.format?.nameEn || template.format?.id || 'не указан',
      certificateModule: template.certificateTemplates?.length
        ? `${template.certificateTemplates.length} сертификат(ов)`
        : 'Certificate issue',
    };
  }

  private mapCertificateTemplate(template: CertificateTemplateModel): CertificateTemplate {
    return {
      code: template.code || template.id || '',
      title: template.name || template.code || 'Без названия',
      language: template.type?.nameRu || template.type?.nameEn || template.type?.id || 'TRMS',
      validity: this.formatCertificateValidity(template),
    };
  }

  private formatCertificateValidity(template: CertificateTemplateModel): string {
    const settings = template.certificateDurationSettings;

    if (!settings) {
      return 'по настройкам TRMS';
    }

    const durationTypeName = settings.durationType?.nameRu || settings.durationType?.nameEn || settings.durationType?.id;

    if (durationTypeName) {
      return settings.expireThrough ? `${durationTypeName}: ${settings.expireThrough}` : durationTypeName;
    }

    if (settings.baseMonthPeriod) {
      return `${settings.baseMonthPeriod} мес.`;
    }

    return 'по настройкам TRMS';
  }

  private resolveSelectedCode(currentCode: string, availableCodes: string[]): string {
    if (currentCode && availableCodes.includes(currentCode)) {
      return currentCode;
    }

    return availableCodes[0] || currentCode;
  }

  getMappingStatusLabel(mapping: LmsMapping): string {
    if (mapping.status === 'Отключена') {
      return 'Отключена';
    }

    return this.evaluateMappingStatus(mapping);
  }

  private evaluateMappingStatus(mapping: LmsMapping): MappingStatus {
    if (!this.getCourse(mapping.doceboCourseId)) {
      return 'Курс не найден';
    }

    if (!mapping.certificateCode || !this.getCertificate(mapping.certificateCode)) {
      return 'Нет сертификата';
    }

    const duplicates = this.mappings.filter(item => item.doceboCourseId === mapping.doceboCourseId);
    if (duplicates.length > 1) {
      return 'Дубликат';
    }

    return mapping.status;
  }

  createMapping(): void {
    const selectedCourse = this.selectedCourse;

    if (!this.selectedTrainingCode || !selectedCourse || !this.selectedCertificateCode) {
      this.toastText = 'Заполните шаблон TRMS, курс Docebo и шаблон сертификата.';
      return;
    }

    const duplicateCourse = this.mappings.find(
      mapping => mapping.doceboCourseId === selectedCourse.id && mapping.trainingCode !== this.selectedTrainingCode,
    );

    const existing = this.mappings.find(mapping => mapping.trainingCode === this.selectedTrainingCode);
    const nextMapping: LmsMapping = {
      trainingCode: this.selectedTrainingCode,
      doceboCourseId: selectedCourse.id,
      doceboCourseCode: selectedCourse.code,
      certificateCode: this.selectedCertificateCode,
      certificateFileName: this.uploadedCertificateTemplateName || existing?.certificateFileName,
      certificateFileUploadedAt: this.uploadedCertificateTemplateName ? '11.06.2026 10:55' : existing?.certificateFileUploadedAt,
      status: duplicateCourse ? 'Дубликат' : 'Активна',
      autoIssue: this.autoIssue,
      reviewRequired: this.reviewRequired,
      updatedAt: '11.06.2026',
    };

    if (existing) {
      Object.assign(existing, nextMapping);
      this.toastText = duplicateCourse
        ? 'Связка обновлена, но Docebo course ID уже используется в другой карточке.'
        : 'Связка обновлена. Новые завершения LMS попадут в очередь сертификатов.';
      return;
    }

    this.mappings = [nextMapping, ...this.mappings];
    this.toastText = duplicateCourse
      ? 'Связка создана как дубликат. Проверьте course ID перед автосертификацией.'
      : 'Связка создана. Курс Docebo подключен к карточке TRMS.';
  }

  selectMapping(mapping: LmsMapping): void {
    this.selectedTrainingCode = mapping.trainingCode;
    this.selectedCourseId = mapping.doceboCourseId;
    this.selectedCertificateCode = mapping.certificateCode || this.certificateTemplates[0].code;
    this.autoIssue = mapping.autoIssue;
    this.reviewRequired = mapping.reviewRequired;
    this.uploadedCertificateTemplateName = mapping.certificateFileName || '';
    this.uploadedCertificateTemplateSize = '';
    this.uploadedCertificateTemplateStatus = mapping.certificateFileUploadedAt
      ? `Шаблон загружен ${mapping.certificateFileUploadedAt}`
      : 'Файл шаблона еще не загружен';
    this.toastText = 'Связка открыта для редактирования.';
  }

  uploadCertificateTemplate(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const allowedExtensions = ['pdf', 'docx', 'html', 'htm', 'png', 'jpg', 'jpeg'];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const maxSizeMb = 10;

    if (!allowedExtensions.includes(extension)) {
      this.uploadedCertificateTemplateStatus = 'Неверный формат. Разрешены PDF, DOCX, HTML, PNG, JPG.';
      this.toastText = 'Шаблон сертификата не загружен: неподдерживаемый формат файла.';
      input.value = '';
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      this.uploadedCertificateTemplateStatus = `Файл больше ${maxSizeMb} MB. Выберите более легкий шаблон.`;
      this.toastText = 'Шаблон сертификата не загружен: файл слишком большой.';
      input.value = '';
      return;
    }

    this.uploadedCertificateTemplateName = file.name;
    this.uploadedCertificateTemplateSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
    this.uploadedCertificateTemplateStatus = 'Шаблон готов к привязке к правилу интеграции.';
    this.toastText = 'Шаблон сертификата загружен в прототип. Сохраните связку, чтобы закрепить его за правилом.';
  }

  clearUploadedCertificateTemplate(): void {
    this.uploadedCertificateTemplateName = '';
    this.uploadedCertificateTemplateSize = '';
    this.uploadedCertificateTemplateStatus = 'Файл шаблона еще не загружен';
    this.toastText = 'Загруженный файл шаблона очищен.';
  }

  mapUnmappedCourse(course: DoceboCourse): void {
    this.selectedCourseId = course.id;
    this.searchText = '';
    this.toastText = 'Курс Docebo выбран. Теперь привяжите его к шаблону TRMS и сертификату.';
  }

  toggleMapping(mapping: LmsMapping): void {
    mapping.status = mapping.status === 'Отключена' ? this.evaluateMappingStatus(mapping) : 'Отключена';
    mapping.updatedAt = '11.06.2026';
  }

  testConnection(): void {
    this.syncState = 'Docebo API: доступен · webhook course.enrollment.completed: активен';
    this.lastSyncAt = '11.06.2026 10:45';
    this.toastText = 'Соединение проверено. Курсы и завершения доступны для синхронизации.';
  }

  importCourses(): void {
    this.lastSyncAt = '11.06.2026 10:47';
    this.toastText = `Импортировано курсов Docebo: ${this.doceboCourses.length}. Без связки: ${this.unmappedCourses.length}.`;
  }

  runQualityCheck(): void {
    this.mappings = this.mappings.map(mapping => ({
      ...mapping,
      status: mapping.status === 'Отключена' ? 'Отключена' : this.evaluateMappingStatus(mapping),
      updatedAt: '11.06.2026',
    }));
    this.toastText = this.qualityProblemsCount
      ? `Проверка завершена. Найдено проблем: ${this.qualityProblemsCount}.`
      : 'Проверка завершена. Все связки готовы к обработке завершений.';
  }

  resetForm(): void {
    this.selectedTrainingCode = this.trainingTemplates[0].code;
    this.selectedCourseId = this.doceboCourses[0].id;
    this.selectedCertificateCode = this.certificateTemplates[0].code;
    this.autoIssue = false;
    this.reviewRequired = true;
    this.uploadedCertificateTemplateName = '';
    this.uploadedCertificateTemplateSize = '';
    this.uploadedCertificateTemplateStatus = 'Файл шаблона еще не загружен';
    this.searchText = '';
    this.toastText = '';
  }
}
