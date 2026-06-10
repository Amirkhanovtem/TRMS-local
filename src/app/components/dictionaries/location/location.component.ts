import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CreateUpdateLocationModalComponent } from '@location-modals-create-update/create-update-location-modal.component';
import { LocationService } from '@location-services/location.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class LocationComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateLocationModalComponent> = CreateUpdateLocationModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'locationNameColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'locationDescriptionColTable',
    },
    {
      colDef: 'address',
      colTitleLocKey: 'locationAddressColTable',
    },
    {
      colDef: 'city',
      colTitleLocKey: 'locationCityColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
  ];

  constructor(
    public locationService: LocationService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadLocations();
  }

  public loadLocations(): void {
    this.table.loading = true;

    this.locationService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }
}
