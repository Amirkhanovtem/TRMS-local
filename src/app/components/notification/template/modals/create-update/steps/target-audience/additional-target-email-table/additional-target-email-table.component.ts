import { Component, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CreateUpdateNotificationTemplateModalComponent } from '@notification-template-modals-create-update/create-update-notification-template-modal.component';
import { AdditionalTargetEmailModel } from '@notification-template-modals-create-update-steps-target-audience-add-target-email-table-models/additional-target-email.model';
import { AdditionalEmailType } from '@notification-template-models-enums/additional-email-type.enum';

@Component({
  selector: 'app-additional-email',
  templateUrl: './additional-target-email-table.component.html',
  styleUrls: ['./additional-target-email-table.component.scss', '../../../../../../../../../styles.scss'],
  standalone: false,
})
export class AdditionalTargetEmailTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() parent: CreateUpdateNotificationTemplateModalComponent;
  @Input() additionalEmailType: AdditionalEmailType;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'email',
      colTitleLocKey: 'notificationAdditionalEmailMailColTable',
    },
    {
      colDef: 'actions',
      colTitleLocKey: 'actions',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
  ];

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateTableDataSource();
  }

  updateTableDataSource(): void {
    this.table.commonLoadTableHandler(this.getAdditionalTargetEmailsByType());
  }

  public removeEmail(additionalEmail: AdditionalTargetEmailModel): void {
    this.parent.notificationTemplate.additionalTargetEmails =
      this.parent.notificationTemplate.additionalTargetEmails.filter(additionalTargetEmail => {
        return additionalTargetEmail.id !== additionalEmail.id;
      });

    this.updateTableDataSource();
  }

  getAdditionalTargetEmailsByType(): Array<AdditionalTargetEmailModel> {
    return this.parent.notificationTemplate.additionalTargetEmails?.filter(ate => {
      return ate.type === this.additionalEmailType;
    });
  }
}
