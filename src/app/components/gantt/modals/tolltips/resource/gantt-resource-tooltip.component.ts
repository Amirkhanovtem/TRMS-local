import { AfterViewInit, Component } from '@angular/core';
import { GanttTooltip } from '@gantt-modals-tolltips/gantt.tooltip';
import { GanttResourceGroupType } from '@gantt-models/gantt-resource-group-type.model';
import { Cit } from 'cit-angular';

@Component({
  selector: 'gantt-resource-tooltip',
  templateUrl: './gantt-resource-tooltip.component.html',
  styleUrls: ['./gantt-resource-tooltip.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class GanttResourceTooltipComponent extends GanttTooltip implements AfterViewInit {
  currentResource: Cit.Row = null;

  ngAfterViewInit(): void {
    this.currentResource = this.getCurrentResource();
    this.colorizeTooltip();
  }

  isRoomResource() {
    return this.checkGroupId(GanttResourceGroupType.ROOM_GROUP);
  }

  isTrainerResource() {
    return this.checkGroupId(GanttResourceGroupType.TRAINER_GROUP);
  }

  isEquipmentResource() {
    return this.checkGroupId(GanttResourceGroupType.EQUIPMENT_GROUP);
  }

  protected override backColor(): string {
    return this.currentResource?.data.backColor;
  }

  get name() {
    return this.currentResource?.name;
  }

  get roomCapacity() {
    return this.currentResource?.data.capacity;
  }

  get roomStatus() {
    return this.getStatus();
  }

  get builtInEquipmentNames(): Cit.Date {
    return this.currentResource?.data.builtInEquipmentNames;
  }

  get personalNumber() {
    return this.currentResource?.data.personalNumber;
  }

  get trainerStatus() {
    return this.getStatus();
  }

  get equipmentQuantity() {
    return this.currentResource?.data.quantity;
  }

  get equipmentType() {
    return this.currentResource?.data.type[this.localEnumField];
  }

  private getStatus() {
    return this.currentResource?.data.status[this.localEnumField];
  }

  private getCurrentResource(): Cit.Row | null {
    return this.scheduler.rows.find(this.source.id);
  }

  private checkGroupId(resourceType: GanttResourceGroupType) {
    return this.currentResource?.data.groupId === resourceType;
  }
}
