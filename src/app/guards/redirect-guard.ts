import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Role } from '@config/role';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class RedirectGuard {
  constructor(
    private router: Router,
    private keycloakService: KeycloakService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const rolesToCalendar: Array<Role> = [
      Role.CALENDAR_VIEWER,
      Role.TRAINER,
      Role.SENIOR_PLANER,
      Role.PLANER,
      Role.ADMIN,
    ];

    if (this.currentUserHasSomeRole(rolesToCalendar)) {
      return this.router.createUrlTree(['/gant']);
    } else {
      return this.router.createUrlTree(['/self-enrollment']);
    }
  }

  private currentUserHasSomeRole(checkRoles: Array<string>): boolean {
    const userRoles: Array<string> = this.keycloakService.getUserRoles();

    return userRoles.some(role => checkRoles.includes(role));
  }
}
