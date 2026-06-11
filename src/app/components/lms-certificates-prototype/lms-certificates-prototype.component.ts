import { Component } from '@angular/core';

type QueueTab = 'ready' | 'mapping' | 'errors' | 'issued' | 'duplicates';
type CompletionStatus = 'Готов к выпуску' | 'Требует сопоставления' | 'Ошибка данных' | 'Выпущен' | 'Дубликат' | 'Не завершен';

interface CompletionRecord {
  id: number;
  employee: string;
  personnelNumber: string;
  doceboUserId: string;
  department: string;
  position: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  trainingCode?: string;
  certificateTemplate?: string;
  completedAt: string;
  score: number;
  status: CompletionStatus;
  source: 'webhook' | 'reconciliation';
  issuedAt?: string;
  problem?: string;
}

@Component({
  selector: 'app-lms-certificates-prototype',
  standalone: false,
  templateUrl: './lms-certificates-prototype.component.html',
  styleUrls: ['./lms-certificates-prototype.component.scss'],
})
export class LmsCertificatesPrototypeComponent {
  readonly tabs: { id: QueueTab; title: string }[] = [
    { id: 'ready', title: 'Готово к выпуску' },
    { id: 'mapping', title: 'Требует сопоставления' },
    { id: 'errors', title: 'Ошибки данных' },
    { id: 'issued', title: 'Выпущено' },
    { id: 'duplicates', title: 'Дубликаты' },
  ];

  activeTab: QueueTab = 'ready';

  filters = {
    course: 'all',
    department: 'all',
    code: '',
    status: 'all',
  };

  records: CompletionRecord[] = [
    {
      id: 1,
      employee: 'Темирлан Амирханов',
      personnelNumber: 'A10234',
      doceboUserId: 'docebo-user-771',
      department: 'Training Academy',
      position: 'Supervisor Training Systems',
      courseId: 'docebo-10487',
      courseCode: 'LMS-DL-2026',
      courseTitle: 'Digital Learning Strategy',
      trainingCode: 'TRMS-DL-STRATEGY',
      certificateTemplate: 'CERT-DL-STRATEGY',
      completedAt: '10.06.2026 14:22',
      score: 96,
      status: 'Готов к выпуску',
      source: 'webhook',
    },
    {
      id: 2,
      employee: 'Шерхан Жунусбай',
      personnelNumber: 'A10881',
      doceboUserId: 'docebo-user-883',
      department: 'Training Academy',
      position: 'Training Systems Specialist',
      courseId: 'docebo-10422',
      courseCode: 'LMS-SEC-AW-2026',
      courseTitle: 'Security Awareness 2026 (Air Astana)',
      trainingCode: 'TRMS-SEC-2026',
      certificateTemplate: 'CERT-SEC-2026',
      completedAt: '09.06.2026 11:05',
      score: 88,
      status: 'Готов к выпуску',
      source: 'webhook',
    },
    {
      id: 3,
      employee: 'Фатима Алекперзаде',
      personnelNumber: 'A10775',
      doceboUserId: 'docebo-user-904',
      department: 'Cabin Safety',
      position: 'Cabin Training Coordinator',
      courseId: 'docebo-10770',
      courseCode: 'LMS-HF-P145',
      courseTitle: 'Human Factors Initial P145',
      trainingCode: 'TRMS-HF-P145',
      certificateTemplate: 'CERT-HF-P145',
      completedAt: '08.06.2026 16:40',
      score: 91,
      status: 'Выпущен',
      source: 'reconciliation',
      issuedAt: '09.06.2026',
    },
    {
      id: 4,
      employee: 'Аружан Омирзакова',
      personnelNumber: 'A11902',
      doceboUserId: 'docebo-user-992',
      department: 'Operations',
      position: 'Training Coordinator',
      courseId: 'docebo-10911',
      courseCode: 'LMS-DG-REC',
      courseTitle: 'Dangerous Goods Recurrent',
      trainingCode: 'TRMS-DG-RECURRENT',
      completedAt: '07.06.2026 10:15',
      score: 74,
      status: 'Ошибка данных',
      source: 'webhook',
      problem: 'В связке нет шаблона сертификата.',
    },
    {
      id: 5,
      employee: 'Неизвестный пользователь Docebo',
      personnelNumber: 'нет в TRMS',
      doceboUserId: 'docebo-user-1002',
      department: 'не определен',
      position: 'не определена',
      courseId: 'docebo-11015',
      courseCode: 'LMS-CUST-EXP-ADV',
      courseTitle: 'Customer Experience Advanced',
      completedAt: '10.06.2026 18:01',
      score: 82,
      status: 'Требует сопоставления',
      source: 'webhook',
      problem: 'Курс Docebo не привязан к шаблону TRMS.',
    },
    {
      id: 6,
      employee: 'Темирлан Амирханов',
      personnelNumber: 'A10234',
      doceboUserId: 'docebo-user-771',
      department: 'Training Academy',
      position: 'Supervisor Training Systems',
      courseId: 'docebo-10487',
      courseCode: 'LMS-DL-2026',
      courseTitle: 'Digital Learning Strategy',
      trainingCode: 'TRMS-DL-STRATEGY',
      certificateTemplate: 'CERT-DL-STRATEGY',
      completedAt: '10.06.2026 14:24',
      score: 96,
      status: 'Дубликат',
      source: 'reconciliation',
      problem: 'Такое завершение уже пришло через webhook.',
    },
  ];

