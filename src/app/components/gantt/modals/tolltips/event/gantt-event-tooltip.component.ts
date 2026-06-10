import { AfterViewInit, Component } from '@angular/core';
import { GanttTooltip } from '@gantt-modals-tolltips/gantt.tooltip';

@Component({
  selector: 'gantt-event-tooltip',
  templateUrl: './gantt-event-tooltip.component.html',
  styleUrls: ['./gantt-event-tooltip.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class GanttEventTooltipComponent extends GanttTooltip implements AfterViewInit {
  protected override backColor(): string {
    return this.source.data.backColor;
  }

  ngAfterViewInit(): void {
    this.colorizeTooltip();
  }

  get moduleName(): string {
    return this.source.data.text;
  }

  get syllabusName(): string {
    return this.source.data.syllabusName;
  }

  get trainingTemplateName(): string {
    return this.source.data.trainingTemplateName;
  }

  get trainingGroup(): string {
    return this.source.data.trainingGroup;
  }

  get moduleTime(): string {
    const startTime = this.source.data.start.toString('HH:mm'),
      endTime = this.source.data.end.toString('HH:mm');

    return `${startTime} - ${endTime}`;
  }

  get trainingName(): string {
    return this.source.data.trainingName;
  }

  get roomName(): string {
    return this.source.data.roomName;
  }

  get mainTrainersNames(): string {
    return this.source.data.mainTrainersNames;
  }

  get linearTrainersNames(): string {
    return this.source.data.linearTrainersNames;
  }

  get trainingFactualStatusId(): string {
    return this.source.data.trainingFactualStatus.id;
  }
}
