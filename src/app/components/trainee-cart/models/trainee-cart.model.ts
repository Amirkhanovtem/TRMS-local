import { TraineeCartCertificateVisualInfoModel } from '@components/trainee-cart/models/trainee-cart-certificate-visual-info.model';
import { PersonModel } from '@person-models/person.model';

export class TraineeCartModel {
  public person: PersonModel;
  public certificateByTrainingTemplateMap: Object;
  public certificateVisualInfoByTrainingTemplateMap: Map<string, TraineeCartCertificateVisualInfoModel>;
}
