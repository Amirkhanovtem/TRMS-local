import { NgModule } from '@angular/core';
import { CitCalendarComponent } from './cit-calendar.component.mjs';
import { CitMonthComponent } from './cit-month.component.mjs';
import { CitNavigatorComponent } from './cit-navigator.component.mjs';
import { CitSchedulerComponent } from './cit-scheduler.component.mjs';
import { CitGanttComponent } from './cit-gantt.component.mjs';
import { CitKanbanComponent } from './cit-kanban.component.mjs';
import { CitQueueComponent } from './cit-queue.component.mjs';
import { CitModalComponent } from './cit-modal.component.mjs';
import * as i0 from '@angular/core';
const COMPONENTS = [
  CitCalendarComponent,
  CitMonthComponent,
  CitNavigatorComponent,
  CitSchedulerComponent,
  CitGanttComponent,
  CitKanbanComponent,
  CitQueueComponent,
  CitModalComponent,
];
export class CitModule {}
CitModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '13.1.3',
  ngImport: i0,
  type: CitModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
CitModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '12.0.0',
  version: '13.1.3',
  ngImport: i0,
  type: CitModule,
  declarations: [
    CitCalendarComponent,
    CitMonthComponent,
    CitNavigatorComponent,
    CitSchedulerComponent,
    CitGanttComponent,
    CitKanbanComponent,
    CitQueueComponent,
    CitModalComponent,
  ],
  exports: [
    CitCalendarComponent,
    CitMonthComponent,
    CitNavigatorComponent,
    CitSchedulerComponent,
    CitGanttComponent,
    CitKanbanComponent,
    CitQueueComponent,
    CitModalComponent,
  ],
});
CitModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '13.1.3',
  ngImport: i0,
  type: CitModule,
  imports: [[]],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '13.1.3',
  ngImport: i0,
  type: CitModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          declarations: [...COMPONENTS],
          imports: [],
          exports: [...COMPONENTS],
        },
      ],
    },
  ],
});
