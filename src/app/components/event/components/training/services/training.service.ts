import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { CheckingTypeEnum } from '@event-models/checking-type.enum';
import { TrainingModel } from '@event-training-models/training.model';
import { GanttResourceGroupType } from '@gantt-models/gantt-resource-group-type.model';
import { GanttMovedModuleModel } from '@gantt-models/move-events/gantt-moved-module.model';
import { RoomModel } from '@room-models/room.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/trainings`;

  /**
   * @param trainingModel
   * @param checkingType = null check all
   */
  public checkBusyResourcesByType(trainingModel: TrainingModel, checkingType: CheckingTypeEnum): Observable<any> {
    return this.httpClient.post(
      this.url + '/check',
      trainingModel,
      this.addParamsToOptions({
        checkingType: checkingType,
      }),
    );
  }

  public create(trainingModel: TrainingModel): Observable<any> {
    return this.httpClient.post(this.url, trainingModel);
  }

  public update(trainingModel: TrainingModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${trainingModel.id}`, trainingModel);
  }

  public saveAsDraft(trainingModel: TrainingModel): Observable<any> {
    return this.httpClient.post(`${this.url}/draft`, trainingModel);
  }

  public updateAsDraft(trainingModel: TrainingModel): Observable<any> {
    return this.httpClient.put(`${this.url}/draft/${trainingModel.id}`, trainingModel);
  }

  public delete(trainingModel: TrainingModel): Observable<any> {
    return this.httpClient.delete(`${this.url}/${trainingModel.id}`);
  }

  public getTrainingTemplateDetail(
    id: string,
    startDate: Date,
    resourceId?: string,
    groupId?: GanttResourceGroupType,
  ): Observable<TrainingModel> {
    const trainingDateDTO = {
      date: startDate,
      resourceId: resourceId,
      groupId: groupId,
    };

    return this.httpClient.post<TrainingModel>(`${this.url}/create-training/${id}`, trainingDateDTO);
  }

  public getTrainingEventDetail(id: string): Observable<TrainingModel> {
    return this.httpClient.get<TrainingModel>(`${this.url}/${id}`);
  }

  public getTrainingEventDetailAfterMove(
    trainingId: string,
    movedModules: Array<GanttMovedModuleModel>,
  ): Observable<TrainingModel> {
    return this.httpClient.post<TrainingModel>(`${this.url}/form-training-move-gantt/${trainingId}`, movedModules);
  }

  public calcTrainingDuration(training: TrainingModel): number {
    let durationInHours: number = 0;

    training.trainingModules.forEach(module => {
      const endDate = new Date(module.endDate),
        startDate = new Date(module.startDate);

      if (endDate && startDate) {
        durationInHours += Math.abs(endDate.getTime() - startDate.getTime()) / 36e5;
      }
    });

    return durationInHours;
  }

  public getAllUniqueRooms(training: TrainingModel): Array<RoomModel> {
    const uniqueRooms: Array<RoomModel> = [];

    training.trainingModules.forEach(module => {
      module.roomReservations.forEach(moduleRs => {
        const i = uniqueRooms.findIndex(room => {
          return room.id === moduleRs?.room?.id;
        });

        if (i <= -1 && moduleRs) {
          uniqueRooms.push(moduleRs.room);
        }
      });
    });

    return uniqueRooms;
  }
}
