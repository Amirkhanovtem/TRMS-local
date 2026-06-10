import { Component, Inject, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { AimsIntegrationInfoDetailModel } from '@components/integration/aims/aims-integration-info/models/aims-integration-info-detail.model';
import { AimsIntegrationService } from '@components/integration/aims/service/aims-integration.service';

@Component({
  selector: 'app-aims-integration-info-detail-modal',
  templateUrl: './aims-integration-info-detail-modal.component.html',
  styleUrls: ['./aims-integration-info-detail-modal.component.scss'],
  standalone: false,
})
export class AimsIntegrationInfoDetailModalComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'sessionCode',
      colTitleLocKey: 'aimsIntegrationInfoDetailSessionCodeColTable',
    },
    {
      colDef: 'bookingId',
      colTitleLocKey: 'aimsIntegrationInfoDetailBookingIdColTable',
    },
    {
      colDef: 'startDate',
      colTitleLocKey: 'aimsIntegrationInfoDetailStartDateColTable',
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'startTime',
      colTitleLocKey: 'aimsIntegrationInfoDetailStartTimeColTable',
      modelPropertyPath: ['startDate'],
      colType: DisplayedColumnTypeEnum.TIME,
    },
    {
      colDef: 'endTime',
      colTitleLocKey: 'aimsIntegrationInfoDetailEndTimeColTable',
      modelPropertyPath: ['endDate'],
      colType: DisplayedColumnTypeEnum.TIME,
    },
    {
      colDef: 'course',
      colTitleLocKey: 'aimsIntegrationInfoDetailCourseColTable',
    },
    {
      colDef: 'component',
      colTitleLocKey: 'aimsIntegrationInfoDetailComponentColTable',
    },
    {
      colDef: 'employees',
      colTitleLocKey: 'aimsIntegrationInfoDetailEmployeesColTable',
    },
    {
      colDef: 'status',
      colTitleLocKey: 'aimsIntegrationInfoDetailStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'message',
      colTitleLocKey: 'aimsIntegrationInfoDetailMessageColTable',
    },
  ];

  constructor(
    injector: Injector,
    private aimsIntegrationService: AimsIntegrationService,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      infoId: string;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    this.loadAimsIntegrationInfoDetail();
    this.modalComponent.changeCloseWithoutConfirmField(true);
  }

  getTrainingUrl(infoDetail: AimsIntegrationInfoDetailModel): string {
    return `${location.origin}/#/gant/training/${infoDetail.sessionCode}`;
  }

  private loadAimsIntegrationInfoDetail(): void {
    this.table.loading = true;

    this.aimsIntegrationService.getAimsIntegrationInfoDetail(this.dialogParams?.infoId).subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }
}
