import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { ParentEventModel } from '@event-models/parent-event.model';
import { Cit } from 'cit-angular';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GanttService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/gantt`;

  resources: Array<Cit.ResourceData> = [];
  events: Array<Cit.EventData> = [];

  constructor(
    private http: HttpClient,
    injector: Injector,
  ) {
    super(injector);
  }

  getResources(): Observable<Array<Cit.ResourceData>> {
    return this.httpClient.get<Array<Cit.ResourceData>>(`${this.url}/resources`);
  }

  getParentEventInfoByTrainingSessionCode(trainingSessionCode: string): Observable<ParentEventModel> {
    return this.httpClient.get<ParentEventModel>(
      `${this.url}/event-parent/by-training/session-code/${trainingSessionCode}`,
    );
  }

  getPlannedEvents(start?: Cit.Date, end?: Cit.Date): Observable<Array<Cit.EventData>> {
    return this.getEventsByTrainingStatus('PLANNED', start, end).pipe(
      map(plannedEvents => {
        plannedEvents.forEach(event => {
          event.start = this.getCitDateFromIsoDate(event.start);
          event.end = this.getCitDateFromIsoDate(event.end);
        });

        return plannedEvents;
      }),
    );
  }

  getDraftEvents(start?: Cit.Date, end?: Cit.Date): Observable<Array<Cit.EventData>> {
    return this.getEventsByTrainingStatus('DRAFT', start, end).pipe(
      map(draftEvents => {
        draftEvents.forEach(event => {
          event.start = this.getCitDateFromIsoDate(event.start);
          event.end = this.getCitDateFromIsoDate(event.end);
        });

        return draftEvents;
      }),
    );
  }

  private getEventsByTrainingStatus(
    trainingStatus: string,
    start?: Cit.Date,
    end?: Cit.Date,
  ): Observable<Array<Cit.EventData>> {
    const body = JSON.stringify({
      start: start,
      end: end,
    });

    let urlPart;

    switch (trainingStatus) {
      case 'PLANNED':
        urlPart = '/planned-events';
        break;
      case 'DRAFT':
        urlPart = '/draft-events';
        break;
    }

    return this.httpClient.post<Array<Cit.EventData>>(this.url + urlPart, body);
  }

  public getCitDateFromIsoDate(isoDate): Cit.Date {
    return new Cit.Date(new Date(isoDate), true);
  }
}