  selectedRecord: CompletionRecord = this.records[0];
  toastText = '';
  lastReconciliationAt = '11.06.2026 09:30';

  get courses(): string[] {
    return [...new Set(this.records.map(record => record.courseTitle))];
  }

  get departments(): string[] {
    return [...new Set(this.records.map(record => record.department))];
  }

  get statuses(): CompletionStatus[] {
    return ['Готов к выпуску', 'Требует сопоставления', 'Ошибка данных', 'Выпущен', 'Дубликат', 'Не завершен'];
  }

  get filteredRecords(): CompletionRecord[] {
    const codeQuery = this.filters.code.trim().toLowerCase();

    return this.records.filter(record => {
      const tabMatches = this.getRecordTab(record) === this.activeTab;
      const courseMatches = this.filters.course === 'all' || record.courseTitle === this.filters.course;
      const departmentMatches = this.filters.department === 'all' || record.department === this.filters.department;
      const statusMatches = this.filters.status === 'all' || record.status === this.filters.status;
      const codeMatches =
        !codeQuery ||
        [record.courseCode, record.courseId, record.trainingCode, record.certificateTemplate, record.personnelNumber]
          .filter(Boolean)
          .some(value => value!.toLowerCase().includes(codeQuery));

      return tabMatches && courseMatches && departmentMatches && statusMatches && codeMatches;
    });
  }

  get readyCount(): number {
    return this.getTabCount('ready');
  }

  get issuedCount(): number {
    return this.getTabCount('issued');
  }

  get attentionCount(): number {
    return this.getTabCount('mapping') + this.getTabCount('errors') + this.getTabCount('duplicates');
  }

  get selectedIsIssuable(): boolean {
    return this.selectedRecord.status === 'Готов к выпуску';
  }

  getTabCount(tab: QueueTab): number {
    return this.records.filter(record => this.getRecordTab(record) === tab).length;
  }

  getRecordTab(record: CompletionRecord): QueueTab {
    if (record.status === 'Готов к выпуску') {
      return 'ready';
    }

    if (record.status === 'Требует сопоставления') {
      return 'mapping';
    }

    if (record.status === 'Выпущен') {
      return 'issued';
    }

    if (record.status === 'Дубликат') {
      return 'duplicates';
    }

    return 'errors';
  }

  selectTab(tab: QueueTab): void {
    this.activeTab = tab;
    const firstRecord = this.filteredRecords[0];
    if (firstRecord) {
      this.selectedRecord = firstRecord;
    }
  }

  selectRecord(record: CompletionRecord): void {
    this.selectedRecord = record;
  }

  issueCertificate(record: CompletionRecord): void {
    if (record.status !== 'Готов к выпуску') {
      this.toastText = 'Сертификат можно выпустить только для записи со статусом "Готов к выпуску".';
      this.selectedRecord = record;
      return;
    }

    if (!record.certificateTemplate || !record.trainingCode) {
      record.status = 'Ошибка данных';
      record.problem = 'Нет шаблона TRMS или шаблона сертификата.';
      this.toastText = 'Запись переведена в ошибки данных. Не хватает связки для выпуска.';
      return;
    }

    record.status = 'Выпущен';
    record.issuedAt = '11.06.2026';
    this.selectedRecord = record;
    this.toastText = `Сертификат ${record.certificateTemplate} выпущен для ${record.employee}.`;
  }

  issueFilteredCertificates(): void {
    const readyRecords = this.filteredRecords.filter(record => record.status === 'Готов к выпуску');

    readyRecords.forEach(record => {
      record.status = 'Выпущен';
      record.issuedAt = '11.06.2026';
    });

    this.toastText = readyRecords.length
      ? `Массовый выпуск завершен. Выпущено сертификатов: ${readyRecords.length}.`
      : 'В текущей выборке нет записей, готовых к выпуску.';
  }

  markAsResolved(record: CompletionRecord): void {
    if (!record.trainingCode) {
      record.trainingCode = 'TRMS-SEC-2026';
    }

    if (!record.certificateTemplate) {
      record.certificateTemplate = 'CERT-SEC-2026';
    }

    record.status = 'Готов к выпуску';
    record.problem = undefined;
    this.selectedRecord = record;
    this.toastText = 'Запись сопоставлена и перенесена в очередь выпуска.';
  }

  runReconciliation(): void {
    this.lastReconciliationAt = '11.06.2026 10:50';
    this.toastText = 'Reconciliation выполнен: пропущенные завершения загружены, дубликаты отмечены.';
  }

  resetFilters(): void {
    this.filters = {
      course: 'all',
      department: 'all',
      code: '',
      status: 'all',
    };
    this.toastText = '';
  }
}
