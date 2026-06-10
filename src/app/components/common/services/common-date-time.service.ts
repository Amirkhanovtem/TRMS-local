import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonDateTimeService {
  private static readonly HOURS_IN_DAY = 24;
  private static readonly MINUTES_IN_HOUR = 60;
  private static readonly STEP_MINUTES = 5;
  public workTimesList = CommonDateTimeService.prepareWorkTimesList();
  public hoursList = CommonDateTimeService.prepareHoursList();
  public minutesList = CommonDateTimeService.prepareMinutesList();

  public dayOfWeekList = [
    {
      id: 1,
      nameRu: 'Понедельник',
      nameEn: 'Monday',
    },
    {
      id: 2,
      nameRu: 'Вторник',
      nameEn: 'Tuesday',
    },
    {
      id: 3,
      nameRu: 'Среда',
      nameEn: 'Wednesday',
    },
    {
      id: 4,
      nameRu: 'Четверг',
      nameEn: 'Thursday',
    },
    {
      id: 5,
      nameRu: 'Пятница',
      nameEn: 'Friday',
    },
    {
      id: 6,
      nameRu: 'Суббота',
      nameEn: 'Saturday',
    },
    {
      id: 7,
      nameRu: 'Воскресенье',
      nameEn: 'Sunday',
    },
  ];

  private static prepareWorkTimesList(): Array<string> {
    const result = [];

    for (let i = 0; i < this.HOURS_IN_DAY; i++) {
      for (let j = 0; j < this.MINUTES_IN_HOUR; j += this.STEP_MINUTES) {
        result.push(`${this.pad(i)}:${this.pad(j)}`);
      }
    }

    return result;
  }

  private static prepareHoursList(): Array<string> {
    const result = [];

    for (let i = 0; i < this.HOURS_IN_DAY; i++) {
      result.push(i.toString());
    }

    return result;
  }

  private static prepareMinutesList(): Array<string> {
    const result = [];

    for (let i = 0; i < this.MINUTES_IN_HOUR; i += this.STEP_MINUTES) {
      result.push(i.toString());
    }

    return result;
  }

  private static pad(value: number, length = 2, char = '0'): string {
    return value.toString().padStart(length, char);
  }

  public convertDateToLocal(date: Date, withTime?: boolean): string {
    const format: string = withTime ? 'dd.MM.yyyy, HH:mm' : 'dd.MM.yyyy';

    return date ? formatDate(date, format, 'en_US') : null;
  }

  public convertDateToTime(date: Date): string {
    const format: string = 'HH:mm';

    return date ? formatDate(date, format, 'en_US') : null;
  }

  public convertDateToLocalDateTimeWithoutTimeZone(date: Date): string {
    const offset = date.getTimezoneOffset() / 60,
      newHours = date.getHours() - offset;

    date.setHours(newHours);

    return date.toISOString().slice(0, -1);
  }
}
