import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import { CommonComponent } from '@common-components/common.component';
import { Config } from '@config/config';
import { Role } from '@config/role';
import { ResponsiveService } from '@services/responsive.service';
import { CreateUpdateUnavailabilityResourcePeriodComponent } from '@unavailability-resources-period-modals/create-update/create-update-unavailability-resource-period/create-update-unavailability-resource-period.component';
import { APP_SUB_PATH, getBasePath } from '@utils/base-path';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false,
})
export class NavbarComponent extends CommonComponent implements OnDestroy, OnInit {
  isMobileView: boolean = false;
  mobileMenuOpen: boolean = false;
  hideHeader: boolean = false;
  private mobileSubscription: Subscription;

  constructor(
    private modal: MatDialog,
    private responsiveService: ResponsiveService,
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.hideHeader = getBasePath() === APP_SUB_PATH;

    this.mobileSubscription = this.responsiveService.isMobile$.subscribe(isMobile => {
      this.isMobileView = isMobile;
      if (!isMobile) {
        this.mobileMenuOpen = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.mobileSubscription) {
      this.mobileSubscription.unsubscribe();
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  getMatMenuTriggerClass(matMenu: MatMenu): string {
    return matMenu._allItems?.some(item => item['_elementRef']['nativeElement'].className.includes('active-link'))
      ? 'active-link'
      : '';
  }

  openCreateUnavailabilityResourceModal(): void {
    this.modal.open(CreateUpdateUnavailabilityResourcePeriodComponent);
  }

  hasRoleForDictionary(): boolean {
    const allowedRoles = [Role.ADMIN, Role.PLANER, Role.SENIOR_PLANER, Role.TRAINER];

    return this.currentUserHasSomeRole(allowedRoles);
  }

  hasRoleForCalendar(): boolean {
    const allowedRoles = [Role.CALENDAR_VIEWER, Role.TRAINER, Role.SENIOR_PLANER, Role.PLANER, Role.ADMIN];

    return this.currentUserHasSomeRole(allowedRoles);
  }

  hasRoleForProfile(): boolean {
    const allowedRoles = [Role.ADMIN, Role.PLANER, Role.SENIOR_PLANER, Role.TRAINER];

    return this.currentUserHasSomeRole(allowedRoles);
  }

  hasRoleForReports(): boolean {
    const allowedRoles = [Role.ADMIN, Role.SENIOR_PLANER, Role.PLANER, Role.TRAINER, Role.POWER_USER];

    return this.currentUserHasSomeRole(allowedRoles);
  }

  hasRoleForCertificateIssue(): boolean {
    const allowedRoles = [Role.ADMIN, Role.SENIOR_PLANER, Role.PLANER, Role.TRAINER];

    return this.currentUserHasSomeRole(allowedRoles);
  }

  hasRoleForPlanerPanel(): boolean {
    const allowedRoles = [Role.ADMIN, Role.PLANER, Role.SENIOR_PLANER];

    return this.currentUserHasSomeRole(allowedRoles);
  }

  hasRoleForAdminPanel(): boolean {
    const allowedRoles = [Role.ADMIN];

    return this.currentUserHasSomeRole(allowedRoles);
  }

  swaggerRedirect(): void {
    window.open(Config.SWAGGER_URL, '_blank');
  }
}
