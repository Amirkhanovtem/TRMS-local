import { Injectable } from '@angular/core';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { SentNotificationModel } from '@notification-sent-models/sent-notification.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SentNotificationService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/notifications`;

  public list(): Observable<Array<SentNotificationModel>> {
    return this.httpClient.get<Array<SentNotificationModel>>(this.url);
  }

  public listByTargetId(targetId: string): Observable<Array<SentNotificationModel>> {
    return this.httpClient.get<Array<SentNotificationModel>>(`${this.url}/${targetId}`);
  }

  public listAttachmentsByNotificationId(notificationId: string): Observable<Array<StandardNameIdModel>> {
    return this.httpClient.get<Array<StandardNameIdModel>>(`${this.url}/attachments/${notificationId}`);
  }
}
