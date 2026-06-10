import { Injectable } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { EquipmentModel } from '@equipment-models/equipment.model';
import { ResourceCheckErrorCauseModel } from '@event-models/resource-check-error-cause.model';
import { ModuleModel } from '@event-module-models/module.model';
import { ModuleCheckByFormatService } from '@event-services/module-check-by-format.service';
import { SnackbarInfoComponent } from '@event-snackbar-info/snackbar-info.component';
import { RoomModel } from '@room-models/room.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private moduleCheckByFormatService: ModuleCheckByFormatService) {}

  public checkRoomsEquipmentsLocation(rooms: Array<RoomModel>, equipments: Array<EquipmentModel>): boolean {
    if (rooms.length === 0 || equipments.length === 0) {
      return true;
    }

    const roomsUniqueLocationIds: Array<string> = [],
      equipmentUniqueLocationIds: Array<string> = [];

    rooms.forEach(room => {
      const roomLocationId: string = room.location.id;
      if (!roomsUniqueLocationIds.includes(roomLocationId)) {
        roomsUniqueLocationIds.push(roomLocationId);
      }
    });

    equipments.forEach(equipment => {
      const equipmentLocationId: string = equipment.equipmentCategory.location.id;
      if (!equipmentUniqueLocationIds.includes(equipmentLocationId)) {
        equipmentUniqueLocationIds.push(equipmentLocationId);
      }
    });

    return this.isSameLocation(roomsUniqueLocationIds, equipmentUniqueLocationIds);
  }

  private isSameLocation(roomsUniqueLocationIds: Array<string>, equipmentUniqueLocationIds: Array<string>): boolean {
    const roomHasDiffLocation =
      roomsUniqueLocationIds.filter(locationId => {
        return !equipmentUniqueLocationIds.includes(locationId);
      }).length > 0;

    const equipmentHasDiffLocation = equipmentUniqueLocationIds.filter(locationId => {
      return !roomsUniqueLocationIds.includes(locationId);
    }).length;

    return !(roomHasDiffLocation || equipmentHasDiffLocation);
  }

  checkBusyResourceSuccessHandler(self): void {
    const message = self.localization.getLocalTextFromKey('eventCreateSuccessCheckSnackBarMessage');

    self.hideLoadPage();
    self.showSnackBarWithMessage(message, SnackBarTypeEnum.SUCCESS);
  }

  errorHandler(error, self): void {
    const errorBody = error.error,
      contents = errorBody.contents;
    const resourceCheckErrorCauseList: Array<ResourceCheckErrorCauseModel> = [];

    if (!contents || contents.length <= 0) {
      self.errorResponseHandler(error);
      return;
    }

    contents.forEach(content => {
      switch (content.type) {
        case EntityExceptionEnum.RESOURCE_CHECK_EXCEPTION_CONTENT: {
          resourceCheckErrorCauseList.push(...content.errorCauses);
          break;
        }
        default:
          self.errorResponseHandler(error);
      }
    });

    self.hideLoadPage();
    EventService.showEventCreateResourceBusySnackBar(resourceCheckErrorCauseList, self);
  }

  private static showEventCreateResourceBusySnackBar(
    resourceCheckErrorCauseList: Array<ResourceCheckErrorCauseModel>,
    self,
  ): void {
    if (resourceCheckErrorCauseList?.length === 0) {
      return;
    }

    self.showSnackBarWithMessage(
      self.localization.getLocalTextFromKey('eventCreateErrorsSnackBarMessage'),
      SnackBarTypeEnum.ERROR,
      {
        timeOut: 0,
        toastComponent: SnackbarInfoComponent,
        payload: {
          data: resourceCheckErrorCauseList,
          self: self,
        },
      },
    );
  }

  showConfirmMinTrainersMessage(modules: Array<ModuleModel>, component: CommonComponent): Promise<void> {
    const invalidMinTrainersCountModuleNames: Array<string> = modules
      .filter(module => {
        return !Object.assign(new ModuleModel(), module).checkTrainersCount();
      })
      .map(module => module.name);

    return this.getPromiseWithModuleNameListMessage(
      invalidMinTrainersCountModuleNames,
      true,
      component,
      'creatingEventMinTrainersCountConfirmMessage',
    );
  }

  checkModulesRoomRequiredByFormat(modules: Array<ModuleModel>, component: CommonComponent): Promise<void> {
    const invalidRequiredRoomsModuleNames: Array<string> = modules
      .filter(module => this.moduleCheckByFormatService.checkModuleRoomRequiredInvalid(module))
      .map(module => module.name);

    return this.getPromiseWithModuleNameListMessage(
      invalidRequiredRoomsModuleNames,
      false,
      component,
      null,
      'creatingEventModulesRequiredRoomErrorMessage',
    );
  }

  showConfirmRoomCapacityMessage(modules: Array<ModuleModel>, component: CommonComponent): Promise<void> {
    const invalidCapacityRoomsModuleNames: Array<string> = modules
      .filter(module => this.moduleCheckByFormatService.checkModuleRoomCapacityInvalid(module))
      .map(module => module.name);

    return this.getPromiseWithModuleNameListMessage(
      invalidCapacityRoomsModuleNames,
      true,
      component,
      'creatingEventOverRoomCapacityConfirmMessage',
    );
  }

  showDifferentModuleParticipantsMessage(
    targetModule: ModuleModel,
    allEventModules: Array<ModuleModel>,
    component: CommonComponent,
  ): Promise<void> {
    const findDifferentParticipants = allEventModules
      .filter(module => module.trainingModuleTemplate.id !== targetModule.trainingModuleTemplate.id)
      .some(module => {
        const targetPersonIds: Array<string> = targetModule.persons
            ? targetModule.persons.map(person => person.id)
            : [],
          personIds: Array<string> = module.persons ? module.persons.map(person => person.id) : [];

        if (targetPersonIds.length !== personIds.length) {
          return true;
        }

        return personIds.some(personId => !targetPersonIds.includes(personId));
      });

    if (findDifferentParticipants) {
      const confirmMessage: string = component.localization.getLocalTextFromKey(
        'creatingEventModulesDifferentParticipantsConfirmMessage',
      );

      return this.showConfirmPromiseModal(component, confirmMessage);
    } else {
      return Promise.resolve();
    }
  }

  private getPromiseWithModuleNameListMessage(
    invalidModuleNameList: Array<string>,
    withConfirm: boolean,
    component: CommonComponent,
    confirmMessageKey?: string,
    rejectMessageKey?: string,
  ): Promise<void> {
    if (!invalidModuleNameList || invalidModuleNameList.length === 0) {
      return Promise.resolve();
    }

    const moduleNames: string = invalidModuleNameList.join(', '),
      templateTextMap = new Map<string, string>([['modules', moduleNames]]);

    if (withConfirm) {
      const confirmMessage: string = component.localization.getLocalFormattedTextFromKey(
        confirmMessageKey,
        templateTextMap,
      );

      return this.showConfirmPromiseModal(component, confirmMessage);
    }

    const errorMessage: string = component.localization.getLocalFormattedTextFromKey(rejectMessageKey, templateTextMap);

    return Promise.reject(errorMessage);
  }

  showConfirmPromiseModal(component: CommonComponent, confirmMessage: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      component
        .showConfirmModal(confirmMessage)
        .afterClosed()
        .subscribe({
          next: result => {
            result ? resolve() : reject();
          },
        });
    });
  }
}
