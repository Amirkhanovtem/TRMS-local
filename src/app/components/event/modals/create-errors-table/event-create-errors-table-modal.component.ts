import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { SearchComponent } from '@common-search/search.component';
import { ResourceCheckErrorCauseModel } from '@event-models/resource-check-error-cause.model';

@Component({
  selector: 'app-event-create-errors-table-modal',
  templateUrl: './event-create-errors-table-modal.component.html',
  styleUrls: ['./event-create-errors-table-modal.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class EventCreateErrorsTableModalComponent extends CommonComponent {
  @ViewChild(SearchComponent) searchComponent: SearchComponent;
  resourceCheckErrorCauseListSource: Array<ResourceCheckErrorCauseModel> = [];
  errorsMap: Map<string, Array<ResourceCheckErrorCauseModel>> = new Map<string, Array<ResourceCheckErrorCauseModel>>();
  participant: Array<ResourceCheckErrorCauseModel> = [];
  trainerUnavailable: Array<ResourceCheckErrorCauseModel> = [];
  mainTrainer: Array<ResourceCheckErrorCauseModel> = [];
  linearTrainer: Array<ResourceCheckErrorCauseModel> = [];
  room: Array<ResourceCheckErrorCauseModel> = [];
  equipment: Array<ResourceCheckErrorCauseModel> = [];
  trainingCategory: Array<ResourceCheckErrorCauseModel> = [];
  trainerCategory: Array<ResourceCheckErrorCauseModel> = [];
  other: Array<ResourceCheckErrorCauseModel> = [];

  constructor(
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      resourceCheckErrorCauseList: Array<ResourceCheckErrorCauseModel>;
    },
  ) {
    super(injector);
    this.resourceCheckErrorCauseListSource = this.dialogParams.resourceCheckErrorCauseList;
    this.fillResourcesList();
  }

  filterDataSource(): void {
    if (!this.searchComponent.search || this.searchComponent.search.trim().length === 0) {
      this.resourceCheckErrorCauseListSource = this.dialogParams.resourceCheckErrorCauseList;
    } else {
      this.resourceCheckErrorCauseListSource = this.dialogParams.resourceCheckErrorCauseList.filter(error => {
        const nameIncludes = error.name.toLowerCase().includes(this.searchComponent.search.trim().toLowerCase());
        const messageIncludes = error.message.toLowerCase().includes(this.searchComponent.search.trim().toLowerCase());

        return nameIncludes || messageIncludes;
      });
    }

    this.fillResourcesList();
  }

  private fillResourcesList(): void {
    this.participant = [];
    this.trainerUnavailable = [];
    this.mainTrainer = [];
    this.linearTrainer = [];
    this.room = [];
    this.trainerCategory = [];
    this.trainingCategory = [];
    this.equipment = [];
    this.other = [];

    this.resourceCheckErrorCauseListSource.forEach(error => {
      switch (error.code) {
        case 'PARTICIPANT_IS_BUSY': {
          this.participant.push(error);
          break;
        }
        case 'TRAINER_IS_BUSY':
        case 'TRAINER_IS_UNAVAILABLE': {
          this.trainerUnavailable.push(error);
          break;
        }
        case 'MAIN_TRAINER_IS_UNAVAILABLE':
        case 'MAIN_TRAINER_IS_BUSY': {
          this.mainTrainer.push(error);
          break;
        }
        case 'LINEAR_TRAINER_IS_UNAVAILABLE':
        case 'LINEAR_TRAINER_IS_BUSY': {
          this.linearTrainer.push(error);
          break;
        }
        case 'ROOM_STATUS_CHANGE':
        case 'ROOM_IS_UNAVAILABLE':
        case 'ROOM_IS_BUSY': {
          this.room.push(error);
          break;
        }
        case 'EQUIPMENT_STATUS_CHANGE':
        case 'EQUIPMENT_IS_UNAVAILABLE':
        case 'EQUIPMENT_IS_BUSY': {
          this.equipment.push(error);
          break;
        }
        case 'TRAINING_CATEGORY_IS_BUSY': {
          this.trainingCategory.push(error);
          break;
        }
        case 'TRAINER_CATEGORY_IS_BUSY': {
          this.trainerCategory.push(error);
          break;
        }
        default: {
          this.other.push(error);
          break;
        }
      }
    });

    this.fillMap();
  }

  private fillMap(): void {
    this.errorsMap = new Map<string, Array<ResourceCheckErrorCauseModel>>();

    this.checkAndAddToMap(this.localization.getLocalTextFromKey('eventCreateErrorsTableModalPerson'), this.participant);
    this.checkAndAddToMap(
      this.localization.getLocalTextFromKey('eventCreateErrorsTableModalTrainer'),
      this.trainerUnavailable,
    );
    this.checkAndAddToMap(
      this.localization.getLocalTextFromKey('eventCreateErrorsTableModalMainTrainer'),
      this.mainTrainer,
    );
    this.checkAndAddToMap(
      this.localization.getLocalTextFromKey('eventCreateErrorsTableModalLinearTrainer'),
      this.linearTrainer,
    );
    this.checkAndAddToMap(this.localization.getLocalTextFromKey('eventCreateErrorsTableModalRoom'), this.room);
    this.checkAndAddToMap(
      this.localization.getLocalTextFromKey('eventCreateErrorsTableModalEquipment'),
      this.equipment,
    );
    this.checkAndAddToMap(
      this.localization.getLocalTextFromKey('eventCreateErrorsTableModalTrainingCategory'),
      this.trainingCategory,
    );
    this.checkAndAddToMap(
      this.localization.getLocalTextFromKey('eventCreateErrorsTableModalTrainerCategory'),
      this.trainerCategory,
    );
    this.checkAndAddToMap(this.localization.getLocalTextFromKey('eventCreateErrorsTableModalOther'), this.other);
  }

  private checkAndAddToMap(key: string, value: Array<ResourceCheckErrorCauseModel>): void {
    if (value.length > 0) {
      this.errorsMap.set(key, value);
    }
  }

  getEntries(): Array<[string, Array<ResourceCheckErrorCauseModel>]> {
    return Array.from(this.errorsMap.entries());
  }
}
