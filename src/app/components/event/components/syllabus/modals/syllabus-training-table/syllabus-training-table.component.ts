import { Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { ModuleModel } from '@event-module-models/module.model';
import { SyllabusModel } from '@event-syllabus-models/syllabus.model';
import { CreateUpdateTrainingModalComponent } from '@event-training-modals-create-update/create-update-training-modal.component';
import { TrainingModel } from '@event-training-models/training.model';

@Component({
  selector: 'app-syllabus-training-table',
  templateUrl: './syllabus-training-table.component.html',
  styleUrls: ['./syllabus-training-table.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class SyllabusTrainingTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() syllabus: SyllabusModel = new SyllabusModel();
  @Input() isUpdatingSyllabus?: boolean = false;
  @Input() isView?: boolean = false;
  @Output() updateChildComponentsTable? = new EventEmitter();

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'syllabusTrainingsListTableNameCol',
    },
  ];

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateTrainingDataSource();
  }

  updateTrainingDataSource() {
    this.table.commonLoadTableHandler(this.syllabus.trainings);
  }

  openCreateUpdateOrViewTrainingView(training: TrainingModel): void {
    if (this.isView) {
      this.openViewTraining(training);
    } else {
      this.openCreatUpdateTraining(training);
    }
  }

  openViewTraining(training: TrainingModel): void {
    this.newModal.open(CreateUpdateTrainingModalComponent, {
      data: {
        model: training,
        allModulesInSyllabus: this.collectAllModulesBySyllabus(),
        isParentSyllabus: true,
        isUpdatingSyllabus: this.isUpdatingSyllabus,
        isView: true,
      },
    });
  }

  openCreatUpdateTraining(training: TrainingModel): void {
    const modalRef = this.newModal.open(CreateUpdateTrainingModalComponent, {
      data: {
        model: training,
        allModulesInSyllabus: this.collectAllModulesBySyllabus(),
        isParentSyllabus: true,
        isUpdatingSyllabus: this.isUpdatingSyllabus,
      },
    });

    this.closeModalHandler(modalRef);
  }

  checkTraining(training: TrainingModel): boolean {
    return Object.assign(new TrainingModel(), training).checkTraining();
  }

  closeModalHandler(modalRef: MatDialogRef<CreateUpdateTrainingModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        this.updateChildComponentsTable.emit();
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private collectAllModulesBySyllabus(): Array<ModuleModel> {
    const allModules: Array<ModuleModel> = [];

    this.syllabus.trainings.forEach(training => {
      training.trainingModules.forEach(module => {
        allModules.push(module);
      });
    });

    return allModules;
  }
}
