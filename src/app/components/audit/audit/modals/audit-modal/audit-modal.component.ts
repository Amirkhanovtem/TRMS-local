import { Component, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { AuditModel } from '@components/audit/audit/models/audit.model';
import { AuditService } from '@components/audit/audit/services/audit.service';
import { AuditInfoModalComponent } from '@components/audit/audit-info/modals/audit-info-modal/audit-info-modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-audit-modal',
  templateUrl: './audit-modal.component.html',
  styleUrls: ['./audit-modal.component.scss'],
  standalone: false,
})
export class AuditModalComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'author',
      colTitleLocKey: 'auditModalTableAuthorCol',
    },
    {
      colDef: 'srcTable',
      colTitleLocKey: 'auditModalTableTableCol',
    },
    {
      colDef: 'version',
      colTitleLocKey: 'auditModalTableVersionCol',
    },
    {
      colDef: 'timestamp',
      colTitleLocKey: 'auditModalTableDateCol',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'action',
      colTitleLocKey: 'auditModalTableActionCol',
    },
  ];

  constructor(
    private auditService: AuditService,
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public dialogParams: {
      entityId: string;
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
    const auditObs: Observable<Array<AuditModel>> = this.dialogParams?.entityId
      ? this.auditService.getAuditsByEntityId(this.dialogParams?.entityId)
      : this.auditService.getAllAudits();

    auditObs.subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  public openAuditInfoModal(audit: AuditModel): void {
    this.newModal.open(AuditInfoModalComponent, {
      data: {
        auditId: audit.id,
      },
    });
  }
}
