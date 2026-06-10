import { Injectable } from '@angular/core';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CommonService } from '@common-services/common.service';
import { TagPersonLinkerPersonModel } from '@components/tag/tag-person-linker/models/tag-person-linker-person.model';
import { TagPersonLinkerTagRoleModel } from '@components/tag/tag-person-linker/models/tag-person-linker-tag-role.model';
import { UpdateTagRoleModel } from '@components/tag/tag-person-linker/models/update-tag-role.model';
import { UpdateTagRolePersonModel } from '@components/tag/tag-person-linker/models/update-tag-role-person.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagPersonLinkerService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/tag-person-linker`;

  public getTags(): Observable<Array<StandardNameIdModel>> {
    return this.httpClient.get<Array<StandardNameIdModel>>(`${this.url}/tags`);
  }

  public getTagRoles(tagId: string): Observable<Array<TagPersonLinkerTagRoleModel>> {
    return this.httpClient.post<Array<TagPersonLinkerTagRoleModel>>(`${this.url}/tag-roles`, { tagId: tagId });
  }

  public saveTagRole(updateTagRoleModel: UpdateTagRoleModel): Observable<void> {
    return this.httpClient.post<void>(`${this.url}/tag-role-link/save`, updateTagRoleModel);
  }

  public deleteTagRole(updateTagRoleModel: UpdateTagRoleModel): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/tag-role-link/delete`, { body: updateTagRoleModel });
  }

  public getPersons(tagId: string, tagRoleId: string): Observable<Array<TagPersonLinkerPersonModel>> {
    return this.httpClient.post<Array<TagPersonLinkerPersonModel>>(`${this.url}/persons`, {
      tagId: tagId,
      tagRoleId: tagRoleId,
    });
  }

  public savePersonRole(updatePersonRoleModel: UpdateTagRolePersonModel): Observable<void> {
    return this.httpClient.post<void>(`${this.url}/tag-person-link/save`, updatePersonRoleModel);
  }

  public deletePersonRole(updatePersonRoleModel: UpdateTagRolePersonModel): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/tag-person-link/delete`, { body: updatePersonRoleModel });
  }
}
