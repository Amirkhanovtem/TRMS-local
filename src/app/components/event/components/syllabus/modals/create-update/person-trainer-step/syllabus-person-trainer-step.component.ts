import { Component, Injector, Input, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CreatingEventPersonTableComponent } from '@event-components/general-child-table/person/creating-event-person-table.component';
import { ModuleModel } from '@event-module-models/module.model';
import { CreateUpdateSyllabusModalComponent } from '@event-syllabus-modals-create-update/create-update-syllabus-modal.component';
import { SyllabusTrainingTableComponent } from '@event-syllabus-modals-training-table/syllabus-training-table.component';
import { PersonService } from '@person-services/person.service';
import { CreateUpdateTrainerModalComponent } from '@trainer-modals-create-update/create-update-trainer-modal.component';
import { TrainerModel } from '@trainer-models/trainer.model';

@Component({
  selector: 'app-syllabus-person-trainer-step',
  templateUrl: './syllabus-person-trainer-step.component.html',
  styleUrls: ['./syllabus-person-trainer-step.component.scss', '../../../../../../../../styles.scss'],
  standalone: false,
})
export class SyllabusPersonTrainerStepComponent extends CommonComponent {
  @Input() parent: CreateUpdateSyllabusModalComponent;
  @ViewChild(CreatingEventPersonTableComponent) syllabusPersonTableComponent: CreatingEventPersonTableComponent;
  @ViewChild(SyllabusTrainingTableComponent) syllabusTrainingTableComponent: SyllabusTrainingTableComponent;

  constructor(
    injector: Injector,
    private personService: PersonService,
  ) {
    super(injector);
  }

  updateChildComponentsTable(): void {
    this.updatePersonTable();
    this.updateTrainingTable();
  }

  private updatePersonTable(): void {
    this.syllabusPersonTableComponent.modules = this.collectAllModules();
    this.syllabusPersonTableComponent.updatePersonDataSource();
  }

  private updateTrainingTable(): void {
    this.syllabusTrainingTableComponent.syllabus = this.parent.syllabus;
    this.syllabusTrainingTableComponent.updateTrainingDataSource();
  }

  collectAllModules(): Array<ModuleModel> {
    return this.parent.syllabusService.collectAllModules(this.parent.syllabus);
  }

  getAllUniqueMainTrainers(): Array<TrainerModel> {
    return this.parent.syllabusService.getAllUniqueMainTrainers(this.parent.syllabus);
  }

  openTrainerViewModal($event, trainer: TrainerModel): void {
    $event.stopPropagation();

    this.newModal.open(CreateUpdateTrainerModalComponent, {
      data: {
        model: trainer,
        isView: true,
      },
    });
  }

  getAllUniqueLinearTrainers(): Array<TrainerModel> {
    return this.parent.syllabusService.getAllUniqueLinearTrainers(this.parent.syllabus);
  }
}
