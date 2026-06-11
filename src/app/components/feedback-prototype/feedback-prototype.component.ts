import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FeedbackAssignment,
  FeedbackForm,
  FeedbackPrototypeService,
  FeedbackQuestionType,
  FeedbackResponse,
} from '@components/feedback-prototype/feedback-prototype.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feedback-prototype',
  templateUrl: './feedback-prototype.component.html',
  styleUrls: ['./feedback-prototype.component.scss'],
  standalone: false,
})
export class FeedbackPrototypeComponent implements OnInit, OnDestroy {
  public forms: Array<FeedbackForm> = [];
  public assignments: Array<FeedbackAssignment> = [];
  public responses: Array<FeedbackResponse> = [];
  public selectedFormId = 'fb-orientation';
  public responseFilter = '';
  public toastText = '';
  public linkDraft = {
    trainingTitle: 'Customer Experience Advanced',
    trainingTemplateCode: 'CUST_EXP_ADV',
  };

  public readonly questionTypes: Array<{ type: FeedbackQuestionType; label: string }> = [
    { type: 'likert', label: 'Шкала Лихерта' },
    { type: 'nps', label: 'NPS' },
    { type: 'scat', label: 'SCAT' },
    { type: 'scale', label: 'Оценочная шкала' },
    { type: 'single', label: 'Один вариант' },
    { type: 'multi', label: 'Несколько вариантов' },
    { type: 'text', label: 'Текст' },
  ];

  private readonly subscriptions = new Subscription();
  private toastTimer: ReturnType<typeof setTimeout>;

  constructor(private readonly feedbackService: FeedbackPrototypeService) {}

  public ngOnInit(): void {
    this.subscriptions.add(this.feedbackService.forms$.subscribe(forms => (this.forms = forms)));
    this.subscriptions.add(this.feedbackService.assignments$.subscribe(assignments => (this.assignments = assignments)));
    this.subscriptions.add(this.feedbackService.responses$.subscribe(responses => (this.responses = responses)));
  }

  public ngOnDestroy(): void {
    clearTimeout(this.toastTimer);
    this.subscriptions.unsubscribe();
  }

  public get selectedForm(): FeedbackForm {
    return this.forms.find(form => form.id === this.selectedFormId) ?? this.forms[0];
  }

  public get selectedFormAssignments(): Array<FeedbackAssignment> {
    return this.assignments.filter(assignment => assignment.formId === this.selectedForm?.id);
  }

  public get filteredResponses(): Array<FeedbackResponse> {
    const query = this.responseFilter.trim().toLowerCase();
    if (!query) {
      return this.responses;
    }

    return this.responses.filter(response =>
      [
        response.trainingTitle,
        response.participantName,
        response.department,
        response.comment,
        response.source,
        response.submittedAt,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }

  public get completionRate(): number {
    if (!this.assignments.length) {
      return 0;
    }
    return Math.round((this.assignments.filter(assignment => assignment.status === 'completed').length / this.assignments.length) * 100);
  }

  public get averageNps(): number {
    if (!this.responses.length) {
      return 0;
    }
    return Math.round(this.responses.reduce((sum, response) => sum + response.nps, 0) / this.responses.length);
  }

  public addQuestion(type: FeedbackQuestionType): void {
    if (!this.selectedForm) {
      return;
    }
    this.feedbackService.addQuestion(this.selectedForm.id, type);
    this.showToast('Вопрос добавлен в опросник');
  }

  public archiveSelectedForm(): void {
    if (!this.selectedForm) {
      return;
    }
    this.feedbackService.archiveForm(this.selectedForm.id);
    this.showToast('Опросник отправлен в архив');
  }

  public activateSelectedForm(): void {
    if (!this.selectedForm) {
      return;
    }
    this.feedbackService.activateForm(this.selectedForm.id);
    this.showToast('Опросник активирован');
  }

  public linkSelectedForm(): void {
    if (!this.selectedForm || !this.linkDraft.trainingTitle.trim() || !this.linkDraft.trainingTemplateCode.trim()) {
      this.showToast('Заполните тренинг и код шаблона');
      return;
    }

    this.feedbackService.linkFormToTraining(
      this.selectedForm.id,
      this.linkDraft.trainingTitle.trim(),
      this.linkDraft.trainingTemplateCode.trim(),
    );
    this.showToast('Опросник связан с тренингом');
  }

  public completeFromAdmin(assignment: FeedbackAssignment): void {
    this.feedbackService.completeAssignment(assignment.id, 'notification');
    this.showToast('Статус участия и feedback обновлены');
  }

  public export(format: 'xlsx' | 'pdf'): void {
    this.showToast(this.feedbackService.export(format));
  }

  private showToast(message: string): void {
    clearTimeout(this.toastTimer);
    this.toastText = message;
    this.toastTimer = setTimeout(() => {
      this.toastText = '';
    }, 2200);
  }
}
