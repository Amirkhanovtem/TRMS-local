import { AfterContentChecked, Component, Injector, Input, ViewChild } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { CommonComponent } from '@common-components/common.component';
import { CommonDateTimeService } from '@common-services/common-date-time.service';
import { CreatingEventEquipmentTableComponent } from '@event-components/general-child-table/equipment/creating-event-equipment-table.component';
import { CreatingEventRoomTableComponent } from '@event-components/general-child-table/room/creating-event-room-table.component';
import { CreateUpdateModuleModalComponent } from '@event-module-modals-create-update/create-update-module-modal.component';
import { ModuleModel } from '@event-module-models/module.model';
import { TrainingBoundsModel } from '@event-training-models/training-bounds.model';
import { RoomReservationModel } from '@room-models/room-reservation.model';
import moment, { Moment } from 'moment';

@Component({
  selector: 'app-module-resource-step',
  templateUrl: './module-resource-step.component.html',
  styleUrls: ['./module-resource-step.component.scss', '../../../../../../../../styles.scss'],
  standalone: false,
})
export class ModuleResourceStepComponent extends CommonComponent implements AfterContentChecked {
  nameControl;
  dateControl;
  timeStartControl;
  timeEndControl;
  @Input() parent: CreateUpdateModuleModalComponent;
  @ViewChild(CreatingEventEquipmentTableComponent)
  creatingEventEquipmentsTableComponent: CreatingEventEquipmentTableComponent;
  @ViewChild(CreatingEventRoomTableComponent) creatingEventRoomTableComponent: CreatingEventRoomTableComponent;

  constructor(
    injector: Injector,
    public commonDateTimeService: CommonDateTimeService,
  ) {
    super(injector);
  }

  ngAfterContentChecked(): void {
    this.nameControl = this.parent.getValidator('name');
    this.dateControl = this.parent.getValidator('date');
    this.timeStartControl = this.parent.getValidator('timeStart');
    this.timeEndControl = this.parent.getValidator('timeEnd');
    this.setValues();
    this.cdref.detectChanges();
  }

  updateChildComponentsTable(): void {
    this.updateRoomTable();
    this.updateEquipmentCategoriesTable();
  }

  private updateRoomTable(): void {
    this.creatingEventRoomTableComponent.modules = [this.parent.module];
    this.creatingEventRoomTableComponent.updateRoomsDataSource();
  }

  private updateEquipmentCategoriesTable(): void {
    this.creatingEventEquipmentsTableComponent.modules = [this.parent.module];
    this.creatingEventEquipmentsTableComponent.updateEquipmentsDataSource();
  }

  getDate(date): Date {
    if (date && date.trim().length > 0) {
      return moment(date).utc(true).toDate();
    }

    return null;
  }

  private findNextTrainingForMoving(
    start: Date,
    end: Date,
    movedTrainings: Array<string>,
    allTrainingBound: Array<TrainingBoundsModel>,
  ): TrainingBoundsModel {
    return allTrainingBound
      .filter(trainingBound => {
        const notMovedTraining: boolean = !movedTrainings.includes(trainingBound.trainingTemplateId),
          newDurationCrossOtherTrainings: boolean = this.isTimeRangeOverlap(
            start,
            end,
            trainingBound.startDate,
            trainingBound.endDate,
          );

        return notMovedTraining && newDurationCrossOtherTrainings;
      })
      .sort((t1, t2) => {
        return new Date(t1.startDate).getTime() - new Date(t2.startDate).getTime();
      })[0];
  }

  private findNextModuleForMoving(start: Date, end: Date, movedModules: Array<string>): ModuleModel {
    return this.parent.dialogParams.allModulesInEvent
      .filter(module => {
        const notMovedModule: boolean = !movedModules.includes(module.id),
          currentTrainingModule: boolean =
            module.trainingModuleTemplate.trainingTemplate.id === this.parent.dialogParams.trainingTemplateId,
          newDurationCrossOtherModules: boolean = this.isTimeRangeOverlap(start, end, module.startDate, module.endDate);

        return notMovedModule && currentTrainingModule && newDurationCrossOtherModules;
      })
      .sort((m1, m2) => {
        return new Date(m1.startDate).getTime() - new Date(m2.startDate).getTime();
      })[0];
  }

