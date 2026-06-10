import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { ModuleTemplateModel } from '@module-template-models/module-template.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModuleTemplateService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/module-templates`;

  public delete(listIdLocation: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdLocation);
  }

  public create(moduleTemplate: ModuleTemplateModel): Observable<any> {
    return this.httpClient.post(this.url, moduleTemplate);
  }

  public update(moduleTemplate: ModuleTemplateModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${moduleTemplate.id}`, moduleTemplate);
  }

  public getModuleTemplate(id: string): Observable<ModuleTemplateModel> {
    return this.httpClient.get<ModuleTemplateModel>(`${this.url}/${id}`);
  }
}
