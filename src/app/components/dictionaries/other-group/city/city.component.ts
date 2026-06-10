import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { CreateUpdateCityModalComponent } from '@city-modals-create-update/create-update-city-modal.component';
import { CityService } from '@city-services/city.service';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class CityComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateCityModalComponent> = CreateUpdateCityModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'nameRu',
      colTitleLocKey: 'cityNameRuColTable',
    },
    {
      colDef: 'nameKz',
      colTitleLocKey: 'cityNameKzColTable',
    },
    {
      colDef: 'nameEn',
      colTitleLocKey: 'cityNameEnColTable',
    },
    {
      colDef: 'code',
      colTitleLocKey: 'cityCodeColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'cityDescriptionColTable',
    },
  ];

  constructor(
    public cityService: CityService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadCities();
  }

  public loadCities(): void {
    this.table.loading = true;

    this.cityService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }
}
