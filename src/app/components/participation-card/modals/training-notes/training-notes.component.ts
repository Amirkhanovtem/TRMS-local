import { Component, Inject, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CreateUpdateTrainingNotesModalComponent } from '@participation-card-modals-training-notes-modals-create-update/create-update-training-notes-modal.component';
import { TrainingNoteModel } from '@participation-card-modals-training-notes-models/training-note.model';
import { TrainingNotesService } from '@participation-card-modals-training-notes-services/training-notes.service';

@Component({
  selector: 'app-training-notes',
  templateUrl: './training-notes.component.html',
  styleUrls: ['./training-notes.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class TrainingNotesComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'author',
      colTitleLocKey: 'noteAuthorColTable',
      modelPropertyPath: ['author', 'name'],
    },
    {
      colDef: 'createTs',
      colTitleLocKey: 'noteCreateTsColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'participantTrainingCard',
      colTitleLocKey: 'noteTargetColTable',
      modelPropertyPath: ['participantTrainingCard', 'name'],
    },
    {
      colDef: 'comment',
      colTitleLocKey: 'noteCommentColTable',
    },
    {
      colDef: 'attachment',
      colTitleLocKey: 'noteAttachmentColTable',
      modelPropertyPath: ['fileStorage', 'name'],
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
  ];

  constructor(
    injector: Injector,
    private trainingNotesService: TrainingNotesService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      trainingId: string;
      trainingName: string;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.loadTrainingNotes();
    this.modalComponent.changeCloseWithoutConfirmField(true);
  }

  openCreateModal(): void {
    const modalRef = this.newModal.open(CreateUpdateTrainingNotesModalComponent, {
      data: {
        trainingId: this.dialogParams.trainingId,
      },
    });

    this.createModalCloseHandler(modalRef);
  }

  openUpdateModal(): void {
    const selectedTrainingNote: TrainingNoteModel = this.table.getSingleSelectedRow();

    if (!selectedTrainingNote) {
      return;
    }

    const modalRef = this.newModal.open(CreateUpdateTrainingNotesModalComponent, {
      data: {
        trainingId: this.dialogParams.trainingId,
        model: selectedTrainingNote,
        isUpdate: true,
      },
    });

    this.createModalCloseHandler(modalRef);
  }

  createModalCloseHandler(modalRef: MatDialogRef<CreateUpdateTrainingNotesModalComponent>): void {
    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTrainingNotes();
      }
    });
  }

  loadTrainingNotes(): void {
    this.trainingNotesService.list(this.dialogParams.trainingId).subscribe({
      next: data => this.table.commonLoadTableHandler(data),
      error: e => this.table.errorResponseHandler(e),
    });
  }

  openDeleteModal(): void {
    const modalRef = this.showConfirmModal(this.localization.getLocalTextFromKey('deleteRowConfirmTitle'));

    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete();
      }
    });
  }

  delete(): void {
    const listId: Array<string> = this.table.selection?.selected.map(object => object.id);

    this.trainingNotesService.delete(listId).subscribe({
      next: data => this.loadTrainingNotes(),
      error: e => this.errorResponseHandler(e),
    });
  }

  loadAttachedFile(fileStorage: StandardFileStorageModel, $event): void {
    $event.stopPropagation();
    if (fileStorage) {
      const fileId = fileStorage.id,
        fileName = fileStorage.name;

      this.trainingNotesService.loadFileById(fileId, fileName);
    }
  }
}
