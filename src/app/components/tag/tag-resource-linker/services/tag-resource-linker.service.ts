import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CommonService } from '@common-services/common.service';
import { TagResourceLinkerResourceModel } from '@components/tag/tag-resource-linker/models/tag-resource-linker-resource.model';
import { UpdateResourceTagModel } from '@components/tag/tag-resource-linker/models/update-resource-tag.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagResourceLinkerService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/tag-resource-linker`;

  public getTags(): Observable<Array<StandardNameIdModel>> {
    return this.httpClient.get<Array<StandardNameIdModel>>(`${this.url}/tags`);
  }

  public getResourceTypes(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.url}/resource-types`);
  }

  public getResources(
    tagId: string,
    resourceType: StandardEnumModel,
  ): Observable<Array<TagResourceLinkerResourceModel>> {
    return this.httpClient.post<Array<TagResourceLinkerResourceModel>>(`${this.url}/resource-data`, {
      tagId: tagId,
      type: resourceType,
    });
  }

  public saveResourceTag(updateResourceTagModel: UpdateResourceTagModel): Observable<void> {
    return this.httpClient.post<void>(`${this.url}/save`, updateResourceTagModel);
  }

  public deleteResourceTag(updateResourceTagModel: UpdateResourceTagModel): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/delete`, { body: updateResourceTagModel });
  }
}
