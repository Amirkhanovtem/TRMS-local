import { Component, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CreateUpdateCertificateTemplateGroupModalComponent } from '@components/dictionaries/certificate-group/certificate-template-group/modals/create-update/create-update-certificate-template-group-modal/create-update-certificate-template-group-modal.component';
import { CertificateTemplateGroupModel } from '@components/dictionaries/certificate-group/certificate-template-group/models/certificate-template-group.model';
import { CertificateTemplateGroupService } from '@components/dictionaries/certificate-group/certificate-template-group/services/certificate-template-group.service';

@Component({
  selector: 'app-certificate-template-group-child-table',
  templateUrl: './certificate-template-group-child-table.component.html',
  styleUrls: ['./certificate-template-group-child-table.component.scss'],
  standalone: false,
})
export class CertificateTemplateGroupChildTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'certificateTemplateGroupNameColTable',
    },
    {
      colDef: 'code',
      colTitleLocKey: 'certificateTemplateGroupCodeColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'certificateTemplateGroupDescriptionColTable',
    },
    {
      colDef: 'actions',
      colTitleLocKey: 'actions',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
  ];

  constructor(
    public certificateTemplateGroupService: CertificateTemplateGroupService,
    private injector: Injector,
  ) {
    super(injector);
  }

  updateCertificateTemplateGroupDataSource(data): void {
    this.table.commonLoadTableHandler(data);
  }

  certificateTemplateGroupOpenViewModal(certificateTemplateGroup: CertificateTemplateGroupModel): void {
    this.newModal.open(CreateUpdateCertificateTemplateGroupModalComponent, {
      data: {
        model: certificateTemplateGroup,
        isView: true,
      },
    });
  }
}
