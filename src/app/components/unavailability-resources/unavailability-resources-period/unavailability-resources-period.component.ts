import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { Role } from '@config/role';
import { CreateUpdateUnavailabilityResourcePeriodComponent } from '@unavailability-resources-period-modals/create-update/create-update-unavailability-resource-period/create-update-unavailability-resource-period.component';
import { UnavailabilityResourcesPeriodService } from '@unavailability-resources-period-services/unavailability-resources-period.service';

@Component({
  selector: 'app-unavailability-resources-period',
  templateUrl: './unavailability-resources-period.component.html',
  styleUrls: ['./unavailability-resources-period.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class UnavailabilityResourcesPeriodComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateUnavailabilityResourcePeriodComponent> =
    CreateUpdateUnavailabilityResourcePeriodComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'resource',
      colTitleLocKey: 'resourceUnavailabilityPeriodResourceColTable',
      modelPropertyPath: ['resource', 'name'],
    },
    {
      colDef: 'groupResource',
      colTitleLocKey: 'resourceUnavailabilityPeriodGroupResourceColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['unavailabilityResourceLabel', 'groupResource', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'unavailabilityResourceLabel',
      colTitleLocKey: 'resourceUnavailabilityPeriodUnavailabilityLabelColTable',
      modelPropertyPath: ['unavailabilityResourceLabel', 'name'],
    },
    {
      colDef: 'startDate',
      colTitleLocKey: 'resourceUnavailabilityPeriodStartColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'endDate',
      colTitleLocKey: 'resourceUnavailabilityPeriodEndColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
  ];

  constructor(
    public unavailabilityResourcesPeriodService: UnavailabilityResourcesPeriodService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadUnavailabilityResourcePeriods();
  }

  public loadUnavailabilityResourcePeriods(): void {
    this.table.loading = true;

    this.unavailabilityResourcesPeriodService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  getMapCheckCrudBtnShowFuncMap(): Map<string, (btnName: string) => boolean> {
    const checkShowFunc = (btnName: string): boolean => {
      return this.currentUserHasSomeRole([Role.ADMIN, Role.SENIOR_PLANER, Role.PLANER]);
    };

    return new Map<string, (btnName: string) => boolean>([
      ['create', checkShowFunc],
      ['edit', checkShowFunc],
      ['delete', checkShowFunc],
    ]);
  }
}
