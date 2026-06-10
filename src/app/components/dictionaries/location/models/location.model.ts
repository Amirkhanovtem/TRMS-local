import { CityModel } from '@city-models/city.model';

export class LocationModel {
  public id: string = '';
  public name: string = '';
  public address: string = '';
  public description: string = '';
  public city: CityModel = new CityModel();
}
