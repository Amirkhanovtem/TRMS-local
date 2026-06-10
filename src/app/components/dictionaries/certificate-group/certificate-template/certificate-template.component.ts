import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonComponent } from '@common-components/common.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardFileStorageModel } from '@common-models/standard-file-storage.model';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CreateUpdateCertificateTemplateModalComponent } from '@components/dictionaries/certificate-group/certificate-template/modals/create-update/create-update-certificate-template-modal.component';
import { CertificateTemplateService } from '@components/dictionaries/certificate-group/certificate-template/services/certificate-template.service';
import { Config } from '@config/config';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate-template.component.html',
  styleUrls: ['./certificate-template.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class CertificateTemplateComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  public createUpdateComponent: ComponentType<CreateUpdateCertificateTemplateModalComponent> =
    CreateUpdateCertificateTemplateModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'certificateTemplateNameColTable',
    },
    {
      colDef: 'code',
      colTitleLocKey: 'certificateTemplateCodeColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'certificateTemplateDescriptionColTable',
    },
    {
      colDef: 'expireThrough',
      colTitleLocKey: 'certificateTemplateExpireThroughColTable',
      modelPropertyPath: ['certificateDurationSettings', 'expireThrough'],
    },
    {
      colDef: 'template',
      colTitleLocKey: 'certificateTemplateTemplateColTable',
      modelPropertyPath: ['fileStorage', 'name'],
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'prefixCode',
      colTitleLocKey: 'certificateTemplatePrefixCodeColTable',
    },
    {
      colDef: 'type',
      colTitleLocKey: 'certificateTemplateTypeColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'category',
      colTitleLocKey: 'certificateTemplateCategoryColTable',
      modelPropertyPath: ['trainingCategory', 'name'],
    },
    {
      colDef: 'trainingTemplate',
      colTitleLocKey: 'certificateTemplateTrainingTemplateColTable',
      modelPropertyPath: ['trainingTemplate', 'name'],
    },
  ];

  constructor(
    public certificateTemplateService: CertificateTemplateService,
    private modal: MatDialog,
    private router: Router,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadCertificateTemplates();
  }

  public loadCertificateTemplates(): void {
    this.table.loading = true;

    this.certificateTemplateService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAttachedFile(fileStorage: StandardFileStorageModel, $event): void {
    $event.stopPropagation();
    if (fileStorage) {
      const fileId = fileStorage.id,
        fileName = fileStorage.name;

      this.certificateTemplateService.loadFileById(fileId, fileName);
    }
  }

  getAllowedFileFormats(): string {
    return Config.ALLOWED_WORD_FILE_FORMATS;
  }

  changeCertificateFileByCertificateTemplate(file: File): void {
    const certificateTemplateIds: Array<string> = this.table.selection.selected?.map(
      certificateTemplate => certificateTemplate.id,
    );

    if (certificateTemplateIds?.length > 0) {
      this.certificateTemplateService.updateGeneratedCertificatesFile(certificateTemplateIds, file).subscribe({
        next: data => {
          const message: string = this.localization.getLocalTextFromKey('updateFileGeneratedCertificateSuccessMessage');
          this.showSnackBarWithMessage(message, SnackBarTypeEnum.SUCCESS);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }
}