  private getAllTrainingBounds(): Array<TrainingBoundsModel> {
    const allModules: Array<ModuleModel> = this.parent.dialogParams.allModulesInEvent,
      allUniqueTrainingTemplateIds: Array<string> = [
        ...new Set(allModules.map(module => module.trainingModuleTemplate.trainingTemplate.id)),
      ];

    return allUniqueTrainingTemplateIds.map(trainingTemplateId => {
      const trainingModules: Array<ModuleModel> = allModules.filter(module => {
          return module.trainingModuleTemplate.trainingTemplate.id === trainingTemplateId;
        }),
        startTrainingTime: number = Math.min(
          ...trainingModules.map(module => {
            return new Date(module.startDate).getTime();
          }),
        ),
        endTrainingTime: number = Math.max(
          ...trainingModules.map(module => {
            return new Date(module.endDate).getTime();
          }),
        );

      return new TrainingBoundsModel(trainingTemplateId, new Date(startTrainingTime), new Date(endTrainingTime));
    });
  }

  private processTrainingReplacing(timeMoveDelta: number): void {
    const allTrainingBounds = this.getAllTrainingBounds();

    const currentTrainingBounds: TrainingBoundsModel = allTrainingBounds.find(training => {
      return training.trainingTemplateId === this.parent.dialogParams.trainingTemplateId;
    });

    let start: Date = currentTrainingBounds.startDate,
      end: Date = currentTrainingBounds.endDate,
      movedTrainings: Array<string> = [currentTrainingBounds.trainingTemplateId];

    let trainingForMoving: TrainingBoundsModel = this.findNextTrainingForMoving(
      start,
      end,
      movedTrainings,
      allTrainingBounds,
    );

    if (trainingForMoving) {
      this.showConfirmModal(
        this.localization.getLocalTextFromKey('moduleModalAutoReplaceOverlapTrainingsConfirmMessage'),
      )
        .afterClosed()
        .subscribe(result => {
          if (result) {
            while (trainingForMoving) {
              this.parent.dialogParams.allModulesInEvent
                .filter(
                  module => module.trainingModuleTemplate.trainingTemplate.id === trainingForMoving.trainingTemplateId,
                )
                .forEach(moduleForMove => {
                  this.replaceModule(timeMoveDelta, moduleForMove);

                  if (timeMoveDelta > 0) {
                    end = moduleForMove.endDate;
                  } else if (timeMoveDelta < 0) {
                    start = moduleForMove.startDate;
                  }
                });

              movedTrainings.push(trainingForMoving.trainingTemplateId);

              trainingForMoving = this.findNextTrainingForMoving(start, end, movedTrainings, allTrainingBounds);
            }
          }
        });
    }
  }

  private prepareForReplaceOverlapModules(copyModule: ModuleModel, module: ModuleModel): void {
    const timeMoveDelta: number =
      new Date(module.startDate).getTime() - new Date(copyModule.startDate).getTime() > 0
        ? new Date(module.startDate).getTime() - new Date(copyModule.startDate).getTime()
        : new Date(module.endDate).getTime() - new Date(copyModule.endDate).getTime();

    this.checkAndReplaceOverlapModules(module.startDate, module.endDate, [module.id], timeMoveDelta);
  }

  private checkAndReplaceOverlapModules(
    start: Date,
    end: Date,
    movedModules: Array<string>,
    timeMoveDelta: number,
  ): void {
    let moduleForMove: ModuleModel = this.findNextModuleForMoving(start, end, movedModules);

    if (moduleForMove) {
      this.showConfirmModal(this.localization.getLocalTextFromKey('moduleModalAutoReplaceOverlapModulesConfirmMessage'))
        .afterClosed()
        .subscribe(result => {
          if (result) {
            while (moduleForMove) {
              this.replaceModule(timeMoveDelta, moduleForMove);

              movedModules.push(moduleForMove.id);

              if (timeMoveDelta > 0) {
                end = moduleForMove.endDate;
              } else if (timeMoveDelta < 0) {
                start = moduleForMove.startDate;
              }

              moduleForMove = this.findNextModuleForMoving(start, end, movedModules);
            }
          }
        })
        .add(() => this.processTrainingReplacing(timeMoveDelta));
    } else {
      this.processTrainingReplacing(timeMoveDelta);
    }
  }

