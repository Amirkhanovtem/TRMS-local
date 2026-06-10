import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonService } from '@common-services/common.service';
import { CompleteSyllabusModel } from '@complete-syllabuses/models/complete-syllabus.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompleteSyllabusesService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/completed-syllabuses`;

  public list(): Observable<Array<CompleteSyllabusModel>> {
    return this.httpClient.get<Array<CompleteSyllabusModel>>(this.url);
  }

  public getAllFactualStatuses(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${Config.MAIN_API_ENUM_URL}/allSyllabusFactualStatuses`);
  }
}
