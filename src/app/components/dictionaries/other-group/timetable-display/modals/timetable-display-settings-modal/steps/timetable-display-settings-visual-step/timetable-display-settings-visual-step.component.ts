import { Component, Input } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { TimetableDisplaySettingsModalComponent } from '@components/dictionaries/other-group/timetable-display/modals/timetable-display-settings-modal/timetable-display-settings-modal.component';
import { TimetableDisplayVisualSettingsModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display-visual-settings.model';

@Component({
  selector: 'app-timetable-display-settings-visual-step',
  templateUrl: './timetable-display-settings-visual-step.component.html',
  styleUrls: ['./timetable-display-settings-visual-step.component.scss'],
  standalone: false,
})
export class TimetableDisplaySettingsVisualStepComponent extends CommonComponent {
  @Input() parent: TimetableDisplaySettingsModalComponent;

  public get timetableDisplayVisualSettings(): TimetableDisplayVisualSettingsModel {
    return this.parent?.timetableDisplaySettings?.timetableDisplayVisualSettings;
  }
}
