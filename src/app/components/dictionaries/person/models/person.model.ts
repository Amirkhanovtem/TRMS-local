import { CityModel } from '@city-models/city.model';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CompanyModel } from '@company-models/company.model';
import { CostCenterModel } from '@cost-center-models/cost-center.model';
import { PositionModel } from '@position-models/position.model';

export class PersonModel {
  public id: string = '';
  public fullName: string = '';
  public fullNameRu: string = '';
  public fullNameEn: string = '';
  public lastName: string = '';
  public firstName: string = '';
  public patronymic: string = '';
  public email: string = '';
  public username: string = '';
  public placeOfBirth: string = '';
  public experience: string = '';
  public personalNumber: string = '';
  public personGroupId: string = '';

  public employmentDate: Date;
  public terminationDate: Date;
  public dateOfBirth: Date;

  public trmsRole: StandardEnumModel = null;
  public language: StandardEnumModel = null;
  public status: StandardEnumModel = null;
  public gender: StandardEnumModel = null;
  public personnelType: StandardEnumModel = null;

  public subdivision: StandardNameIdModel = null;
  public city: CityModel = null;
  public costCenter: CostCenterModel = null;
  public position: PositionModel = null;
  public company: CompanyModel = null;
}
