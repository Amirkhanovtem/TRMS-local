import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CreateUpdateTrainingTypeModalComponent } from '@training-type-modals-create-update/create-update-training-type-modal.component';
import { TrainingTypeService } from '@training-type-services/training-type.service';

@Component({
  selector: 'app-training-type',
  templateUrl: './training-type.component.html',
  styleUrls: ['./training-type.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class TrainingTypeComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateTrainingTypeModalComponent> =
    CreateUpdateTrainingTypeModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'trainingTypeNameColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'trainingTypeDescriptionColTable',
    },
  ];

  constructor(
    public trainingTypeService: TrainingTypeService,
    private modal: MatDialog,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadTrainingTypes();
  }

  public loadTrainingTypes(): void {
    this.table.loading = true;

    this.trainingTypeService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }
}
