import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type FeedbackQuestionType = 'text' | 'single' | 'multi' | 'likert' | 'nps' | 'scale' | 'scat';
export type FeedbackFormStatus = 'draft' | 'active' | 'archived';
export type FeedbackAssignmentStatus = 'pending' | 'completed';
export type FeedbackAttendanceStatus = 'enrolled' | 'in_progress' | 'completed';

export interface FeedbackQuestion {
  id: string;
  type: FeedbackQuestionType;
  title: string;
  required: boolean;
  options?: Array<string>;
  minLabel?: string;
  maxLabel?: string;
}

export interface FeedbackForm {
  id: string;
  title: string;
  status: FeedbackFormStatus;
  trainingTemplateCode: string;
  trainingTitle: string;
  owner: string;
  updatedAt: string;
  responses: number;
  averageScore: number;
  questions: Array<FeedbackQuestion>;
}

export interface FeedbackAssignment {
  id: string;
  formId: string;
  trainingSessionCode: string;
  trainingTitle: string;
  trainingDate: string;
  participantName: string;
  department: string;
  status: FeedbackAssignmentStatus;
  attendanceStatus: FeedbackAttendanceStatus;
  source: 'notification' | 'qr';
  qrToken: string;
}

export interface FeedbackResponse {
  id: string;
  formId: string;
  assignmentId: string;
  trainingTitle: string;
  participantName: string;
  department: string;
  submittedAt: string;
  nps: number;
  satisfaction: number;
  source: 'notification' | 'qr';
  comment: string;
}

@Injectable({ providedIn: 'root' })
export class FeedbackPrototypeService {
  private readonly formsSubject = new BehaviorSubject<Array<FeedbackForm>>([
    {
      id: 'fb-orientation',
      title: 'Оценка Orientation Day',
      status: 'active',
      trainingTemplateCode: 'ORIENTATION_DAY',
      trainingTitle: 'Orientation Day',
      owner: 'Training Academy',
      updatedAt: '11.06.2026',
      responses: 18,
      averageScore: 4.7,
      questions: [
        {
          id: 'q1',
          type: 'likert',
          title: 'Материал был полезен для работы',
          required: true,
          minLabel: 'Не согласен',
          maxLabel: 'Полностью согласен',
        },
        {
          id: 'q2',
          type: 'nps',
          title: 'Насколько вероятно, что вы порекомендуете тренинг коллеге?',
          required: true,
        },
        {
          id: 'q3',
          type: 'text',
          title: 'Что улучшить в программе?',
          required: false,
        },
      ],
    },
    {
      id: 'fb-security',
      title: 'Security Awareness feedback',
      status: 'active',
      trainingTemplateCode: 'SEC_AWARENESS_2026',
      trainingTitle: 'Security Awareness 2026',
      owner: 'IT Security / Training Academy',
      updatedAt: '09.06.2026',
      responses: 42,
      averageScore: 4.4,
      questions: [
        { id: 'q1', type: 'scale', title: 'Оцените понятность курса', required: true, minLabel: '1', maxLabel: '5' },
        { id: 'q2', type: 'scat', title: 'SCAT: какие факторы риска были разобраны?', required: true },
        { id: 'q3', type: 'single', title: 'Формат курса был удобен?', required: true, options: ['Да', 'Нет', 'Частично'] },
      ],
    },
    {
      id: 'fb-draft',
      title: 'Шаблон для технических тренингов',
      status: 'draft',
      trainingTemplateCode: 'TECH_TEMPLATE',
      trainingTitle: 'Technical Training',
      owner: 'Training Systems',
      updatedAt: '05.06.2026',
      responses: 0,
      averageScore: 0,
      questions: [
        { id: 'q1', type: 'multi', title: 'Какие темы требуют повторения?', required: false, options: ['Практика', 'Теория', 'Система', 'Процедуры'] },
      ],
    },
  ]);

  private readonly assignmentsSubject = new BehaviorSubject<Array<FeedbackAssignment>>([
    {
      id: 'as-orientation-ta',
      formId: 'fb-orientation',
      trainingSessionCode: 'TR-ORIENTATION-090626',
      trainingTitle: 'Orientation Day',
      trainingDate: '09.06.2026',
      participantName: 'Темирлан Амирханов',
      department: 'Training Academy',
      status: 'pending',
      attendanceStatus: 'in_progress',
      source: 'qr',
      qrToken: 'QR-ORIENT-TA-090626',
    },
    {
      id: 'as-security-ta',
      formId: 'fb-security',
      trainingSessionCode: 'TR-SEC-010626',
      trainingTitle: 'Security Awareness 2026',
      trainingDate: '01.06.2026',
      participantName: 'Темирлан Амирханов',
      department: 'Training Academy',
      status: 'completed',
      attendanceStatus: 'completed',
      source: 'notification',
      qrToken: 'QR-SEC-TA-010626',
    },
    {
      id: 'as-security-fa',
      formId: 'fb-security',
      trainingSessionCode: 'TR-SEC-010626',
      trainingTitle: 'Security Awareness 2026',
      trainingDate: '01.06.2026',
      participantName: 'Фатима Алекперзаде',
      department: 'Training Academy',
      status: 'pending',
      attendanceStatus: 'enrolled',
      source: 'notification',
      qrToken: 'QR-SEC-FA-010626',
    },
  ]);

