import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { CheckingTypeEnum } from '@event-models/checking-type.enum';
import { ModuleModel } from '@event-module-models/module.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModuleService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/modules`;

  public checkBusyResourcesByType(module: ModuleModel, checkingType: CheckingTypeEnum): Observable<any> {
    return this.httpClient.post(
      `${this.url}/check`,
      module,
      this.addParamsToOptions({
        checkingType: checkingType,
      }),
    );
  }
}
