import { Component, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { AimsIntegrationInfoDetailModalComponent } from '@components/integration/aims/aims-integration-info/modals/aims-integration-info-detail-modal/aims-integration-info-detail-modal.component';
import { AimsIntegrationService } from '@components/integration/aims/service/aims-integration.service';

@Component({
  selector: 'app-aims-integration-info',
  templateUrl: './aims-integration-info.component.html',
  styleUrls: ['./aims-integration-info.component.scss'],
  standalone: false,
})
export class AimsIntegrationInfoComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'startDate',
      colTitleLocKey: 'aimsIntegrationInfoStartDateColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'endDate',
      colTitleLocKey: 'aimsIntegrationInfoEndDateColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'status',
      colTitleLocKey: 'aimsIntegrationInfoStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'detailInfo',
      colTitleLocKey: 'aimsIntegrationInfoDetailColTable',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
    {
      colDef: 'file',
      colTitleLocKey: 'aimsIntegrationInfoFileColTable',
      modelPropertyPath: ['fileStorage', 'name'],
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
  ];

  constructor(
    injector: Injector,
    private aimsIntegrationService: AimsIntegrationService,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadAimsIntegrationInfo();
  }

  public loadAimsIntegrationInfo(): void {
    this.table.loading = true;

    this.aimsIntegrationService.getAllAimsIntegrationInfo().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  loadAttachedFile(fileStorage: StandardFileStorageModel, $event): void {
    $event.stopPropagation();

    if (fileStorage) {
      const fileId = fileStorage.id,
        fileName = fileStorage.name;

      this.aimsIntegrationService.loadFileById(fileId, fileName);
    }
  }

  startIntegration(): void {
    this.aimsIntegrationService.startIntegration().subscribe({
      next: data => {
        this.integrationSuccessHandler();
      },
      error: e => {
        this.integrationErrorHandler(e);
      },
    });
  }

  integrationSuccessHandler(): void {
    const message: string = this.localization.getLocalFormattedTextFromKey('aimsIntegrationSuccessMessage');

    this.showSnackBarWithMessage(message, SnackBarTypeEnum.SUCCESS);
    this.loadAimsIntegrationInfo();
  }

  integrationErrorHandler(error): void {
    this.errorResponseHandler(error);
    this.loadAimsIntegrationInfo();
  }

  openAimsIntegrationInfoDetail(integrationInfoId: string): void {
    this.newModal.open(AimsIntegrationInfoDetailModalComponent, {
      data: {
        infoId: integrationInfoId,
      },
    });
  }
}
