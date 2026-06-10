import { StandardEnumModel } from '@common-models/standard-enum.model';

export class CertificateDurationSettingsModel {
  public id: string;
  public durationType: StandardEnumModel;
  public expireThrough: number = 0;
  public baseMonthPeriod: number = 0;
  public certainPeriodDelta: number = 0;
}
