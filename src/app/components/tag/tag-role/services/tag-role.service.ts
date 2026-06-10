import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { TagRoleModel } from '@tag-role-models/tag-role.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagRoleService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/tag-roles`;

  public list(): Observable<Array<TagRoleModel>> {
    return this.httpClient.get<Array<TagRoleModel>>(this.url);
  }

  public delete(listIdTagRole: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdTagRole);
  }

  public create(tagRole: TagRoleModel): Observable<any> {
    return this.httpClient.post(this.url, tagRole);
  }

  public update(tagRole: TagRoleModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${tagRole.id}`, tagRole);
  }

  public getTagRole(id: string): Observable<TagRoleModel> {
    return this.httpClient.get<TagRoleModel>(`${this.url}/${id}`);
  }
}
