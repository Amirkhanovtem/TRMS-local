import { Component, Injector, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CreateUpdateSyllabusTemplateComponent } from '@syllabus-template-modals-create-update/create-update-syllabus-template.component';
import { SyllabusTemplateModel } from '@syllabus-template-models/syllabus-template.model';
import { SyllabusTemplateService } from '@syllabus-template-services/syllabus-template.service';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';

@Component({
  selector: 'app-training-template-syllabus-template-table',
  templateUrl: './training-template-syllabus-template-table.component.html',
  styleUrls: ['./training-template-syllabus-template-table.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class TrainingTemplateSyllabusTemplateTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() trainingTemplate: TrainingTemplateModel = new TrainingTemplateModel();
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'syllabusTemplateNameColTable',
    },
  ];

  constructor(
    private syllabusTemplateService: SyllabusTemplateService,
    private injector: Injector,
  ) {
    super(injector);
  }

  loadSyllabusTemplates(): void {
    if (this.trainingTemplate.id) {
      this.syllabusTemplateService.listByTrainingTemplateId(this.trainingTemplate.id).subscribe({
        next: data => {
          this.successLoadSyllabusTemplateHandler(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  successLoadSyllabusTemplateHandler(data: Array<SyllabusTemplateModel>): void {
    this.table.commonLoadTableHandler(data);
  }

  openViewSyllabusTemplateModal(syllabusTemplate: SyllabusTemplateModel): void {
    this.newModal.open(CreateUpdateSyllabusTemplateComponent, {
      data: {
        model: syllabusTemplate,
        isView: true,
      },
    });
  }

  updateSyllabusTemplateDataSource(): void {
    this.loadSyllabusTemplates();
  }
}
