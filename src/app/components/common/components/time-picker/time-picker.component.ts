import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonDateTimeService } from '@common-services/common-date-time.service';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  standalone: false,
})
export class TimePickerComponent {
  @Input()
  set hour(value: string) {
    const normalized = this.normalize(value);
    if (normalized !== this.hourControl.value) {
      this.hourControl.setValue(normalized, { emitEvent: false });
    }
  }

  @Input()
  set minute(value: string) {
    const normalized = this.normalize(value);
    if (normalized !== this.minuteControl.value) {
      this.minuteControl.setValue(normalized, { emitEvent: false });
    }
  }

  @Input() disabled = false;
  @Input() invalid = false;

  @Output() hourChange = new EventEmitter<string>();
  @Output() minuteChange = new EventEmitter<string>();

  hourControl = new FormControl<string>(null);
  minuteControl = new FormControl<string>(null);

  constructor(public commonDateTimeService: CommonDateTimeService) {}

  onHourChange(value: string): void {
    this.hourChange.emit(value);
  }

  onMinuteChange(value: string): void {
    this.minuteChange.emit(value);
  }

  private normalize(value: string): string {
    if (value === null || value === undefined) {
      return null;
    }
    return parseInt(value, 10).toString();
  }
}
