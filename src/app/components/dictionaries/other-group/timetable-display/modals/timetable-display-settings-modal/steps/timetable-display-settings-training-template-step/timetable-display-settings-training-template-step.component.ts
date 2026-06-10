import { Component, Input } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { TimetableDisplaySettingsModalComponent } from '@components/dictionaries/other-group/timetable-display/modals/timetable-display-settings-modal/timetable-display-settings-modal.component';
import { TimetableDisplayTrainingTemplateModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display-training-template.model';

@Component({
  selector: 'app-timetable-display-settings-training-template-step',
  template: `
    <div>
      <mat-accordion class="accordion">
        <mat-expansion-panel class="expansion" expanded>
          <mat-expansion-panel-header>
            <mat-panel-title class="mat-expansion-bold-title">
              {{ 'timetableDisplaySettingsModalTrainingTemplateStepTitle' | transloco }}
            </mat-panel-title>
          </mat-expansion-panel-header>

          @for (trainingTemplate of getTrainingTemplates(); track trainingTemplate; let i = $index) {
            <div class="item-box">
              <span class="index">{{ i + 1 }}</span>
              {{ trainingTemplate.name }}
            </div>
          }

          @if (getTrainingTemplates().length === 0) {
            <div class="not-found-message-tr">
              <h4>{{ 'searchNotFoundMessage' | transloco }}</h4>
            </div>
          }
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  standalone: false,
})
export class TimetableDisplaySettingsTrainingTemplateStepComponent extends CommonComponent {
  @Input() parent: TimetableDisplaySettingsModalComponent;

  public getTrainingTemplates(): Array<TimetableDisplayTrainingTemplateModel> {
    return (
      this.parent?.timetableDisplaySettings?.timetableDisplayTrainingTemplateSettings
        ?.timetableDisplayTrainingTemplates ?? []
    );
  }
}
