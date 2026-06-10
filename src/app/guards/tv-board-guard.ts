import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Role } from '@config/role';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class TvBoardGuard {
  constructor(
    private router: Router,
    private keycloakService: KeycloakService,
  ) {}

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.checkIsTvBoardUser();
  }

  public async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.checkIsTvBoardUser();
  }

  private async checkIsTvBoardUser(): Promise<boolean> {
    const userRoles: Array<string> = this.keycloakService.getUserRoles();
    this.checkRole(userRoles);
    return true;
  }

  private checkRole(userRoles: Array<string>): void {
    if (userRoles?.length === 1 && userRoles.includes(Role.TV_BOARD)) {
      this.router.navigate(['/tv-board']);
    }
  }
}
