import { AfterViewInit, ChangeDetectorRef, Component, Injector } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmModalComponent } from '@common-confirm-modal/confirm-modal.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { CommonResponseService } from '@common-services/common-response.service';
import { CommonSnackBarService } from '@common-services/common-snack-bar.service';
import { DestroyService } from '@common-services/destroy.service';
import { LoadPageComponent } from '@load-page/load-page.component';
import { Localization } from '@localization/localization';
import { KeycloakService } from 'keycloak-angular';

@Component({
  template: '',
  standalone: false,
})
export class CommonComponent implements AfterViewInit {
  public localization: Localization;
  protected keycloakService: KeycloakService;
  public localEnumField: string;
  protected commonSnackBarService: CommonSnackBarService;
  protected commonResponseService: CommonResponseService;
  newModal: MatDialog;
  public cdref: ChangeDetectorRef;
  private openedLoadPage: MatDialogRef<LoadPageComponent>;
  private loadPageIsShowed: boolean = false;
  protected destroyService$: DestroyService;

  protected roles: Array<string> = [];

  constructor(injector: Injector) {
    this.localization = injector.get(Localization);
    this.keycloakService = injector.get(KeycloakService);
    this.commonSnackBarService = injector.get(CommonSnackBarService);
    this.commonResponseService = injector.get(CommonResponseService);
    this.localEnumField = this.localization.getLocalFieldEnumName();
    this.newModal = injector.get(MatDialog);
    this.cdref = injector.get(ChangeDetectorRef);
    this.destroyService$ = injector.get(DestroyService);

    this.getUserRoles();
  }

  ngAfterViewInit(): void {
    this.cdref.detectChanges();
  }

  protected getUserRoles(): void {
    this.roles = this.keycloakService.getUserRoles();
  }

  public currentUserHasSomeRole(checkRoles: Array<string>): boolean {
    return this.roles.some(role => checkRoles.includes(role));
  }

  protected getUser(): any {
    return this.keycloakService.getKeycloakInstance().tokenParsed;
  }

  public getUsernameCurrentUser(): string {
    return this.keycloakService.getUsername();
  }

  public showSnackBarWithMessage(message: string, type?: SnackBarTypeEnum | string, newConfig?: any): void {
    this.commonSnackBarService.showSnackBarWithMessage(message, type, newConfig);
  }

  protected successResponseHandler(messageKey: string): void {
    this.commonResponseService.successResponseHandler(messageKey);

    this.hideLoadPage();
  }

  public errorResponseHandler(error): void {
    this.commonResponseService.errorResponseHandler(error);

    this.hideLoadPage();
  }

  protected showLoadPage(): void {
    this.loadPageIsShowed = true;
    this.openedLoadPage = this.newModal.open(LoadPageComponent, {
      disableClose: true,
      panelClass: 'load-page-spinner-container',
    });
  }

  protected hideLoadPage(): void {
    if (this.loadPageIsShowed) {
      this.loadPageIsShowed = false;
      this.openedLoadPage.close();
    }
  }

  public showConfirmModal(
    message?: string,
    title?: string,
    confirmBtnTitle?: string,
    cancelBtnTitle?: string,
  ): MatDialogRef<ConfirmModalComponent> {
    return this.newModal.open(ConfirmModalComponent, {
      data: {
        title: title,
        message: message,
        confirmBtnTitle: confirmBtnTitle,
        cancelBtnTitle: cancelBtnTitle,
      },
    });
  }

  compareWithFn(item1, item2): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }
}
