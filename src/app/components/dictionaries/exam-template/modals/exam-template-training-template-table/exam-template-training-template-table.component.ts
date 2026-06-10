import { Component, Injector, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { ExamTemplateModel } from '@exam-template-models/exam-template.model';
import { CreateUpdateTrainingTemplateModalComponent } from '@training-template-modals-create-update/create-update-training-template-modal.component';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';
import { TrainingTemplateService } from '@training-template-services/training-template.service';

@Component({
  selector: 'app-exam-template-training-template-table',
  templateUrl: './exam-template-training-template-table.component.html',
  styleUrls: ['./exam-template-training-template-table.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class ExamTemplateTrainingTemplateTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() examTemplate: ExamTemplateModel = new ExamTemplateModel();
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'trainingTemplateNameColTable',
    },
  ];

  constructor(
    private trainingTemplateService: TrainingTemplateService,
    private injector: Injector,
  ) {
    super(injector);
  }

  loadTrainingTemplates(): void {
    if (this.examTemplate.id)
      this.trainingTemplateService.listByExamTemplateId(this.examTemplate.id).subscribe({
        next: data => {
          this.successLoadTrainingTemplateHandler(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
  }

  successLoadTrainingTemplateHandler(data: Array<TrainingTemplateModel>): void {
    this.table.commonLoadTableHandler(data);
  }

  openViewTrainingTemplateModal(trainingTemplate: TrainingTemplateModel): void {
    this.newModal.open(CreateUpdateTrainingTemplateModalComponent, {
      data: {
        model: trainingTemplate,
        isView: true,
      },
    });
  }

  updateTrainingTemplateDataSource(): void {
    this.loadTrainingTemplates();
  }
}
