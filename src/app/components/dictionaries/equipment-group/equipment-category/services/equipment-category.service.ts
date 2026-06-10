import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { EquipmentCategoryModel } from '@equipment-category-models/equipment-category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquipmentCategoryService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/equipment-categories`;

  public list(): Observable<Array<EquipmentCategoryModel>> {
    return this.httpClient.get<Array<EquipmentCategoryModel>>(`${this.url}/dictionary-table`);
  }

  public delete(listIdEquipment: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdEquipment);
  }

  public create(equipment: EquipmentCategoryModel): Observable<any> {
    return this.httpClient.post(this.url, equipment);
  }

  public update(equipment: EquipmentCategoryModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${equipment.id}`, equipment);
  }

  public getEquipmentCategory(id: string): Observable<EquipmentCategoryModel> {
    return this.httpClient.get<EquipmentCategoryModel>(`${this.url}/${id}`);
  }

  public getIdNameList(): Observable<Array<EquipmentCategoryModel>> {
    return this.httpClient.get<Array<EquipmentCategoryModel>>(`${this.url}/list-id-name`);
  }
}
