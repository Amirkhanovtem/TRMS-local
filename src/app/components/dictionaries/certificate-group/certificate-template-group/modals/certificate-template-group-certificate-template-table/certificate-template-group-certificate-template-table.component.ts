import { Component, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CertificateTemplateSelectionModalComponent } from '@certificate-template-modals/selection/certificate-template-selection-modal/certificate-template-selection-modal.component';
import { CreateUpdateCertificateTemplateModalComponent } from '@certificate-template-modals-create-update/create-update-certificate-template-modal.component';
import { CertificateTemplateModel } from '@certificate-template-models/certificate-template.model';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CertificateTemplateGroupModel } from '@components/dictionaries/certificate-group/certificate-template-group/models/certificate-template-group.model';

@Component({
  selector: 'app-certificate-template-group-certificate-template-table',
  templateUrl: './certificate-template-group-certificate-template-table.component.html',
  styleUrls: ['./certificate-template-group-certificate-template-table.component.scss'],
  standalone: false,
})
export class CertificateTemplateGroupCertificateTemplateTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() certificateTemplateGroup: CertificateTemplateGroupModel = new CertificateTemplateGroupModel();
  @Input() isView: boolean = false;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'certificateTemplateNameColTable',
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
    this.updateCertificateTemplateTableDataSource();
  }

  openCertificateTemplateSelectionModal(): void {
    const modalRef = this.newModal.open(CertificateTemplateSelectionModalComponent, {
      data: {
        selectedCertificateTemplates: this.certificateTemplateGroup?.certificateTemplates ?? [],
      },
    });

    this.closeModalHandler(modalRef);
  }

  closeModalHandler(modalRef: MatDialogRef<CertificateTemplateSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        this.certificateTemplateGroup.certificateTemplates = data.selectedCertificateTemplates;
        this.updateCertificateTemplateTableDataSource();
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  updateCertificateTemplateTableDataSource(): void {
    this.table.commonLoadTableHandler(this.certificateTemplateGroup.certificateTemplates);
  }

  removeCertificateTemplateTemplateFromList(targetCertificateTemplateTemplate: CertificateTemplateModel): void {
    this.certificateTemplateGroup.certificateTemplates = this.certificateTemplateGroup.certificateTemplates.filter(
      certificateTemplate => certificateTemplate.id !== targetCertificateTemplateTemplate.id,
    );

    this.updateCertificateTemplateTableDataSource();
  }

  openCertificateTemplateViewModal(certificateTemplate: CertificateTemplateModel): void {
    this.newModal.open(CreateUpdateCertificateTemplateModalComponent, {
      data: {
        model: certificateTemplate,
        isView: true,
      },
    });
  }
}
