import { Component, Injector, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CompleteTrainingModel } from '@complete-trainings-models/complete-training.model';
import { CompleteTrainingsService } from '@complete-trainings-services/complete-trainings.service';
import { Role } from '@config/role';
import { ParentEventModel } from '@event-models/parent-event.model';
import { CreateUpdateSyllabusModalComponent } from '@event-syllabus-modals-create-update/create-update-syllabus-modal.component';
import { CreateUpdateTrainingModalComponent } from '@event-training-modals-create-update/create-update-training-modal.component';
import { EventParentTypeEnum } from '@gantt-models/event-parent-type.enum';

@Component({
  selector: 'app-complete-trainings',
  templateUrl: './complete-trainings.component.html',
  styleUrls: ['./complete-trainings.component.scss', '../../../styles.scss'],
  standalone: false,
})
export class CompleteTrainingsComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'completedTrainingsNameColTable',
    },
    {
      colDef: 'trainingCategory',
      colTitleLocKey: 'completedTrainingsCategoryColTable',
      modelPropertyPath: ['trainingCategory', 'name'],
    },
    {
      colDef: 'startDate',
      colTitleLocKey: 'completedTrainingsStartDateColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'endDate',
      colTitleLocKey: 'completedTrainingsEndDateColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'factualStatus',
      colTitleLocKey: 'completedTrainingsFactualStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
  ];

  constructor(
    private completeTrainingsService: CompleteTrainingsService,
    private modal: MatDialog,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadCompleteTrainings();
  }

  private loadCompleteTrainings() {
    this.table.loading = true;

    this.completeTrainingsService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  public currentUserCanEditEvent(event): boolean {
    return event.isEditable;
  }

  public currentUserCanViewEventModal(): boolean {
    const rolesCanView: Array<string> = [Role.ADMIN, Role.SENIOR_PLANER, Role.PLANER, Role.TRAINER];

    return this.currentUserHasSomeRole(rolesCanView);
  }

  public openEditEventModal(completedTraining: CompleteTrainingModel): void {
    if (!this.currentUserCanViewEventModal()) {
      return;
    }

    const parentEvent: ParentEventModel = completedTraining.parentEvent,
      isCurrentUserCanEditEvent = this.currentUserCanEditEvent(parentEvent);

    switch (parentEvent.eventParentType.id) {
      case EventParentTypeEnum.SYLLABUS: {
        if (isCurrentUserCanEditEvent) {
          this.openSyllabusEditModal(parentEvent);
        } else {
          this.openSyllabusViewModal(parentEvent);
        }
        break;
      }
      case EventParentTypeEnum.TRAINING: {
        if (isCurrentUserCanEditEvent) {
          this.openTrainingEditModal(parentEvent);
        } else {
          this.openTrainingViewModal(parentEvent);
        }
        break;
      }
    }
  }

  private openSyllabusEditModal(syllabusIdNameModel): void {
    const modalRef = this.newModal.open(CreateUpdateSyllabusModalComponent, {
      data: {
        model: syllabusIdNameModel,
        isUpdate: true,
      },
    });

    this.closeCreateUpdateHandler(modalRef);
  }

  private openSyllabusViewModal(syllabusIdNameModel): void {
    this.newModal.open(CreateUpdateSyllabusModalComponent, {
      data: {
        model: syllabusIdNameModel,
        isView: true,
      },
    });
  }

  private openTrainingEditModal(trainingIdNameModel): void {
    const modalRef = this.newModal.open(CreateUpdateTrainingModalComponent, {
      data: {
        model: trainingIdNameModel,
        isUpdate: true,
      },
    });

    this.closeCreateUpdateHandler(modalRef);
  }

  private closeCreateUpdateHandler(
    modalRef: MatDialogRef<CreateUpdateTrainingModalComponent | CreateUpdateSyllabusModalComponent>,
  ): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.loadCompleteTrainings();
        }
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private openTrainingViewModal(trainingIdNameModel): void {
    this.newModal.open(CreateUpdateTrainingModalComponent, {
      data: {
        model: trainingIdNameModel,
        isView: true,
      },
    });
  }
}
