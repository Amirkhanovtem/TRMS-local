import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { PersonModel } from '@person-models/person.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/persons`;

  public loadShortProfile(): Observable<PersonModel> {
    return this.httpClient.get<PersonModel>(`${this.url}/currentUserShort`);
  }
}
