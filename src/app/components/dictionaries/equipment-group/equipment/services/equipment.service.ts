import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { EquipmentModel } from '@equipment-models/equipment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/equipments`;

  public list(): Observable<Array<EquipmentModel>> {
    return this.httpClient.get<Array<EquipmentModel>>(`${this.url}/dictionary-table`);
  }

  public listShortEquipment(): Observable<Array<EquipmentModel>> {
    return this.httpClient.get<Array<EquipmentModel>>(`${this.url}/simplified`);
  }

  public delete(listIdEquipment: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdEquipment);
  }

  public create(equipment: EquipmentModel): Observable<any> {
    return this.httpClient.post(this.url, equipment);
  }

  public update(equipment: EquipmentModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${equipment.id}`, equipment);
  }

  public getEquipment(id: string): Observable<EquipmentModel> {
    return this.httpClient.get<EquipmentModel>(`${this.url}/save-update-form/${id}`);
  }

  public getAllEquipmentTypes(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${Config.MAIN_API_ENUM_URL}/allEquipmentTypes`);
  }

  public getAllEquipmentStatuses(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${Config.MAIN_API_ENUM_URL}/allEquipmentStatuses`);
  }

  public getEquipmentsByRoomIds(...roomIds: Array<string>): Observable<Array<EquipmentModel>> {
    return this.httpClient.post<Array<EquipmentModel>>(`${this.url}/built-in-by-room-ids`, roomIds);
  }
}
