export class AuthorizedUser {
  private _username: string = '';
  private _isLogged: boolean = false;
  private _roles: Array<string> = [];
  private _isUserDataReady: boolean = false;

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get isLogged(): boolean {
    return this._isLogged;
  }

  set isLogged(value: boolean) {
    this._isLogged = value;
  }

  get roles(): Array<string> {
    return this._roles;
  }

  set roles(value: Array<string>) {
    this._roles = value;
  }

  get isUserDataReady(): boolean {
    return this._isUserDataReady;
  }

  set isUserDataReady(value: boolean) {
    this._isUserDataReady = value;
  }
}
