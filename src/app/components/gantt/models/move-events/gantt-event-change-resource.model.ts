import { GanttEventGroupType } from '@gantt-models/GanttEventGroupType.enum';
import { Cit } from 'cit-angular';

export class GanttEventChangeResourceModel {
  public eventId: string;
  public oldStart: Cit.Date;
  public newStart: Cit.Date;
  public oldEnd: Cit.Date;
  public newEnd: Cit.Date;
  public oldResourceId: string;
  public newResourceId: string;
  public eventGroup: GanttEventGroupType;
}