  private replaceModule(timeMoveDelta: number, moduleForMove: ModuleModel): void {
    this.checkDates(moduleForMove);

    moduleForMove.startDate = this.calcNewDateByDelta(moduleForMove.startDate, timeMoveDelta);
    moduleForMove.endDate = this.calcNewDateByDelta(moduleForMove.endDate, timeMoveDelta);

    moduleForMove.roomReservations?.forEach(rs => {
      rs.startDate = this.calcNewDateByDelta(rs.startDate, timeMoveDelta);
      rs.endDate = this.calcNewDateByDelta(rs.endDate, timeMoveDelta);
    });

    this.convertStartEndDates(moduleForMove);
  }

  calcNewDateByDelta(date: Date, timeMoveDelta: number): Date {
    const newDateTime: number = new Date(date).getTime() + timeMoveDelta;

    return new Date(newDateTime);
  }

  changeDates($event): void {
    if ($event?.value?._d) {
      const module = this.parent.module,
        newDate = $event?.value?._d,
        copyModule: ModuleModel = JSON.parse(JSON.stringify(module)),
        warningList: Array<string> = [];

      this.checkDates(module);

      this.changeDate(module.startDate, newDate);
      this.changeDate(module.endDate, newDate);
      this.changeDateForRooms(module, newDate);
      this.convertStartEndDates(module);
      this.updateRoomTable();

      if (this.isHolidayDate(newDate)) {
        warningList.push(this.localization.getLocalTextFromKey('moduleDateSelectHolidayDateConfirmMessage'));
      }

      if (!this.checkAllTrainingModulesMinMaxBreakTime()) {
        warningList.push(this.localization.getLocalTextFromKey('moduleDateInvalidMinMaxBreakTimeConfirmMessage'));
      }

      if (!this.checkModuleOrder()) {
        warningList.push(this.localization.getLocalTextFromKey('changeOrderWarnMessage'));
      }

      this.warningListHandler(warningList, copyModule, module);
    }
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const date = cellDate['_d'];

      return this.isHolidayDate(date) ? 'calendar-holiday-btn' : '';
    }

