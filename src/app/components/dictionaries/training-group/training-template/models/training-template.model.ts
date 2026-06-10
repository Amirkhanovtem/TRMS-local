import { CertificateTemplateModel } from '@certificate-template-models/certificate-template.model';
import { DragOrderModel } from '@common-drag-order-modal-models/drag-order.model';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { TrainingTemplateSelfEnrollmentSettingsModel } from '@components/self-enrlloment/settings/training-template/model/TrainingTemplateSelfEnrollmentSettings.model';
import { ExamTemplateModel } from '@exam-template-models/exam-template.model';
import { ModuleTemplateModel } from '@module-template-models/module-template.model';
import { TrainingCategoryModel } from '@training-category-models/training-category.model';
import { TrainingTypeModel } from '@training-type-models/training-type.model';

export class TrainingTemplateModel extends DragOrderModel {
  public description: string = '';
  public code: string = '';
  public format: StandardEnumModel = null;
  public trainingType: TrainingTypeModel = null;
  public examTemplate: ExamTemplateModel = null;
  public trainingCategory: TrainingCategoryModel = new TrainingCategoryModel();
  public certificateTemplates: Array<CertificateTemplateModel> = [];
  public trainingModuleTemplates: Array<ModuleTemplateModel> = [];
  public minBreakTraining: number = 0;
  public maxBreakTraining: number = 0;
  public trainingTemplateSelfEnrollmentSettings: TrainingTemplateSelfEnrollmentSettingsModel =
    new TrainingTemplateSelfEnrollmentSettingsModel();

  public moduleCount: number = 0;

  public color: string = '';
  public templateStatus: StandardEnumModel = null;
  public mainTrainerCategories: Array<StandardNameIdModel> = [];
  public mainTrainers: Array<StandardNameIdModel> = [];
  public linearTrainerCategories: Array<StandardNameIdModel> = [];
  public linearTrainers: Array<StandardNameIdModel> = [];

  checkTrainingTemplateHasModule(): boolean {
    return this.trainingModuleTemplates.filter(module => !module.isDeleted).length > 0;
  }
}
