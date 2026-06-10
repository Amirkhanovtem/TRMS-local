import { EquipmentModel } from '@equipment-models/equipment.model';
import { ModuleTemplateModel } from '@module-template-models/module-template.model';
import { ModuleCardModel } from '@participation-card-models/module-card.model';
import { PersonModel } from '@person-models/person.model';
import { RoomReservationModel } from '@room-models/room-reservation.model';
import { TrainerModel } from '@trainer-models/trainer.model';

export class ModuleModel {
  public id: string = null;
  public name: string = null;
  public description: string = null;
  public startDate;
  public endDate;
  public roomReservations: Array<RoomReservationModel> = [];
  public mainTrainers: Array<TrainerModel> = [];
  public linearTrainers: Array<TrainerModel> = [];
  public equipments: Array<EquipmentModel> = [];
  public persons: Array<PersonModel> = [];
  public participantModuleCards: Array<ModuleCardModel> = [];
  public trainingModuleTemplate: ModuleTemplateModel = new ModuleTemplateModel();

  public checkModuleForDraftSave(): boolean {
    const startDateCorrect = this.startDate !== null && this.startDate.toString().trim().length > 0,
      endDateCorrect = this.endDate !== null && this.endDate.toString().trim().length > 0;

    return startDateCorrect && endDateCorrect && this.checkRoomTrainerEquipmentSomeNotEmpty();
  }

  public checkModule(): boolean {
    let result: boolean = false,
      nameCorrect = this.name && this.name.trim().length > 0,
      startDateCorrect = this.startDate !== null && this.startDate.toString().trim().length > 0,
      endDateCorrect = this.endDate !== null && this.endDate.toString().trim().length > 0,
      datesCorrect = new Date(this.endDate) > new Date(this.startDate);

    result =
      nameCorrect && startDateCorrect && endDateCorrect && datesCorrect && this.checkRoomTrainerEquipmentSomeNotEmpty();

    return result;
  }

  public checkRoomTrainerEquipmentSomeNotEmpty(): boolean {
    const mainTrainerCorrect = this.mainTrainers && this.mainTrainers.length > 0,
      equipmentsCorrect = this.equipments && this.equipments.length > 0;

    return this.roomsCorrect() || mainTrainerCorrect || equipmentsCorrect;
  }

  roomsCorrect(): boolean {
    const invalidRoomDateRange: boolean = this.roomReservations?.some(rs => {
      return new Date(rs.startDate) >= new Date(rs.endDate);
    });

    return this.roomReservations && this.roomReservations.length > 0 && !invalidRoomDateRange;
  }

  getMinTrainersCount(): number {
    const minTrainersCount = this.trainingModuleTemplate?.minimalTrainersCount;

    return minTrainersCount ? minTrainersCount : 0;
  }

  getCurrentTrainersCount(): number {
    const linearTrainersCount: number = this.linearTrainers ? this.linearTrainers.length : 0,
      mainTrainersCount: number = this.mainTrainers ? this.mainTrainers.length : 0;

    return linearTrainersCount + mainTrainersCount;
  }

  checkTrainersCount(): boolean {
    return this.getCurrentTrainersCount() >= this.getMinTrainersCount();
  }
}
