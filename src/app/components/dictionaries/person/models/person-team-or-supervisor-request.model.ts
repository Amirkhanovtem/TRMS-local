export class PersonTeamOrSupervisorRequestModel {
  public personId: string;
  public positionId: string;

  constructor(personId: string, positionId: string) {
    this.personId = personId;
    this.positionId = positionId;
  }
}
