import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { RoomModel } from '@room-models/room.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/rooms`;
  private enumUrl: string = Config.MAIN_API_ENUM_URL;

  public list(): Observable<Array<RoomModel>> {
    return this.httpClient.get<Array<RoomModel>>(`${this.url}/dictionary-table`);
  }

  public listAllowed(): Observable<Array<RoomModel>> {
    return this.httpClient.get<Array<RoomModel>>(`${this.url}/allowed`);
  }

  public getIdNameList(): Observable<Array<RoomModel>> {
    return this.httpClient.get<Array<RoomModel>>(`${this.url}/list-id-name`);
  }

  public getNotArchivedIdNameStatusList(): Observable<Array<RoomModel>> {
    return this.httpClient.get<Array<RoomModel>>(`${this.url}/list-id-name-status`);
  }

  public delete(listIdRoom: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdRoom);
  }

  public create(room: RoomModel): Observable<any> {
    return this.httpClient.post(this.url, room);
  }

  public update(room: RoomModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${room.id}`, room);
  }

  public getRoom(id: string): Observable<RoomModel> {
    return this.httpClient.get<RoomModel>(`${this.url}/save-update-form/${id}`);
  }

  public getAllRoomStatus(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allRoomStatuses`);
  }
}
