import { Component, Input, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CreatingEventLinearTrainerTableComponent } from '@event-components/general-child-table/linear-trainer/creating-event-linear-trainer-table.component';
import { CreatingEventMainTrainerTableComponent } from '@event-components/general-child-table/main-trainer/creating-event-main-trainer-table.component';
import { CreatingEventPersonTableComponent } from '@event-components/general-child-table/person/creating-event-person-table.component';
import { CreateUpdateModuleModalComponent } from '@event-module-modals-create-update/create-update-module-modal.component';
import { ModuleModel } from '@event-module-models/module.model';

@Component({
  selector: 'app-module-person-trainer-step',
  templateUrl: './module-person-trainer-step.component.html',
  styleUrls: ['./module-person-trainer-step.component.scss', '../../../../../../../../styles.scss'],
  standalone: false,
})
export class ModulePersonTrainerStepComponent extends CommonComponent {
  @Input() parent: CreateUpdateModuleModalComponent;
  @ViewChild(CreatingEventLinearTrainerTableComponent)
  creatingEventLinearTrainerTableComponent: CreatingEventLinearTrainerTableComponent;
  @ViewChild(CreatingEventMainTrainerTableComponent)
  creatingEventMainTrainerTableComponent: CreatingEventMainTrainerTableComponent;
  @ViewChild(CreatingEventPersonTableComponent) creatingEventPersonTableComponent: CreatingEventPersonTableComponent;

  updateChildComponentsTable(): void {
    this.updateLinearTrainerTable();
    this.updateMainTrainerTable();
    this.updatePersonTable();
  }

  private updateLinearTrainerTable(): void {
    this.creatingEventLinearTrainerTableComponent.modules = [this.parent.module];
    this.creatingEventLinearTrainerTableComponent.updateLinearTrainerDataSource();
  }

  private updateMainTrainerTable(): void {
    this.creatingEventMainTrainerTableComponent.modules = [this.parent.module];
    this.creatingEventMainTrainerTableComponent.updateMainTrainerDataSource();
  }

  private updatePersonTable(): void {
    this.creatingEventPersonTableComponent.modules = [this.parent.module];
    this.creatingEventPersonTableComponent.updatePersonDataSource();
  }

  getTrainersCountMessage(): string {
    const module: ModuleModel = Object.assign(new ModuleModel(), this.parent.module),
      paramsMap: Map<string, string> = new Map<string, string>([
        ['minTrainersCount', module.getMinTrainersCount().toString()],
        ['currentTrainers', module.getCurrentTrainersCount().toString()],
      ]),
      mainMessage: string = this.localization.getLocalFormattedTextFromKey('moduleTrainersCountMainMessage', paramsMap);

    return mainMessage;
  }

  checkTrainersCount(): boolean {
    return Object.assign(new ModuleModel(), this.parent.module).checkTrainersCount();
  }
}
