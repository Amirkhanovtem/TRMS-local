import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { ParticipantTrainingCardService } from '@participant-training-card-services/participant-training-card.service';
import { TrainingNoteModel } from '@participation-card-modals-training-notes-models/training-note.model';
import { TrainingNotesService } from '@participation-card-modals-training-notes-services/training-notes.service';

@Component({
  selector: 'app-create-update-training-notes-modal',
  templateUrl: './create-update-training-notes-modal.component.html',
  styleUrls: ['./create-update-training-notes-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateTrainingNotesModalComponent
  extends CommonCreateUpdateComponents<TrainingNoteModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public trainingNote: TrainingNoteModel = new TrainingNoteModel();
  public allParticipantCards: Array<StandardNameIdModel> = [];
  public override dialogParams: {
    model: TrainingNoteModel;
    trainingId: string;
    isUpdate?: boolean;
    isView?: boolean;
  };

  constructor(
    injector: Injector,
    private trainingNotesService: TrainingNotesService,
    private participantTrainingCardService: ParticipantTrainingCardService,
  ) {
    super(injector);
    this.createForm();
  }

  createForm() {
    this.modalForm = this.formBuilder.group({
      comment: ['', [Validators.required, this.noWhitespaceValidator]],
    });
  }

  ngOnInit(): void {
    this.loadAllParticipantCardsByTrainingId();
    this.loadTrainingNoteDetail();
  }

  loadTrainingNoteDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.trainingNotesService.getById(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.trainingNote = data;
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  loadAllParticipantCardsByTrainingId(): void {
    this.participantTrainingCardService.getAllParticipantCardsByTraining(this.dialogParams.trainingId).subscribe({
      next: data => (this.allParticipantCards = data),
      error: e => this.errorResponseHandler(e),
    });
  }

  public createOrSaveNote(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create(): void {
    this.trainingNote.training = {
      id: this.dialogParams.trainingId,
      name: null,
    };

    this.trainingNotesService
      .create(this.trainingNote)
      .subscribe({
        next: data => this.modalComponent.closeCurrentModal(true),
        error: e => this.errorResponseHandler(e),
      })
      .add(() => this.standardCompleteHandler());
  }

  update(): void {
    this.trainingNotesService
      .update(this.trainingNote)
      .subscribe({
        next: data => this.modalComponent.closeCurrentModal(true),
        error: e => this.errorResponseHandler(e),
      })
      .add(() => this.standardCompleteHandler());
  }
}
