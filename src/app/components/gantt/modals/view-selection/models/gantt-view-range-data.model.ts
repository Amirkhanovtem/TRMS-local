import { StandardEnumModel } from '@common-models/standard-enum.model';
import { GanttRangeEnum } from '@gantt-modals-view-selection-models/gantt-range.enum';
import { GanttViewEnum } from '@gantt-modals-view-selection-models/gantt-view.enum';
import { Cit } from 'cit-angular';

export class GanttViewRangeData {
  public ganttView: StandardEnumModel = null;
  public ganttRange: StandardEnumModel = null;
  public startDate: Cit.Date = null;
  public endDate: Cit.Date = null;

  constructor(ganttRange: GanttRangeEnum, ganttView: GanttViewEnum) {
    const range = new StandardEnumModel(),
      view = new StandardEnumModel();

    range.id = ganttRange;
    view.id = ganttView;

    this.ganttRange = range;
    this.ganttView = view;
  }
}
