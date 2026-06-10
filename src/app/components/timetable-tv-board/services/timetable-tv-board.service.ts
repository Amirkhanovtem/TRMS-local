import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { TimetableTvBoardModel } from '@components/timetable-tv-board/models/timetableTvBoard.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimetableTvBoardService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/timetable-tv-board`;

  public getTimeTableTvBoardData(timetableDisplayId?: string): Observable<Array<TimetableTvBoardModel>> {
    return this.httpClient.get<Array<TimetableTvBoardModel>>(
      `${this.url}/by-timetable-display/${timetableDisplayId ? timetableDisplayId : ''}`,
    );
  }
}
