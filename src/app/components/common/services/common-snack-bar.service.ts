import { Injectable } from '@angular/core';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { Config } from '@config/config';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CommonSnackBarService {
  constructor(private toastr: ToastrService) {}

  public showSnackBarWithMessage(message: string, type?: SnackBarTypeEnum | string, newConfig?: any): void {
    const config = { ...Config.TOAST_CONFIG, ...newConfig },
      toastedType: string = type ? type : SnackBarTypeEnum.INFO;

    this.toastr.show(message, null, config, toastedType);
  }
}