  private readonly responsesSubject = new BehaviorSubject<Array<FeedbackResponse>>([
    {
      id: 'resp-security-ta',
      formId: 'fb-security',
      assignmentId: 'as-security-ta',
      trainingTitle: 'Security Awareness 2026',
      participantName: 'Темирлан Амирханов',
      department: 'Training Academy',
      submittedAt: '01.06.2026 16:20',
      nps: 9,
      satisfaction: 5,
      source: 'notification',
      comment: 'Короткий и понятный курс, удобно проходить онлайн.',
    },
    {
      id: 'resp-orientation-sz',
      formId: 'fb-orientation',
      assignmentId: 'seed-1',
      trainingTitle: 'Orientation Day',
      participantName: 'Шерхан Жунусбай',
      department: 'Training Academy',
      submittedAt: '09.06.2026 17:05',
      nps: 8,
      satisfaction: 5,
      source: 'qr',
      comment: 'QR после занятия ускорил отметку завершения.',
    },
  ]);

  public readonly forms$ = this.formsSubject.asObservable();
  public readonly assignments$ = this.assignmentsSubject.asObservable();
  public readonly responses$ = this.responsesSubject.asObservable();

  public get forms(): Array<FeedbackForm> {
    return this.formsSubject.value;
  }

  public get assignments(): Array<FeedbackAssignment> {
    return this.assignmentsSubject.value;
  }

  public get responses(): Array<FeedbackResponse> {
    return this.responsesSubject.value;
  }

  public assignmentsForParticipant(participantName: string): Array<FeedbackAssignment> {
    return this.assignments.filter(assignment => assignment.participantName === participantName);
  }

  public completeAssignment(assignmentId: string, source: 'notification' | 'qr'): void {
    const assignment = this.assignments.find(item => item.id === assignmentId);
    if (!assignment || assignment.status === 'completed') {
      return;
    }

    const nextAssignments = this.assignments.map(item =>
      item.id === assignmentId
        ? { ...item, status: 'completed' as const, attendanceStatus: 'completed' as const, source }
        : item,
    );
    this.assignmentsSubject.next(nextAssignments);

    const response: FeedbackResponse = {
      id: `resp-${Date.now()}`,
      formId: assignment.formId,
      assignmentId: assignment.id,
      trainingTitle: assignment.trainingTitle,
      participantName: assignment.participantName,
      department: assignment.department,
      submittedAt: '11.06.2026 17:30',
      nps: source === 'qr' ? 10 : 9,
      satisfaction: 5,
      source,
      comment: source === 'qr' ? 'Оставлено через QR после тренинга.' : 'Оставлено из уведомления Learning Journey.',
    };
    this.responsesSubject.next([response, ...this.responses]);
    this.recalculateFormStats(assignment.formId);
  }

  public addQuestion(formId: string, type: FeedbackQuestionType): void {
    const typeLabel: Record<FeedbackQuestionType, string> = {
      text: 'Текстовый ответ',
      single: 'Один вариант',
      multi: 'Несколько вариантов',
      likert: 'Шкала Лихерта',
      nps: 'NPS',
      scale: 'Оценочная шкала',
      scat: 'SCAT вопрос',
    };

    this.formsSubject.next(
      this.forms.map(form =>
        form.id === formId
          ? {
              ...form,
              updatedAt: '11.06.2026',
              questions: [
                ...form.questions,
                {
                  id: `q-${Date.now()}`,
                  type,
                  title: `Новый вопрос: ${typeLabel[type]}`,
                  required: type !== 'text',
                  options: type === 'single' || type === 'multi' ? ['Да', 'Нет', 'Частично'] : undefined,
                  minLabel: type === 'likert' || type === 'scale' ? 'Минимум' : undefined,
                  maxLabel: type === 'likert' || type === 'scale' ? 'Максимум' : undefined,
                },
              ],
            }
          : form,
      ),
    );
  }

  public archiveForm(formId: string): void {
    this.formsSubject.next(
      this.forms.map(form => (form.id === formId ? { ...form, status: 'archived', updatedAt: '11.06.2026' } : form)),
    );
  }

  public activateForm(formId: string): void {
    this.formsSubject.next(
      this.forms.map(form => (form.id === formId ? { ...form, status: 'active', updatedAt: '11.06.2026' } : form)),
    );
  }

  public linkFormToTraining(formId: string, trainingTitle: string, trainingTemplateCode: string): void {
    this.formsSubject.next(
      this.forms.map(form =>
        form.id === formId ? { ...form, trainingTitle, trainingTemplateCode, updatedAt: '11.06.2026' } : form,
      ),
    );
  }

  public export(format: 'xlsx' | 'pdf'): string {
    return format === 'xlsx' ? 'Excel выгрузка Feedback подготовлена' : 'PDF отчет Feedback подготовлен';
  }

  private recalculateFormStats(formId: string): void {
    const formResponses = this.responses.filter(response => response.formId === formId);
    const averageScore = formResponses.length
      ? Number((formResponses.reduce((sum, response) => sum + response.satisfaction, 0) / formResponses.length).toFixed(1))
      : 0;

    this.formsSubject.next(
      this.forms.map(form =>
        form.id === formId
          ? {
              ...form,
              responses: formResponses.length,
              averageScore,
            }
          : form,
      ),
    );
  }
}
