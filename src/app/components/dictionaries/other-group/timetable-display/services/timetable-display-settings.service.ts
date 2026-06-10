import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { TimetableDisplaySettingsModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display-settings.model';
import { TimetableDisplayVisualSettingsModel } from '@components/dictionaries/other-group/timetable-display/models/timetable-display-visual-settings.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimetableDisplaySettingsService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/timetable-display/settings`;

  public getByTimetableDisplayId(timetableDisplayId: string): Observable<TimetableDisplaySettingsModel> {
    return this.httpClient.get<TimetableDisplaySettingsModel>(`${this.url}/by-timetable-display/${timetableDisplayId}`);
  }

  public save(timetableDisplaySettingsModel: TimetableDisplaySettingsModel): Observable<any> {
    return this.httpClient.post(this.url, timetableDisplaySettingsModel);
  }

  public getVisualSettings(timetableDisplayId?: string): Observable<TimetableDisplayVisualSettingsModel> {
    return this.httpClient.get<TimetableDisplayVisualSettingsModel>(
      `${this.url}/visual/by-timetable-display/${timetableDisplayId ? timetableDisplayId : ''}`,
    );
  }
}
