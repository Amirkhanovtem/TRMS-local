import { TraineeCartCertificateStateEnum } from '@components/trainee-cart/models/trainee-cart-certificate-state.enum';

export interface TraineeCartCertificateVisualInfoModel {
  cellValue: string;
  filterValue: string;
  state: TraineeCartCertificateStateEnum;
}
