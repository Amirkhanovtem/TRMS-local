import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { TrainingSelfEnrollmentSettingsModel } from '@components/self-enrlloment/settings/training/training-self-enrollment-settings.model';
import { ModuleModel } from '@event-module-models/module.model';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';

export class TrainingModel extends StandardNameIdModel {
  public description: string = null;
  public group: string = null;
  public startTrainingDate: Date;
  public endTrainingDate: Date;
  public trainingTemplate: TrainingTemplateModel = new TrainingTemplateModel();
  public trainingModules: Array<ModuleModel> = [];
  public sessionCode: string = null;
  public trainingSelfEnrollmentSettings: TrainingSelfEnrollmentSettingsModel;

  checkTrainingForDraftSave(): boolean {
    let nameCorrect = this.name !== null && this.name.trim().length > 0,
      correct: boolean =
        this.trainingModules.length > 0 &&
        nameCorrect &&
        Object.assign(new TrainingSelfEnrollmentSettingsModel(), this.trainingSelfEnrollmentSettings)?.checkValid();

    this.trainingModules.every(module => {
      const moduleCorrectForDraft: boolean = Object.assign(new ModuleModel(), module).checkModuleForDraftSave();

      if (!moduleCorrectForDraft) {
        correct = false;
        return false;
      }

      return true;
    });

    return correct;
  }

  checkTraining(): boolean {
    let result: boolean = false,
      nameCorrect = this.name !== null && this.name.trim().length > 0,
      modulesCorrect = this.trainingModules.length > 0;

    this.trainingModules.forEach(module => {
      if (!Object.assign(new ModuleModel(), module).checkModule()) {
        modulesCorrect = false;
      }
    });

    result =
      nameCorrect &&
      modulesCorrect &&
      Object.assign(new TrainingSelfEnrollmentSettingsModel(), this.trainingSelfEnrollmentSettings)?.checkValid() &&
      this.isModuleDontOverlap();

    return result;
  }

  isModuleDontOverlap(): boolean {
    let result: boolean = true,
      allModules: Array<ModuleModel> = this.trainingModules,
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
}
