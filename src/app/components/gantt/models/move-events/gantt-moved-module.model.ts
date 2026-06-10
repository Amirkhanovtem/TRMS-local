import { GanttEventChangeResourceModel } from '@gantt-models/move-events/gantt-event-change-resource.model';

export class GanttMovedModuleModel {
  public moduleId: string;
  public timeDelta: number;
  public changedResources: Array<GanttEventChangeResourceModel> = [];

  public getChangedResourceByEventId(eventId: string): GanttEventChangeResourceModel {
    return this.changedResources.find(changedResource => {
      return changedResource.eventId === eventId;
    });
  }
}