    return '';
  };

  isInvalidTimeRange(): boolean {
    return new Date(this.parent.module.endDate) <= new Date(this.parent.module.startDate);
  }

  getTime(date: Date): string {
    if (!date) {
      return null;
    }
    const hours = this.getHourFromDate(date);
    const minutes = this.getMinuteFromDate(date);
    return `${hours}:${minutes}`;
  }

  getStartHour(): string {
    return this.getHourFromDate(this.parent.module.startDate);
  }

  getStartMinute(): string {
    return this.getMinuteFromDate(this.parent.module.startDate);
  }

  getEndHour(): string {
    return this.getHourFromDate(this.parent.module.endDate);
  }

  getEndMinute(): string {
    return this.getMinuteFromDate(this.parent.module.endDate);
  }

  private getHourFromDate(date: Date): string {
    if (!date) {
      return null;
    }
    return new Date(date).getHours().toString();
  }

  private getMinuteFromDate(date: Date): string {
    if (!date) {
      return null;
    }
    return new Date(date).getMinutes().toString();
  }

  changeStartHour(hour: string): void {
    const minute = this.getStartMinute() || '0';
    this.changeStartDate(`${hour}:${minute}`);
  }

  changeStartMinute(minute: string): void {
    const hour = this.getStartHour() || '0';
    this.changeStartDate(`${hour}:${minute}`);
  }

  changeEndHour(hour: string): void {
    const minute = this.getEndMinute() || '0';
    this.changeEndDate(`${hour}:${minute}`);
  }

  changeEndMinute(minute: string): void {
    const hour = this.getEndHour() || '0';
    this.changeEndDate(`${hour}:${minute}`);
  }

  changeDateTime(date: Date, timeArray: Array<string>): void {
    date.setHours(Number(timeArray[0]));
    date.setMinutes(Number(timeArray[1]));
  }

  changeStartDate(startTime: string): void {
    const module: ModuleModel = this.parent.module,
      copyModule: ModuleModel = JSON.parse(JSON.stringify(module)),
      warningList: Array<string> = [];
    this.checkDates(module);
    const startTimeArray = startTime.split(':');

    this.changeDateTime(module.startDate, startTimeArray);
    this.convertStartEndDates(module);

    module.roomReservations?.forEach(rs => (rs.startDate = module.startDate));

    if (!this.checkModuleOrder()) {
      warningList.push(this.localization.getLocalTextFromKey('changeOrderWarnMessage'));
    }

    this.warningListHandler(warningList, copyModule, module);
  }

  changeEndDate(endTime: string): void {
    const module: ModuleModel = this.parent.module,
      copyModule: ModuleModel = JSON.parse(JSON.stringify(module));
    this.checkDates(module);
    const endTimeArray = endTime.split(':');

    this.changeDateTime(module.endDate, endTimeArray);
    this.convertStartEndDates(module);

    module.roomReservations?.forEach(rs => (rs.endDate = module.endDate));

    this.warningListHandler([], copyModule, module);
  }

  isInvalidOverlapTimeRangeWithOtherModules(): boolean {
    const module: ModuleModel = this.parent.module;
    let invalid: boolean = false;

    this.parent.dialogParams?.allModulesInEvent
      .filter(otherModule => {
        if (module.id) {
          return otherModule.id !== module.id;
        } else {
          return otherModule !== module;
        }
      })
      .every(otherModule => {
        const isTimeRangeOverlap: boolean = this.isTimeRangeOverlap(
          module.startDate,
          module.endDate,
          otherModule.startDate,
          otherModule.endDate,
        );

        if (isTimeRangeOverlap) {
          invalid = true;
          return false;
        }

        return true;
      });

    return invalid;
  }

  changeModuleTimeByRoomsTime(): void {
    const module: ModuleModel = this.parent.module;
    const copyModule: ModuleModel = structuredClone(module),
      rooms: Array<RoomReservationModel> = module.roomReservations;
    const warningList: Array<string> = [];

    if (rooms.length === 0) {
      return;
    }

    let moduleStartDate = new Date(rooms[0].startDate),
      moduleEndDate = new Date(rooms[0].endDate);

    for (let i = 1; i < rooms.length; i++) {
      const roomStartDate = new Date(rooms[i].startDate),
        roomEndDate = new Date(rooms[i].endDate);

      if (roomStartDate < moduleStartDate) {
        moduleStartDate = roomStartDate;
      }

      if (roomEndDate > moduleEndDate) {
        moduleEndDate = roomEndDate;
      }
    }

    module.startDate = moduleStartDate;
    module.endDate = moduleEndDate;

    this.convertStartEndDates(module);

    if (!this.checkModuleOrder()) {
      warningList.push(this.localization.getLocalTextFromKey('changeOrderWarnMessage'));
    }

    this.warningListHandler(warningList, copyModule, module);
  }

  public isTimeRangeOverlap(s1: Date, e1: Date, s2: Date, e2: Date): boolean {
    const startDate = new Date(s1),
      endDate = new Date(e1),
      otherModuleStartDate = new Date(s2),
      otherModuleEndDate = new Date(e2);

    return (
      startDate === otherModuleStartDate ||
      endDate === otherModuleEndDate ||
      (startDate < otherModuleEndDate && otherModuleStartDate < endDate)
    );
  }

  private warningListHandler(warningList: Array<string>, copyModule: ModuleModel, module: ModuleModel): void {
    if (warningList.length === 0) {
      return;
    }

    this.showConfirmModal(warningList[0])
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.warningListHandler(warningList.slice(1), copyModule, module);
        } else if (!result) {
          this.returnTimeHandler(copyModule);
        }
      });
  }

  setValues(): void {
    this.parent.modalForm.get('date').setValue(this.parent.module.startDate);
    this.parent.modalForm.get('timeStart').setValue(this.getTime(this.parent.module.startDate));
    this.parent.modalForm.get('timeEnd').setValue(this.getTime(this.parent.module.endDate));
  }

  returnTimeHandler(copyModule: ModuleModel): void {
    this.parent.module.startDate = copyModule.startDate;
    this.parent.module.endDate = copyModule.endDate;

    this.parent.module.roomReservations?.forEach(rs => {
      const copyRs: RoomReservationModel = copyModule.roomReservations.find(copyRs => {
        return copyRs.room.id === rs.room.id;
      });

      rs.startDate = copyRs.startDate;
      rs.endDate = copyRs.endDate;
    });

    this.updateRoomTable();
  }

  private checkModuleOrder(): boolean {
    let orderInvalid: boolean = false;

    this.getSortedTrainingModuleListByStartDate().forEach((otherModule, i) => {
      if (otherModule === this.parent.module) {
        orderInvalid = otherModule.trainingModuleTemplate.orderNumber !== i;
      }
    });

    return !orderInvalid;
  }

  private checkAllTrainingModulesMinMaxBreakTime(): boolean {
    let invalidMinMax: boolean = false,
      sortedModules: Array<ModuleModel> = this.getSortedTrainingModuleListByStartDate();

    for (let i = 0; i < sortedModules.length; i++) {
      const prevModule: ModuleModel = sortedModules[i],
        nextModule: ModuleModel = sortedModules[i + 1];

      if (nextModule) {
        const workDayRange: number = this.getWorkDayRangeBetweenModules(prevModule, nextModule),
          minBreakTime: number = prevModule.trainingModuleTemplate.breakAfterModuleMin,
          maxBreakTime: number = prevModule.trainingModuleTemplate.breakAfterModuleMax;

        if (workDayRange < minBreakTime || workDayRange > maxBreakTime) {
          invalidMinMax = true;
          break;
        }
      }
    }

    return !invalidMinMax;
  }

  private getWorkDayRangeBetweenModules(prevModule: ModuleModel, nextModule: ModuleModel): number {
    let dayRange: number = 0,
      startDate: number = new Date(prevModule.endDate).setHours(0, 0, 0, 0),
      endDate: number = new Date(nextModule.startDate).setHours(0, 0, 0, 0),
      dayRangeInTime: number = 86400000;

    while (startDate !== endDate) {
      if (!this.isHolidayDate(new Date(startDate))) {
        dayRange++;
      }

      startDate += dayRangeInTime;
    }

    return dayRange;
  }

  private getSortedTrainingModuleListByStartDate(): Array<ModuleModel> {
    return this.parent.dialogParams.allModulesInEvent
      .filter(otherModule => {
        return (
          otherModule.trainingModuleTemplate.trainingTemplate.id ===
          this.parent.module.trainingModuleTemplate.trainingTemplate.id
        );
      })
      .sort((m1, m2) => {
        return new Date(m1.startDate).getTime() - new Date(m2.startDate).getTime();
      });
  }

  private isHolidayDate(date: Date): boolean {
    return this.parent.holidaysDate.some(holidayDate => {
      const holidayMoment: Moment = moment(holidayDate),
        dateMoment: Moment = moment(date);

      return holidayMoment.isSame(dateMoment, 'days');
    });
  }

  convertStartEndDates(module: ModuleModel): void {
    module.startDate = this.commonDateTimeService.convertDateToLocalDateTimeWithoutTimeZone(module.startDate);
    module.endDate = this.commonDateTimeService.convertDateToLocalDateTimeWithoutTimeZone(module.endDate);
  }

  changeDate(date: Date, newDate: Date): void {
    date.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
  }

  changeDateForRooms(module: ModuleModel, newDate): void {
    module.roomReservations?.forEach(rs => {
      const rsStartDate: Date = new Date(rs.startDate),
        rsEndDate: Date = new Date(rs.endDate);

      this.changeDate(rsStartDate, newDate);
      this.changeDate(rsEndDate, newDate);

      rs.startDate = this.commonDateTimeService.convertDateToLocalDateTimeWithoutTimeZone(rsStartDate);
      rs.endDate = this.commonDateTimeService.convertDateToLocalDateTimeWithoutTimeZone(rsEndDate);
    });
  }

  checkDates(module: ModuleModel): void {
    const startDate = module.startDate === null ? new Date() : module.startDate,
      endDate = module.endDate === null ? new Date() : module.endDate;

    module.startDate = new Date(startDate);
    module.endDate = new Date(endDate);
  }
}
