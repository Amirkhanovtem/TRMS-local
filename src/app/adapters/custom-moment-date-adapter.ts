import { MomentDateAdapter } from '@angular/material-moment-adapter';

export class CustomMomentDateAdapter extends MomentDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}
