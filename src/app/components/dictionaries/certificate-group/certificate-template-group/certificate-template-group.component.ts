import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CreateUpdateCertificateTemplateGroupModalComponent } from '@components/dictionaries/certificate-group/certificate-template-group/modals/create-update/create-update-certificate-template-group-modal/create-update-certificate-template-group-modal.component';
import { CertificateTemplateGroupService } from '@components/dictionaries/certificate-group/certificate-template-group/services/certificate-template-group.service';
import { TrainingTemplateCertificateTemplatesPipe } from '@training-template/pipes/training-template-certificate-templates.pipe';

@Component({
  selector: 'app-certificate-template-group',
  templateUrl: './certificate-template-group.component.html',
  styleUrls: ['./certificate-template-group.component.scss'],
  standalone: false,
})
export class CertificateTemplateGroupComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateCertificateTemplateGroupModalComponent> =
    CreateUpdateCertificateTemplateGroupModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
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
      colDef: 'certificateTemplates',
      colTitleLocKey: 'certificateTemplateGroupCertificateTemplatesColTable',
      modelPropertyPath: [],
      colVisualValuePipe: new TrainingTemplateCertificateTemplatesPipe(),
    },
  ];

  constructor(
    public certificateTemplateGroupService: CertificateTemplateGroupService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadCertificateTemplateGroups();
  }

  public loadCertificateTemplateGroups(): void {
    this.table.loading = true;

    this.certificateTemplateGroupService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }
}
