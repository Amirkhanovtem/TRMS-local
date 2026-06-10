import { Injectable } from '@angular/core';
import { CommonService } from '@common-services/common.service';
import { CompanyModel } from '@company-models/company.model';
import { Config } from '@config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/companies`;

  public list(): Observable<Array<CompanyModel>> {
    return this.httpClient.get<Array<CompanyModel>>(this.url);
  }

  public delete(listIdCompany: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdCompany);
  }

  public create(company: CompanyModel): Observable<any> {
    return this.httpClient.post(this.url, company);
  }

  public update(company: CompanyModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${company.id}`, company);
  }

  public getCompany(id: string): Observable<CompanyModel> {
    return this.httpClient.get<CompanyModel>(`${this.url}/${id}`);
  }
}
