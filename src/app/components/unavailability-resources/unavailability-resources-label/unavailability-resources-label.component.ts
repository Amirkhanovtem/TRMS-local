import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CreateUpdateUnavailabilityResourcesLabelModalComponent } from '@unavailability-resources-label-modals/create-update/create-update-unavailability-resources-label-modal/create-update-unavailability-resources-label-modal.component';
import { UnavailabilityResourcesLabelService } from '@unavailability-resources-label-services/unavailability-resources-label.service';

@Component({
  selector: 'app-unavailability-resources-type',
  templateUrl: './unavailability-resources-label.component.html',
  styleUrls: ['./unavailability-resources-label.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class UnavailabilityResourcesLabelComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  public createUpdateComponent: ComponentType<CreateUpdateUnavailabilityResourcesLabelModalComponent> =
    CreateUpdateUnavailabilityResourcesLabelModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'resourceUnavailabilityLabelNameColTable',
    },
    {
      colDef: 'groupResource',
      colTitleLocKey: 'resourceUnavailabilityLabelGroupResourceColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'color',
      colTitleLocKey: 'resourceUnavailabilityLabelColorColTable',
      offFilter: true,
    },
  ];

  constructor(
    public unavailabilityResourcesLabelService: UnavailabilityResourcesLabelService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadUnavailabilityResourcesTypes();
  }

  public loadUnavailabilityResourcesTypes(): void {
    this.table.loading = true;

    this.unavailabilityResourcesLabelService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }
}
