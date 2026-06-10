import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { SyllabusFactualStatusModel } from '@complete-syllabuses/models/syllabus-factual-status.model';
import { Config } from '@config/config';
import { CheckingTypeEnum } from '@event-models/checking-type.enum';
import { ModuleModel } from '@event-module-models/module.model';
import { SyllabusModel } from '@event-syllabus-models/syllabus.model';
import { GanttResourceGroupType } from '@gantt-models/gantt-resource-group-type.model';
import { GanttMovedModuleModel } from '@gantt-models/move-events/gantt-moved-module.model';
import { RoomModel } from '@room-models/room.model';
import { TrainerModel } from '@trainer-models/trainer.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SyllabusService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/syllabuses`;

  /**
   * @param syllabus
   * @param checkingType null = check all type
   */
  public checkBusyResourcesByType(syllabus: SyllabusModel, checkingType: CheckingTypeEnum): Observable<any> {
    return this.httpClient.post(
      `${this.url}/check`,
      syllabus,
      this.addParamsToOptions({
        checkingType: checkingType,
      }),
    );
  }

  public create(syllabus: SyllabusModel): Observable<any> {
    return this.httpClient.post(this.url, syllabus);
  }

  public saveAsDraft(syllabus: SyllabusModel): Observable<any> {
    return this.httpClient.post(`${this.url}/draft`, syllabus);
  }

  public updateAsDraft(syllabus: SyllabusModel): Observable<any> {
    return this.httpClient.put(`${this.url}/draft/${syllabus.id}`, syllabus);
  }

  public update(syllabus: SyllabusModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${syllabus.id}`, syllabus);
  }

  public updateFactualStatus(syllabus: SyllabusFactualStatusModel): Observable<any> {
    return this.httpClient.put(`${this.url}/factual-status/${syllabus.id}`, syllabus);
  }

  public delete(syllabus: SyllabusModel): Observable<any> {
    return this.httpClient.delete(`${this.url}/${syllabus.id}`);
  }

  public getSyllabusTemplateDetail(
    id: string,
    startDate: Date,
    resourceId?: string,
    groupId?: GanttResourceGroupType,
  ): Observable<SyllabusModel> {
    const syllabusDateDTO = {
      date: startDate,
      resourceId: resourceId,
      groupId: groupId,
    };

    return this.httpClient.post<SyllabusModel>(`${this.url}/create-syllabus/${id}`, syllabusDateDTO);
  }

  public getSyllabusEventDetailAfterMove(
    syllabusId: string,
    movedModules: Array<GanttMovedModuleModel>,
  ): Observable<SyllabusModel> {
    return this.httpClient.post<SyllabusModel>(`${this.url}/form-syllabus-move-gantt/${syllabusId}`, movedModules);
  }

  public getSyllabusEventDetail(id: string): Observable<SyllabusModel> {
    return this.httpClient.get<SyllabusModel>(`${this.url}/${id}`);
  }

  public collectAllModules(syllabus: SyllabusModel): Array<ModuleModel> {
    const modules: Array<ModuleModel> = [];

    syllabus.trainings.forEach(training => modules.push(...training.trainingModules));

    return modules;
  }

  public getAllUniqueRooms(syllabus: SyllabusModel): Array<RoomModel> {
    const uniqueRooms: Array<RoomModel> = [];

    syllabus.trainings.forEach(training => {
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
    });

    return uniqueRooms;
  }

  public getAllUniqueMainTrainers(syllabus: SyllabusModel): Array<TrainerModel> {
    const uniqueMainTrainers: Array<TrainerModel> = [];

    syllabus.trainings.forEach(training => {
      training.trainingModules.forEach(module => {
        module.mainTrainers?.forEach(mainTrainer => {
          const i = uniqueMainTrainers.findIndex(uniqueMainTrainer => {
            return uniqueMainTrainer.id === mainTrainer?.id;
          });

          if (i <= -1 && mainTrainer) {
            uniqueMainTrainers.push(mainTrainer);
          }
        });
      });
    });

    return uniqueMainTrainers;
  }

  public getAllUniqueLinearTrainers(syllabus: SyllabusModel): Array<TrainerModel> {
    const uniqueLinearTrainers: Array<TrainerModel> = [];

    syllabus.trainings.forEach(training => {
      training.trainingModules.forEach(module => {
        module.linearTrainers?.forEach(linearTrainer => {
          const i = uniqueLinearTrainers.findIndex(uniqueLinearTrainer => {
            return uniqueLinearTrainer.id === linearTrainer?.id;
          });

          if (i <= -1 && linearTrainer) {
            uniqueLinearTrainers.push(linearTrainer);
          }
        });
      });
    });

    return uniqueLinearTrainers;
  }

  public calcSyllabusDuration(syllabus: SyllabusModel): number {
    let durationInHours: number = 0;

    syllabus.trainings.forEach(training => {
      training.trainingModules.forEach(module => {
        const endDate = new Date(module.endDate),
          startDate = new Date(module.startDate);

        if (endDate && startDate) {
          durationInHours += Math.abs(endDate.getTime() - startDate.getTime()) / 36e5;
        }
      });
    });

    return durationInHours;
  }
}
