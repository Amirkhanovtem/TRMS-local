import { Injectable } from '@angular/core';
import { ModuleModel } from '@event-module-models/module.model';
import { RoomReservationModel } from '@room-models/room-reservation.model';
import { TrainingTemplateFormatEnum } from '@training-template-models/training-template-format.enum';

@Injectable({
  providedIn: 'root',
})
export class ModuleCheckByFormatService {
  private readonly WEBINAR_MAX_CAPACITY: number = 100;
  private readonly ROOM_REQUIRED_FORMAT: Array<string> = [
    TrainingTemplateFormatEnum.CLASSROOM,
    TrainingTemplateFormatEnum.SIMULATOR,
    TrainingTemplateFormatEnum.WEBINAR,
    TrainingTemplateFormatEnum.OJT,
  ];
  private readonly COUNT_TRAINERS_IN_CAPACITY_FORMAT: Array<string> = [TrainingTemplateFormatEnum.WEBINAR];

  checkModuleRoomRequiredInvalid(module: ModuleModel): boolean {
    const moduleFormat: string = module.trainingModuleTemplate.format.id,
      roomRequiredFormat: boolean = this.ROOM_REQUIRED_FORMAT.includes(moduleFormat);

    return roomRequiredFormat && this.checkArrayIsEmpty(module.roomReservations);
  }

  checkModuleRoomCapacityInvalid(module: ModuleModel): boolean {
    let moduleFormat: string = module.trainingModuleTemplate.format.id,
      personsCount: number = this.getModulePersonsCount(module),
      capacity: number;

    switch (moduleFormat) {
      case TrainingTemplateFormatEnum.WEBINAR: {
        capacity = this.WEBINAR_MAX_CAPACITY;
        break;
      }
      default: {
        capacity = this.getMinCapacityRoom(module);
      }
    }

    return personsCount > capacity;
  }

  private getModulePersonsCount(module: ModuleModel): number {
    let moduleFormat: string = module.trainingModuleTemplate.format.id,
      personsCount: number = module.persons ? module.persons.length : 0;

    if (this.COUNT_TRAINERS_IN_CAPACITY_FORMAT.includes(moduleFormat)) {
      personsCount += Object.assign(new ModuleModel(), module).getCurrentTrainersCount();
    }

    return personsCount;
  }

  private getMinCapacityRoom(module: ModuleModel): number {
    let roomReservations: Array<RoomReservationModel> = module.roomReservations,
      minRoomCapacity: number = 0;

    if (roomReservations && roomReservations.length > 0) {
      minRoomCapacity = roomReservations.map(rs => rs.room.capacity).reduce((c1, c2) => (c1 > c2 ? c2 : c1));
    }

    return minRoomCapacity;
  }

  private checkArrayIsEmpty(arr: Array<any>): boolean {
    return !arr || arr.length === 0;
  }
}
