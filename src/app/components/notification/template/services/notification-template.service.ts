import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonAttachmentService } from '@common-services/common-attachment.service';
import { Config } from '@config/config';
import { NotificationTemplateTableModel } from '@notification-template-modals-selection-models/notification-template-table.model';
import { NotificationTemplateModel } from '@notification-template-models/notification-template.model';
import { NotificationTemplateTriggerModel } from '@notification-template-models/notification-template-trigger.model';
import { NotificationTemplateTriggerTargetTypeEnum } from '@notification-template-models-enums/notification-template-trigger-target-type.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationTemplateService extends CommonAttachmentService {
  private url: string = `${Config.MAIN_API_URL}/notification-templates`;
  private notificationConcreteTemplateUrl: string = `${Config.MAIN_API_URL}/notification-concrete-templates`;
  private enumUrl: string = `${Config.MAIN_API_ENUM_URL}/notification`;

  public list(): Observable<Array<NotificationTemplateTableModel>> {
    return this.httpClient.get<Array<NotificationTemplateTableModel>>(`${this.url}/dictionary-table`);
  }

  public listByTargetTemplateIdAndType(
    targetTemplateId: string,
    targetType: NotificationTemplateTriggerTargetTypeEnum,
  ): Observable<Array<NotificationTemplateTableModel>> {
    let urlPart: string = '/dictionary-table/by-${target}-template-id/';

    switch (targetType) {
      case NotificationTemplateTriggerTargetTypeEnum.TRAINING_CATEGORY_AS_TRAINING: {
        urlPart = urlPart.replace('${target}', 'training');
        break;
      }
      case NotificationTemplateTriggerTargetTypeEnum.SYLLABUS_TEMPLATE: {
        urlPart = urlPart.replace('${target}', 'syllabus');
        break;
      }
    }

    return this.httpClient.get<Array<NotificationTemplateTableModel>>(this.url + urlPart + targetTemplateId);
  }

  public getNotificationTemplateById(id: string): Observable<NotificationTemplateModel> {
    return this.httpClient.get<NotificationTemplateModel>(`${this.url}/save-update-form/${id}`);
  }

  public createNotificationConcreteTemplate(
    notificationTemplateModel: NotificationTemplateModel,
    targetId: string,
  ): Observable<any> {
    return this.httpClient.post(
      `${this.notificationConcreteTemplateUrl}/${targetId}`,
      this.collectNotificationTemplateModelToFormData(notificationTemplateModel),
    );
  }

  public getNotificationConcreteTemplateById(id: string): Observable<NotificationTemplateModel> {
    return this.httpClient.get<NotificationTemplateModel>(
      `${this.notificationConcreteTemplateUrl}/save-update-form/${id}`,
    );
  }

  public create(notificationTemplateModel: NotificationTemplateModel): Observable<any> {
    return this.httpClient.post(this.url, this.collectNotificationTemplateModelToFormData(notificationTemplateModel));
  }

  public changeNotificationTemplatesStatus(notificationTemplateIds: Array<string>, isActive: boolean): Observable<any> {
    const path: string = isActive ? 'activate' : 'deactivate';

    return this.httpClient.patch(`${this.url}/change-active-status/${path}`, notificationTemplateIds);
  }

  public changeNotificationConcreteTemplatesStatus(
    notificationTemplateIds: Array<string>,
    isActive: boolean,
    targetId: string,
  ): Observable<any> {
    const activePath: string = isActive ? 'activate' : 'deactivate',
      fullPath: string = `${this.notificationConcreteTemplateUrl}/${targetId}/change-active-status/${activePath}`;

    return this.httpClient.patch(fullPath, notificationTemplateIds);
  }

  public update(notificationTemplateModel: NotificationTemplateModel): Observable<any> {
    return this.httpClient.put(
      `${this.url}/${notificationTemplateModel.id}`,
      this.collectNotificationTemplateModelToFormData(notificationTemplateModel),
    );
  }

  public updateNotificationConcreteTemplate(notificationTemplateModel: NotificationTemplateModel): Observable<any> {
    return this.httpClient.put(
      `${this.notificationConcreteTemplateUrl}/${notificationTemplateModel.id}`,
      this.collectNotificationTemplateModelToFormData(notificationTemplateModel),
    );
  }

  public delete(listIdNotificationTemplates: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdNotificationTemplates);
  }

  public getAllNotificationTemplateTriggers(): Observable<Array<NotificationTemplateTriggerModel>> {
    return this.httpClient.get<Array<NotificationTemplateTriggerModel>>(
      `${this.enumUrl}/allNotificationTemplateTriggers`,
    );
  }

  public getAllNotificationTemplateTargetAudiences(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allNotificationTemplateTargetAudiences`);
  }

  public getAllNotificationTemplateTargetAudiencesByTrigger(trigger: string): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(
      `${this.enumUrl}/notificationTemplateTargetAudiences/by-trigger/${trigger}`,
    );
  }

  public getAllNotificationTemplateKeyWords(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allNotificationTemplateKeyWords`);
  }

  public getAllNotificationTemplateKeyWordsByTrigger(trigger: string): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(
      `${this.enumUrl}/notificationTemplateKeyWords/by-trigger/${trigger}`,
    );
  }

  public getAllNotificationTemplateSendingTypes(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allNotificationTemplateSendingTypes`);
  }

  public getAllNotificationTemplateOffsetTypes(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allNotificationTemplateOffsetTypes`);
  }

  public getAllNotificationTemplateRepeatTypes(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allNotificationTemplateRepeatTypes`);
  }

  private collectNotificationTemplateModelToFormData(notificationTemplateModel: NotificationTemplateModel): FormData {
    const formData = new FormData(),
      blobModel = this.createBlobForFormModel(notificationTemplateModel);

    formData.append('notificationTemplateRequestDTO', blobModel);

    notificationTemplateModel.fileStorages.forEach(fs => {
      if (fs.templateFile) {
        formData.append('fileStorages.templateFile', fs.templateFile);
      }
    });

    return formData;
  }
}
