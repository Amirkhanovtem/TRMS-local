import { AfterContentChecked, Component, Input, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CreatingEventEquipmentTableComponent } from '@event-components/general-child-table/equipment/creating-event-equipment-table.component';
import { CreatingEventRoomTableComponent } from '@event-components/general-child-table/room/creating-event-room-table.component';
import { ModuleModel } from '@event-module-models/module.model';
import { CreateUpdateSyllabusModalComponent } from '@event-syllabus-modals-create-update/create-update-syllabus-modal.component';
import { SyllabusTrainingTableComponent } from '@event-syllabus-modals-training-table/syllabus-training-table.component';

@Component({
  selector: 'app-syllabus-resource-step',
  templateUrl: './syllabus-resource-step.component.html',
  styleUrls: ['./syllabus-resource-step.component.scss', '../../../../../../../../styles.scss'],
  standalone: false,
})
export class SyllabusResourceStepComponent extends CommonComponent implements AfterContentChecked {
  nameControl;
  @Input() parent: CreateUpdateSyllabusModalComponent;
  @ViewChild(CreatingEventEquipmentTableComponent)
  syllabusEquipmentsTableComponent: CreatingEventEquipmentTableComponent;
  @ViewChild(SyllabusTrainingTableComponent) syllabusTrainingTableComponent: SyllabusTrainingTableComponent;
  @ViewChild(CreatingEventRoomTableComponent) syllabusRoomTableComponent: CreatingEventRoomTableComponent;

  ngAfterContentChecked(): void {
    this.nameControl = this.parent.getValidator('name');
    this.cdref.detectChanges();
  }

  updateChildComponentsTable(): void {
    this.updateRoomTable();
    this.updateEquipmentCategoriesTable();
    this.updateTrainingTable();
  }

  private updateRoomTable(): void {
    this.syllabusRoomTableComponent.modules = this.collectAllModules();
    this.syllabusRoomTableComponent.updateRoomsDataSource();
  }

  private updateEquipmentCategoriesTable(): void {
    this.syllabusEquipmentsTableComponent.modules = this.collectAllModules();
    this.syllabusEquipmentsTableComponent.updateEquipmentsDataSource();
  }

  private updateTrainingTable(): void {
    this.syllabusTrainingTableComponent.syllabus = this.parent.syllabus;
    this.syllabusTrainingTableComponent.updateTrainingDataSource();
  }

  calcSyllabusDuration(): number {
    return this.parent.syllabusService.calcSyllabusDuration(this.parent.syllabus);
  }

  collectAllModules(): Array<ModuleModel> {
    return this.parent.syllabusService.collectAllModules(this.parent.syllabus);
  }

  isAuthorVisible(): boolean {
    return this.parent.syllabus?.['author'] !== this.getUsernameCurrentUser();
  }
}
