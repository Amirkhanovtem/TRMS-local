import { Injectable, Injector } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { TableSaveVisualModel } from '@common-table/table-save-visual/models/table-save-visual.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableSaveVisualService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/table-filters`;

  constructor(injector: Injector) {
    super(injector);
  }

  public getTableVisual(tableSaveVisualModel: TableSaveVisualModel): Observable<TableSaveVisualModel> {
    return this.httpClient.get<TableSaveVisualModel>(`${this.url}/${tableSaveVisualModel.tableId}`);
  }

  public saveTableVisual(tableSaveVisualModel: TableSaveVisualModel): Observable<any> {
    return this.httpClient.post(this.url, tableSaveVisualModel);
  }
}
