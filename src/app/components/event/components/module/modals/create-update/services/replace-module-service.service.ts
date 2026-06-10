import { Injectable } from '@angular/core';
import { ModuleResourceStepComponent } from '@event-module-modals-create-update-resource-step/module-resource-step.component';
import { ModuleModel } from '@event-module-models/module.model';
import { TrainingBoundsModel } from '@event-training-models/training-bounds.model';

@Injectable({
  providedIn: 'root',
})
export class ReplaceModuleServiceService {
  constructor(public moduleResourceStepComponent: ModuleResourceStepComponent) {}

  public checkAndReplace(copyModule: ModuleModel, module: ModuleModel): void {
    const timeMoveDelta: number = ReplaceModuleServiceService.getTimeMoveDelta(copyModule, module);

    this.startReplace(module.startDate, module.endDate, [module.trainingModuleTemplate.id], timeMoveDelta);
  }

  private static getTimeMoveDelta(copyModule: ModuleModel, module: ModuleModel): number {
    return new Date(module.startDate).getTime() - new Date(copyModule.startDate).getTime() > 0
      ? new Date(module.startDate).getTime() - new Date(copyModule.startDate).getTime()
      : new Date(module.endDate).getTime() - new Date(copyModule.endDate).getTime();
  }

  private startReplace(start: Date, end: Date, movedModules: Array<string>, timeMoveDelta: number): void {
    new Promise(resolve => {
      this.checkAndReplaceOverlapModules(start, end, movedModules, timeMoveDelta, resolve);
    })
      .then(resolve => {
        this.processTrainingReplacing(timeMoveDelta, resolve);
      })
      .finally(() => {
        this.moduleResourceStepComponent.parent.modalComponent.modal.close(true);
      });
  }

  private checkAndReplaceOverlapModules(
    start: Date,
    end: Date,
    movedModules: Array<string>,
    timeMoveDelta: number,
    resolve,
  ): void {
    let moduleForMove: ModuleModel = this.findNextModuleForMoving(start, end, movedModules);

    if (moduleForMove) {
      this.moduleResourceStepComponent
        .showConfirmModal(
          this.moduleResourceStepComponent.localization.getLocalTextFromKey(
            'moduleModalAutoReplaceOverlapModulesConfirmMessage',
          ),
        )
        .afterClosed()
        .subscribe({
          next: data => {
            if (data) {
              while (moduleForMove) {
                this.replaceModule(timeMoveDelta, moduleForMove);

                movedModules.push(moduleForMove.trainingModuleTemplate.id);

                if (timeMoveDelta > 0) {
                  end = moduleForMove.endDate;
                } else if (timeMoveDelta < 0) {
                  start = moduleForMove.startDate;
                }

                moduleForMove = this.findNextModuleForMoving(start, end, movedModules);
              }
            }
          },
        })
        .add(() => resolve());
    } else {
      resolve();
    }
  }

  private findNextModuleForMoving(start: Date, end: Date, movedModules: Array<string>): ModuleModel {
    return this.moduleResourceStepComponent.parent.dialogParams.allModulesInEvent
      .filter(module => {
        const notMovedModule: boolean = !movedModules.includes(module.trainingModuleTemplate.id),
          currentTrainingModule: boolean =
            module.trainingModuleTemplate.trainingTemplate.id ===
            this.moduleResourceStepComponent.parent.dialogParams.trainingTemplateId,
          newDurationCrossOtherModules: boolean = this.moduleResourceStepComponent.isTimeRangeOverlap(
            start,
            end,
            module.startDate,
            module.endDate,
          );

        return notMovedModule && currentTrainingModule && newDurationCrossOtherModules;
      })
      .sort((m1, m2) => {
        return new Date(m1.startDate).getTime() - new Date(m2.startDate).getTime();
      })[0];
  }

  private replaceModule(timeMoveDelta: number, moduleForMove: ModuleModel): void {
    this.moduleResourceStepComponent.checkDates(moduleForMove);

    moduleForMove.startDate = this.calcNewDateByDelta(moduleForMove.startDate, timeMoveDelta);
    moduleForMove.endDate = this.calcNewDateByDelta(moduleForMove.endDate, timeMoveDelta);

    moduleForMove.roomReservations?.forEach(rs => {
      rs.startDate = this.calcNewDateByDelta(rs.startDate, timeMoveDelta);
      rs.endDate = this.calcNewDateByDelta(rs.endDate, timeMoveDelta);
    });

    this.moduleResourceStepComponent.convertStartEndDates(moduleForMove);
  }

  private processTrainingReplacing(timeMoveDelta: number, resolve): void {
    const allTrainingBounds = this.getAllTrainingBounds();

    const currentTrainingBounds: TrainingBoundsModel = allTrainingBounds.find(training => {
      return training.trainingTemplateId === this.moduleResourceStepComponent.parent.dialogParams.trainingTemplateId;
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
      this.moduleResourceStepComponent
        .showConfirmModal(
          this.moduleResourceStepComponent.localization.getLocalTextFromKey(
            'moduleModalAutoReplaceOverlapTrainingsConfirmMessage',
          ),
        )
        .afterClosed()
        .subscribe({
          next: data => {
            if (data) {
              while (trainingForMoving) {
                this.moduleResourceStepComponent.parent.dialogParams.allModulesInEvent
                  .filter(
                    module =>
                      module.trainingModuleTemplate.trainingTemplate.id === trainingForMoving.trainingTemplateId,
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
          },
        })
        .add(() => resolve());
    } else {
      resolve();
    }
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
          newDurationCrossOtherTrainings: boolean = this.moduleResourceStepComponent.isTimeRangeOverlap(
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

  calcNewDateByDelta(date: Date, timeMoveDelta: number): Date {
    const newDateTime: number = new Date(date).getTime() + timeMoveDelta;

    return new Date(newDateTime);
  }

  private getAllTrainingBounds(): Array<TrainingBoundsModel> {
    const allModules: Array<ModuleModel> = this.moduleResourceStepComponent.parent.dialogParams.allModulesInEvent,
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
}
