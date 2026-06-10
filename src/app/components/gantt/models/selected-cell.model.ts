import { GanttResourceGroupType } from '@gantt-models/gantt-resource-group-type.model';
import { Cit } from 'cit-angular';

export class SelectedCellModel {
  public groupId: GanttResourceGroupType;
  public resourceId: string;
  public startDate: Cit.Date;
  public endDate: Cit.Date;
  public isEvent: boolean;
  public event: Cit.Event;
}
