import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';

@Component({
  selector: 'app-trainee-cart-detail-table',
  templateUrl: './trainee-cart-detail-table.component.html',
  styleUrls: ['./trainee-cart-detail-table.component.scss'],
  standalone: false,
})
export class TraineeCartDetailTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  public selectedTrainingTemplate: TrainingTemplateModel = null;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'personalNumber',
      colTitleLocKey: 'personPersonalNumberColTable',
      modelPropertyPath: ['person', 'personalNumber'],
    },
    {
      colDef: 'fullNameEn',
      colTitleLocKey: 'personFullNameEnColTable',
      modelPropertyPath: ['person', 'fullNameEn'],
    },
    {
      colDef: 'certificateStatus',
      colTitleLocKey: 'traineeCartDetailCertificateStatusColTable',
      modelPropertyPath: ['certificateVisualInfo', 'filterValue'],
    },
    {
      colDef: 'dateOfExpire',
      colTitleLocKey: 'traineeCartDetailCertificateExpireDateColTable',
      modelPropertyPath: ['certificate', 'dateOfExpire'],
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'plannedTraining',
      colTitleLocKey: 'traineeCartDetailCertificatePlannedTrainingDateColTable',
      modelPropertyPath: ['plannedTraining', 'startDate'],
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
  ];

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.table.loading = false;
  }

  getTrainingUrl(sessionCode: string): string {
    return `${location.origin}/#/gant/training/${sessionCode}`;
  }

  setSelectedTrainingTemplate(trainingTemplate: TrainingTemplateModel): void {
    this.selectedTrainingTemplate = trainingTemplate;
  }
}
