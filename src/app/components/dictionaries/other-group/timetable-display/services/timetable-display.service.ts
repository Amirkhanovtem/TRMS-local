import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { TimetableDisplayModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimetableDisplayService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/timetable-display`;

  public list(): Observable<Array<TimetableDisplayModel>> {
    return this.httpClient.get<Array<TimetableDisplayModel>>(this.url);
  }

  public delete(listIdTimetableDisplay: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdTimetableDisplay);
  }

  public create(timetableDisplay: TimetableDisplayModel): Observable<any> {
    return this.httpClient.post(this.url, timetableDisplay);
  }

  public update(timetableDisplay: TimetableDisplayModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${timetableDisplay.id}`, timetableDisplay);
  }

  public getTimetableDisplay(id: string): Observable<TimetableDisplayModel> {
    return this.httpClient.get<TimetableDisplayModel>(`${this.url}/${id}`);
  }
}
