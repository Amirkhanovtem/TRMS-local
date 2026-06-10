import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { BusinessLogicModel } from '@gantt-models/business-logic.model';
import { GanttService } from '@gantt-services/gantt.service';
import { Cit } from 'cit-angular';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HolidayService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/holidays`;

  constructor(
    private ganttService: GanttService,
    private http: HttpClient,
    injector: Injector,
  ) {
    super(injector);
  }

  getHolidays(): Observable<Array<Date>> {
    return this.httpClient.get<Array<Date>>(this.url);
  }

  getBusinessLogic(): Observable<BusinessLogicModel> {
    return this.httpClient.get<BusinessLogicModel>(`${this.url}/business-logic`);
  }

  getHolidaysAsCitDate(): Observable<Array<Cit.Date>> {
    return this.getHolidays().pipe(
      map(holidays => {
        const newHolidays: Array<Cit.Date> = [];

        holidays.forEach(holiday => {
          const holidayCitDate = this.ganttService.getCitDateFromIsoDate(holiday);
          newHolidays.push(holidayCitDate);
        });

        return newHolidays;
      }),
    );
  }
}
