import { ModuleModel } from '@event-module-models/module.model';
import { TrainingModel } from '@event-training-models/training.model';
import { SyllabusTemplateModel } from '@syllabus-template-models/syllabus-template.model';

export class SyllabusModel {
  public id: string = null;
  public name: string = '';
  public description: string = '';
  public syllabusTemplate: SyllabusTemplateModel = new SyllabusTemplateModel();
  public trainings: Array<TrainingModel> = [];

  checkSyllabusForDraftSave(): boolean {
    let allModules: Array<ModuleModel> = this.collectAllModules(),
      nameCorrect = this.name !== null && this.name.trim().length > 0,
      correct: boolean = allModules.length > 0,
      trainingsCorrect: boolean = true;

    this.trainings.forEach(training => {
      if (!Object.assign(new TrainingModel(), training).checkTrainingForDraftSave()) {
        trainingsCorrect = false;
      }
    });

    return correct && nameCorrect && trainingsCorrect;
  }

  checkSyllabus(): boolean {
    let result: boolean = false,
      nameCorrect = this.name !== null && this.name.trim().length > 0,
      trainingsCorrect = this.trainings.length > 0;

    this.trainings.forEach(training => {
      if (!Object.assign(new TrainingModel(), training).checkTraining()) {
        trainingsCorrect = false;
      }
    });

    result = nameCorrect && trainingsCorrect && this.isModuleDontOverlap();

    return result;
  }

  isModuleDontOverlap(): boolean {
    let result: boolean = true,
      allModules: Array<ModuleModel> = this.collectAllModules(),
      checkedModules: Array<ModuleModel> = [];

    allModules.every(module => {
      const invalid = this.checkThisRangeIsEmpty(module, allModules, checkedModules);

      if (invalid) {
        result = false;
        return false;
      }

      return true;
    });

    return result;
  }

  checkThisRangeIsEmpty(
    module: ModuleModel,
    allModules: Array<ModuleModel>,
    checkedModules: Array<ModuleModel>,
  ): boolean {
    let invalid: boolean = false;

    checkedModules.push(module);

    allModules
      .filter(otherModule => !checkedModules.includes(otherModule))
      .every(otherModule => {
        const isTimeRangeOverlap: boolean = this.isTimeRangeOverlap(module, otherModule);

        if (isTimeRangeOverlap) {
          invalid = true;
          return false;
        }

        return true;
      });

    return invalid;
  }

  private isTimeRangeOverlap(module: ModuleModel, otherModule: ModuleModel): boolean {
    const startDate = new Date(module.startDate),
      endDate = new Date(module.endDate),
      otherModuleStartDate = new Date(otherModule.startDate),
      otherModuleEndDate = new Date(otherModule.endDate),
      isStartDateInRangeOtherModule = otherModuleStartDate <= startDate && startDate < otherModuleEndDate,
      isEndDateInRangeOtherModule = otherModuleStartDate < endDate && endDate <= otherModuleEndDate;

    return isStartDateInRangeOtherModule || isEndDateInRangeOtherModule;
  }

  public collectAllModules(): Array<ModuleModel> {
    const allModules: Array<ModuleModel> = [];

    this.trainings.forEach(training => training.trainingModules.forEach(module => allModules.push(module)));

    return allModules;
  }
}
