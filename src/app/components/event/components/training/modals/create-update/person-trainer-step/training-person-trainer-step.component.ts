import { AfterContentChecked, Component, Injector, Input, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CreatingEventLinearTrainerTableComponent } from '@event-components/general-child-table/linear-trainer/creating-event-linear-trainer-table.component';
import { CreatingEventMainTrainerTableComponent } from '@event-components/general-child-table/main-trainer/creating-event-main-trainer-table.component';
import { CreatingEventPersonTableComponent } from '@event-components/general-child-table/person/creating-event-person-table.component';
import { CreateUpdateTrainingModalComponent } from '@event-training-modals-create-update/create-update-training-modal.component';
import { TrainingModuleTableComponent } from '@event-training-modals-training-module-table/training-module-table.component';

@Component({
  selector: 'app-training-person-trainer-step',
  templateUrl: './training-person-trainer-step.component.html',
  styleUrls: ['./training-person-trainer-step.component.scss', '../../../../../../../../styles.scss'],
  standalone: false,
})
export class TrainingPersonTrainerStepComponent extends CommonComponent implements AfterContentChecked {
  selfEnrollmentRegistrationLimitControl;
  selfEnrollmentEnabledControl;
  @Input() parent: CreateUpdateTrainingModalComponent;
  @ViewChild(CreatingEventLinearTrainerTableComponent)
  creatingEventLinearTrainerTableComponent: CreatingEventLinearTrainerTableComponent;
  @ViewChild(CreatingEventMainTrainerTableComponent)
  creatingEventMainTrainerTableComponent: CreatingEventMainTrainerTableComponent;
  @ViewChild(CreatingEventPersonTableComponent) creatingEventPersonTableComponent: CreatingEventPersonTableComponent;
  @ViewChild(TrainingModuleTableComponent) trainingModuleTableComponent: TrainingModuleTableComponent;

  constructor(injector: Injector) {
    super(injector);
  }

  ngAfterContentChecked(): void {
    this.selfEnrollmentRegistrationLimitControl = this.parent.getValidator('selfEnrollmentRegistrationLimit');
    this.selfEnrollmentEnabledControl = this.parent.getValidator('selfEnrollmentEnabled');
    this.cdref.detectChanges();
  }

  updateChildComponentsTable(): void {
    this.updateLinearTrainerTable();
    this.updateMainTrainerTable();
    this.updatePersonTable();
    this.updateModuleTable();
  }

  private updateLinearTrainerTable(): void {
    this.creatingEventLinearTrainerTableComponent.modules = this.parent.training.trainingModules;
    this.creatingEventLinearTrainerTableComponent.updateLinearTrainerDataSource();
  }

  private updateMainTrainerTable(): void {
    this.creatingEventMainTrainerTableComponent.modules = this.parent.training.trainingModules;
    this.creatingEventMainTrainerTableComponent.updateMainTrainerDataSource();
  }

  private updatePersonTable(): void {
    this.creatingEventPersonTableComponent.modules = this.parent.training.trainingModules;
    this.creatingEventPersonTableComponent.updatePersonDataSource();
  }

  private updateModuleTable(): void {
    this.trainingModuleTableComponent.training = this.parent.training;
    this.trainingModuleTableComponent.updateTrainingModuleDataSource();
  }
}
