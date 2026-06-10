import { Component, Inject, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { AuditModalComponent } from '@components/audit/audit/modals/audit-modal/audit-modal.component';
import { AuditInfoService } from '@components/audit/audit-info/services/audit-info.service';
import { isUUID } from '@components/common/functions/uuid.functions';

@Component({
  selector: 'app-audit-info-modal',
  templateUrl: './audit-info-modal.component.html',
  styleUrls: ['./audit-info-modal.component.scss'],
  standalone: false,
})
export class AuditInfoModalComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'columnName',
      colTitleLocKey: 'auditInfoModalTableColumnNameCol',
    },
    {
      colDef: 'valueOld',
      colTitleLocKey: 'auditInfoModalTableValueOldCol',
    },
    {
      colDef: 'valueNew',
      colTitleLocKey: 'auditInfoModalTableValueNewCol',
    },
  ];

  constructor(
    private auditInfoService: AuditInfoService,
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      auditId: string;
    },
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    this.loadAudit();
    this.modalComponent.changeCloseWithoutConfirmField(true);
    super.ngAfterViewInit();
  }

  private loadAudit(): void {
    this.table.loading = true;

    this.auditInfoService.getAuditInfosByEntityId(this.dialogParams?.auditId).subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  isRefEntity(value: string): boolean {
    return isUUID(value);
  }

  openAuditForRefEntity(entityId: string): void {
    this.newModal.open(AuditModalComponent, {
      data: {
        entityId: entityId,
      },
    });
  }
}
