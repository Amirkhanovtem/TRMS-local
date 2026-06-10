import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonService } from '@common-services/common.service';
import { Config } from '@config/config';
import { Localization } from '@localization/localization';
import { PersonModel } from '@person-models/person.model';
import { PersonTeamOrSupervisorRequestModel } from '@person-models/person-team-or-supervisor-request.model';
import { durationInMonths } from '@progress/kendo-date-math';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonService extends CommonService {
  private url: string = `${Config.MAIN_API_URL}/persons`;
  private enumUrl: string = Config.MAIN_API_ENUM_URL;

  public list(): Observable<Array<PersonModel>> {
    return this.httpClient.get<Array<PersonModel>>(this.url);
  }

  public listForTable(
    personStatus?: string | null,
    subdivisionId?: string | null,
    showSubordinate?: boolean | null,
  ): Observable<Array<PersonModel>> {
    let httpParams: HttpParams = new HttpParams();

    if (personStatus) {
      httpParams = httpParams.set('personStatus', personStatus);
    }

    if (subdivisionId) {
      httpParams = httpParams.set('subdivisionId', subdivisionId);
    }

    if (showSubordinate) {
      httpParams = httpParams.set('showSubordinate', showSubordinate);
    }

    return this.httpClient.get<Array<PersonModel>>(`${this.url}/for-table`, { params: httpParams });
  }

  public delete(listIdPerson: Array<string>): Observable<any> {
    return this.httpClient.patch(this.url, listIdPerson);
  }

  public create(person: PersonModel): Observable<any> {
    return this.httpClient.post(this.url, person);
  }

  public update(person: PersonModel): Observable<any> {
    return this.httpClient.put(`${this.url}/${person.id}`, person);
  }

  public getPerson(id: string): Observable<PersonModel> {
    return this.httpClient.get<PersonModel>(`${this.url}/${id}`);
  }

  public getAllPersonStatus(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allPersonStatuses`);
  }

  public getAllPersonnelType(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allPersonnelTypes`);
  }

  public getAllPersonLanguages(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allPersonLanguages`);
  }

  public getAllPersonTrmsRoles(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allPersonTrmsRoles`);
  }

  public getAllPersonGenders(): Observable<Array<StandardEnumModel>> {
    return this.httpClient.get<Array<StandardEnumModel>>(`${this.enumUrl}/allPersonGenders`);
  }

  public getAuthPersonDetail(): Observable<PersonModel> {
    return this.httpClient.get<PersonModel>(`${this.url}/currentUser`);
  }

  public getTeam(personId: string, positionId: string): Observable<Array<PersonModel>> {
    const personTeamRequestModel: PersonTeamOrSupervisorRequestModel = new PersonTeamOrSupervisorRequestModel(
      personId,
      positionId,
    );

    return this.httpClient.post<Array<PersonModel>>(`${this.url}/team`, personTeamRequestModel);
  }

  public getSupervisors(personId: string, positionId: string): Observable<Array<PersonModel>> {
    const personSupervisorRequestModel: PersonTeamOrSupervisorRequestModel = new PersonTeamOrSupervisorRequestModel(
      personId,
      positionId,
    );

    return this.httpClient.post<Array<PersonModel>>(`${this.url}/supervisors`, personSupervisorRequestModel);
  }

  public calcExperience(person: PersonModel, localization: Localization): string {
    const employmentDate: Date = person.employmentDate,
      terminationDate: Date = person.terminationDate;
    let monthsCount = 0;

    if (employmentDate) {
      const start = new Date(employmentDate),
        end = terminationDate ? new Date(terminationDate) : new Date();

      monthsCount = durationInMonths(start, end);

      if (start.getDate() > end.getDate() && monthsCount > 0) monthsCount -= 1;

      return PersonService.getExperienceTextMessage(monthsCount, localization);
    } else {
      return PersonService.getExperienceTextMessage(monthsCount, localization);
    }
  }

  private static getExperienceTextMessage(monthsCount: number, localization: Localization): string {
    const year = monthsCount > 0 ? Math.floor(monthsCount / 12) : 0,
      month = monthsCount > 0 ? monthsCount % 12 : 0;

    const templateTextMap = new Map<string, string>([
      ['year', year.toString()],
      ['month', month.toString()],
    ]);

    return localization.getLocalFormattedTextFromKey('personExperienceText', templateTextMap);
  }

  public getAllPersonsUnattachedTrainer(): Observable<Array<PersonModel>> {
    return this.httpClient.get<Array<PersonModel>>(`${this.url}/full-name-person-unattached-trainer`);
  }

  public getFullName(person: PersonModel): string {
    return `${person.lastName} ${person.firstName} ${person.patronymic}`;
  }
}
