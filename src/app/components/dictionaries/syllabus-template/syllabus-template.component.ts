import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CreateUpdateSyllabusTemplateComponent } from '@syllabus-template-modals-create-update/create-update-syllabus-template.component';
import { SyllabusTemplateService } from '@syllabus-template-services/syllabus-template.service';

@Component({
  selector: 'app-syllabus-template',
  templateUrl: './syllabus-template.component.html',
  styleUrls: ['./syllabus-template.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class SyllabusTemplateComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateSyllabusTemplateComponent> =
    CreateUpdateSyllabusTemplateComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'syllabusTemplateNameColTable',
    },
    {
      colDef: 'code',
      colTitleLocKey: 'syllabusTemplateCodeColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'syllabusTemplateDescriptionColTable',
    },
    {
      colDef: 'syllabusCategory',
      colTitleLocKey: 'syllabusTemplateCategoryColTable',
      modelPropertyPath: ['trainingCategory', 'name'],
    },
    {
      colDef: 'moduleCount',
      colTitleLocKey: 'syllabusTemplateModuleCountColTable',
    },
  ];

  constructor(
    public syllabusTemplateService: SyllabusTemplateService,
    private modal: MatDialog,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadSyllabusTemplates();
  }

  public loadSyllabusTemplates(): void {
    this.table.loading = true;

    this.syllabusTemplateService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }
}
