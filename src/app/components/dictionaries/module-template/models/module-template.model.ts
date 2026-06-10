import { DragOrderModel } from '@common-drag-order-modal-models/drag-order.model';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';

export class ModuleTemplateModel extends DragOrderModel {
  public description: string = '';
  public format: StandardEnumModel = new StandardEnumModel();
  public duration: number = 0;
  public breakTime: number = 0;
  public breakAfterModuleMin: number = 0;
  public breakAfterModuleMax: number = 0;
  public minimalTrainersCount: number = 0;
  public trainingTemplate: TrainingTemplateModel = new TrainingTemplateModel();
  public isCreated: boolean = false;
  public isUpdated: boolean = false;
  public isDeleted: boolean = false;
}
