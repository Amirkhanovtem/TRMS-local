import { SelectionModel } from '@angular/cdk/collections';
import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, Input, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { Role } from '@config/role';
import { CrudBtnsComponent } from '@dictionaries-common-crud-btns/crud-btns.component';
import { CreateUpdateNotificationTemplateModalComponent } from '@notification-template-modals-create-update/create-update-notification-template-modal.component';
import { NotificationTemplateSelectionTableComponent } from '@notification-template-modals-selection/notification-template-selection-table.component';
import { NotificationTemplateTableModel } from '@notification-template-modals-selection-models/notification-template-table.model';
import { NotificationTemplateStatusEnum } from '@notification-template-models-enums/notification-template-status.enum';
import { NotificationTemplateService } from '@notification-template-services/notification-template.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification-template',
  templateUrl: './notification-template.component.html',
  styleUrls: ['./notification-template.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class NotificationTemplateComponent extends CommonComponent {
  @ViewChild(NotificationTemplateSelectionTableComponent)
  notificationTemplateSelectionTableComponent: NotificationTemplateSelectionTableComponent;
  @ViewChild(CrudBtnsComponent) crudBtnsComponent: CrudBtnsComponent;
  @Input() public dataSourceObs: Observable<Array<NotificationTemplateTableModel>> =
    this.notificationTemplateService.list();
  @Input() title: string = 'notificationTemplatePageTitle';

  public createUpdateComponent: ComponentType<CreateUpdateNotificationTemplateModalComponent> =
    CreateUpdateNotificationTemplateModalComponent;
  public selection: SelectionModel<NotificationTemplateTableModel> =
    new SelectionModel<NotificationTemplateTableModel>();

  constructor(
    public notificationTemplateService: NotificationTemplateService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.selection = this.notificationTemplateSelectionTableComponent?.table?.selection;
    this.crudBtnsComponent.deleteConfirmMessage = this.localization.getLocalTextFromKey(
      'notificationTemplateDeleteConfirmMessage',
    );
  }

  loadNotificationTemplates() {
    this.notificationTemplateSelectionTableComponent.loadDataSource();
  }

  public getMapCheckCrudBtnShowFuncMap(): Map<string, (btnName: string) => boolean> {
    const checkCreateEditViewBtnsShowFunc = (btnName: string): boolean => {
      return this.currentUserHasSomeRole([Role.ADMIN, Role.SENIOR_PLANER, Role.PLANER]);
    };

    const checkDeleteBtnShowFunc = (btnName: string): boolean => {
      return this.currentUserHasSomeRole([Role.ADMIN]);
    };

    return new Map<string, (btnName: string) => boolean>([
      ['create', checkCreateEditViewBtnsShowFunc],
      ['edit', checkCreateEditViewBtnsShowFunc],
      ['delete', checkDeleteBtnShowFunc],
      ['view', checkCreateEditViewBtnsShowFunc],
    ]);
  }

  checkBtnEnable(btnName: string): boolean {
    let availableRoles: Array<string> = [];

    switch (btnName) {
      case 'activate':
      case 'deactivate': {
        availableRoles = [Role.ADMIN];
        break;
      }
    }

    return this.roles.some(role => availableRoles.includes(role));
  }

  isActivateBtnDisable(): boolean {
    return (
      !this.selection?.hasValue() ||
      this.selection.selected.some(
        notificationTemplate => notificationTemplate.status.id == NotificationTemplateStatusEnum.ACTIVE,
      )
    );
  }

  isDeactivateBtnDisable(): boolean {
    return (
      !this.selection?.hasValue() ||
      this.selection.selected.some(
        notificationTemplate => notificationTemplate.status.id == NotificationTemplateStatusEnum.NOT_ACTIVE,
      )
    );
  }

  changeNotificationTemplateActiveStatus(isActive: boolean): void {
    const notificationTemplateIds: Array<string> = this.selection.selected.map(
      notificationTemplate => notificationTemplate.id,
    );

    if (!isActive) {
      this.showConfirmModal(this.localization.getLocalTextFromKey('notificationTemplateDeactivateConfirmMessage'))
        .afterClosed()
        .subscribe(result => {
          if (result) {
            this.sendRequestOnChangeActiveStatus(notificationTemplateIds, isActive);
          }
        });
    } else {
      this.sendRequestOnChangeActiveStatus(notificationTemplateIds, isActive);
    }
  }

  sendRequestOnChangeActiveStatus(notificationTemplateIds: Array<string>, isActive: boolean) {
    this.notificationTemplateService.changeNotificationTemplatesStatus(notificationTemplateIds, isActive).subscribe({
      next: data => {
        this.notificationTemplateSelectionTableComponent.loadDataSource();
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }
}
