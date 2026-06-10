import { Injectable } from '@angular/core';
import { Localization } from '@localization/localization';
import { Cit } from 'cit-angular';

@Injectable({
  providedIn: 'root',
})
export class GanttLocaleService {
  public static readonly DEFAULT_LOCALE = Localization.LANG_RU;

  private static readonly DEFAULT_TIME_PATTERN = 'H:mm';
  private static readonly DEFAULT_DATE_PATTERN = 'dd.MM.yyyy';
  private static readonly DEFAULT_DATE_TIME_PATTERN = `${GanttLocaleService.DEFAULT_DATE_PATTERN} ${GanttLocaleService.DEFAULT_TIME_PATTERN}`;
  private static readonly DEFAULT_TIME_FORMAT = 'Clock24Hours';
  private static readonly DEFAULT_WEEK_STARTS = 1;

  static {
    GanttLocaleService.initLocales();
  }

  constructor(private localization: Localization) {}

  public getLocale(lang?: string): Cit.Locale {
    let locale;

    if (lang) {
      locale = lang;
    } else {
      const langFromStorage = this.localization.getLanguageFromStorage();

      if (langFromStorage) {
        locale = langFromStorage;
      } else {
        locale = GanttLocaleService.DEFAULT_LOCALE;
      }
    }

    return Cit.Locale.find(locale);
  }

  private static initLocales(): void {
    const enUs = Cit.Locale.find('en-us');

    const en = new Cit.Locale(Localization.LANG_EN, {
      dayNames: enUs.dayNames,
      dayNamesShort: enUs.dayNamesShort,
      monthNames: enUs.monthNames,
      monthNamesShort: enUs.monthNamesShort,
      timePattern: GanttLocaleService.DEFAULT_TIME_PATTERN,
      datePattern: GanttLocaleService.DEFAULT_DATE_PATTERN,
      dateTimePattern: GanttLocaleService.DEFAULT_DATE_TIME_PATTERN,
      timeFormat: GanttLocaleService.DEFAULT_TIME_FORMAT,
      weekStarts: GanttLocaleService.DEFAULT_WEEK_STARTS,
    });

    const kz = new Cit.Locale(Localization.LANG_KZ, {
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      timePattern: GanttLocaleService.DEFAULT_TIME_PATTERN,
      datePattern: GanttLocaleService.DEFAULT_DATE_PATTERN,
      dateTimePattern: GanttLocaleService.DEFAULT_DATE_TIME_PATTERN,
      timeFormat: GanttLocaleService.DEFAULT_TIME_FORMAT,
      weekStarts: GanttLocaleService.DEFAULT_WEEK_STARTS,
    });

    Cit.Locale.register(en);
    Cit.Locale.register(kz);
  }
}
