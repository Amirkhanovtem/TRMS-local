import { AfterContentChecked, Component, Input, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CreatingEventEquipmentTableComponent } from '@event-components/general-child-table/equipment/creating-event-equipment-table.component';
import { CreatingEventRoomTableComponent } from '@event-components/general-child-table/room/creating-event-room-table.component';
import { CreateUpdateTrainingModalComponent } from '@event-training-modals-create-update/create-update-training-modal.component';
import { TrainingModuleTableComponent } from '@event-training-modals-training-module-table/training-module-table.component';

@Component({
  selector: 'app-training-resource-step',
  templateUrl: './training-resource-step.component.html',
  styleUrls: ['./training-resource-step.component.scss', '../../../../../../../../styles.scss'],
  standalone: false,
})
export class TrainingResourceStepComponent extends CommonComponent implements AfterContentChecked {
  nameControl;
  @Input() parent: CreateUpdateTrainingModalComponent;
  @ViewChild(TrainingModuleTableComponent) trainingModuleTableComponent: TrainingModuleTableComponent;
  @ViewChild(CreatingEventRoomTableComponent) trainingRoomTableComponent: CreatingEventRoomTableComponent;
  @ViewChild(CreatingEventEquipmentTableComponent)
  creatingEventEquipmentsTableComponent: CreatingEventEquipmentTableComponent;

  ngAfterContentChecked(): void {
    this.nameControl = this.parent.getValidator('name');
    this.cdref.detectChanges();
  }

  updateChildComponentsTable(): void {
    this.updateRoomTable();
    this.updateEquipmentCategoriesTable();
    this.updateModuleTable();
  }

  private updateRoomTable(): void {
    this.trainingRoomTableComponent.modules = this.parent.training.trainingModules;
    this.trainingRoomTableComponent.updateRoomsDataSource();
  }

  private updateEquipmentCategoriesTable(): void {
    this.creatingEventEquipmentsTableComponent.modules = this.parent.training.trainingModules;
    this.creatingEventEquipmentsTableComponent.updateEquipmentsDataSource();
  }

  private updateModuleTable(): void {
    this.trainingModuleTableComponent.training = this.parent.training;
    this.trainingModuleTableComponent.updateTrainingModuleDataSource();
  }

  calcTrainingDuration(): number {
    return this.parent.trainingService.calcTrainingDuration(this.parent.training);
  }

  checkShowAuthor(): boolean {
    return this.parent.training?.['author'] !== this.getUsernameCurrentUser();
  }
}
