import { Injectable } from '@angular/core';
import { GanttComponent } from '@gantt/gantt.component';
import { GanttUtilService } from '@gantt-services/gantt-util.service';
import { translate } from '@ngneat/transloco';
import { CreateUpdateUnavailabilityResourcePeriodComponent } from '@unavailability-resources-period-modals/create-update/create-update-unavailability-resource-period/create-update-unavailability-resource-period.component';
import { UnavailabilityResourcePeriodModel } from '@unavailability-resources-period-models/unavailability-resource-period.model';
import { Cit } from 'cit-angular';
import moment, { Moment } from 'moment';
import MenuItemClickArgs = Cit.MenuItemClickArgs;
import MenuShowArgs = Cit.MenuShowArgs;
import MenuItemData = Cit.MenuItemData;
import { MatDialogRef } from '@angular/material/dialog';
import { Role } from '@config/role';

@Injectable({
  providedIn: 'root',
})
export class GanttContextMenuService {
  public ganttComponent: GanttComponent;

  constructor(private ganttUtilService: GanttUtilService) {}

  getUnavailabilityResourceMenuItems = (args: MenuShowArgs): Array<MenuItemData> => {
    const rolesWithPermissionEditUnavailability: Array<Role> = [Role.ADMIN, Role.PLANER, Role.SENIOR_PLANER];

    if (!this.ganttComponent.currentUserHasSomeRole(rolesWithPermissionEditUnavailability)) {
      return [];
    }

    const unavailabilityResourcePeriodInCell: UnavailabilityResourcePeriodModel =
      this.findUnavailabilityResourcePeriodInSelectedCell(args);

    if (!unavailabilityResourcePeriodInCell) {
      return [];
    }

    return [
      {
        text: translate('navBarBtnResourceUnavailability'),
        items: [
          {
            text: translate('editBtn'),
            onClick: (args: MenuItemClickArgs) => {
              this.openUnavailabilityResourcePeriodCreateUpdateModal(unavailabilityResourcePeriodInCell);
            },
          },
          {
            text: translate('viewBtn'),
            onClick: (args: MenuItemClickArgs) => {
              this.openUnavailabilityResourcePeriodCreateUpdateModal(unavailabilityResourcePeriodInCell, true);
            },
          },
        ],
      },
    ];
  };

  findUnavailabilityResourcePeriodInSelectedCell(args: MenuShowArgs): UnavailabilityResourcePeriodModel {
    const resourceId: string = args.source.resource,
      cellStartTime: Moment = moment(args.source.start.value),
      cellEndTime: Moment = moment(args.source.end.value),
      loadedUnavailabilityResourcePeriods: Array<UnavailabilityResourcePeriodModel> =
        this.ganttComponent.unavailabilityResourcePeriods;

    return this.ganttUtilService.findLoadedUnavailabilityResourceByPeriod(
      resourceId,
      cellStartTime,
      cellEndTime,
      loadedUnavailabilityResourcePeriods,
    );
  }

  public getContextMenuSelection(): Cit.Menu {
    return new Cit.Menu({
      onShow: (args: MenuShowArgs) => {
        this.ganttComponent.scheduler.config.contextMenuSelection.items = this.fillContextMenu(args);
      },
    });
  }

  private fillContextMenu(args: MenuShowArgs): Array<MenuItemData> {
    const unavailabilityResourceContextItems: Array<MenuItemData> = this.getUnavailabilityResourceMenuItems(args);

    return unavailabilityResourceContextItems;
  }

  openUnavailabilityResourcePeriodCreateUpdateModal(
    unavailabilityResourcePeriod: UnavailabilityResourcePeriodModel,
    isView?: boolean,
  ): void {
    if (!unavailabilityResourcePeriod) {
      return;
    }

    const modalRef: MatDialogRef<CreateUpdateUnavailabilityResourcePeriodComponent> = this.ganttComponent.newModal.open(
      CreateUpdateUnavailabilityResourcePeriodComponent,
      {
        data: {
          model: unavailabilityResourcePeriod,
          isUpdate: !isView,
          isView: isView,
        },
      },
    );

    this.closeUnavailabilityResourcePeriodCreateUpdateModal(modalRef);
  }

  private closeUnavailabilityResourcePeriodCreateUpdateModal(
    modalRef: MatDialogRef<CreateUpdateUnavailabilityResourcePeriodComponent>,
  ): void {
    modalRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.ganttComponent.ganttLoadService.loadEvents();
        }
      },
      error: e => {
        this.ganttComponent.errorResponseHandler(e);
      },
    });
  }
}
