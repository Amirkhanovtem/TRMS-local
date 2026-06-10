import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { SendNotificationBodyModel } from '@notification-target-models/send-notification-body.model';
import { NotificationTemplateTableModel } from '@notification-template-modals-selection-models/notification-template-table.model';
import { NotificationTemplateTriggerEnum } from '@notification-template-models-enums/notification-template-trigger.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TargetNotificationTemplateService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/target-notification-templates`;

  public findAllNotificationTemplateByTrainingId(
    trainingId: string,
  ): Observable<Array<NotificationTemplateTableModel>> {
    return this.httpClient.get<Array<NotificationTemplateTableModel>>(`${this.url}/training/${trainingId}`);
  }

  public findAllNotificationTemplateByTrainingIdAndTrigger(
    trainingId: string,
    trigger: NotificationTemplateTriggerEnum,
  ): Observable<Array<NotificationTemplateTableModel>> {
    return this.httpClient.get<Array<NotificationTemplateTableModel>>(
      `${this.url}/training/${this.getUrlPartByTargetIdAndTrigger(trainingId, trigger)}`,
    );
  }

  public findAllNotificationTemplateBySyllabusId(
    syllabusId: string,
  ): Observable<Array<NotificationTemplateTableModel>> {
    return this.httpClient.get<Array<NotificationTemplateTableModel>>(`${this.url}/syllabus/${syllabusId}`);
  }

  public sendSelectedNotificationTemplatesByTrainingAndTrigger(
    trainingId: string,
    trigger: NotificationTemplateTriggerEnum,
    sendBody: SendNotificationBodyModel,
  ): Observable<any> {
    return this.httpClient.post(
      `${this.url}/training/${this.getUrlPartByTargetIdAndTrigger(trainingId, trigger)}/send-notification`,
      sendBody,
    );
  }

  private getUrlPartByTargetIdAndTrigger(targetId: string, trigger: NotificationTemplateTriggerEnum): string {
    const urlPart: string = `${targetId}/`;

    switch (trigger) {
      case NotificationTemplateTriggerEnum.TIME_OR_PLACE_CHANGED_IN_TRAINING: {
        return urlPart.concat('training-date-time-changed');
      }
      case NotificationTemplateTriggerEnum.TRAINING_COMPLETED: {
        return urlPart.concat('training-completed');
      }
      case NotificationTemplateTriggerEnum.TRAINING_CANCELED: {
        return urlPart.concat('training-canceled');
      }
      case NotificationTemplateTriggerEnum.CERTIFICATE_ISSUE: {
        return urlPart.concat('certificate-issue');
      }
    }

    return urlPart;
  }
}
