import { Component, Injector, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DragOrderService } from '@common-drag-order-modal-services/drag-order.service';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { SyllabusTemplateModel } from '@syllabus-template-models/syllabus-template.model';
import { CreateUpdateTrainingTemplateModalComponent } from '@training-template-modals-create-update/create-update-training-template-modal.component';
import { TrainingTemplateSelectionModalComponent } from '@training-template-modals-selection/training-template-selection-modal.component';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';

@Component({
  selector: 'app-syllabus-template-training-template-table',
  templateUrl: './syllabus-template-training-template-table.component.html',
  styleUrls: ['./syllabus-template-training-template-table.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class SyllabusTemplateTrainingTemplateTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() syllabusTemplate: SyllabusTemplateModel = new SyllabusTemplateModel();
  @Input() isView: boolean = false;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'trainingTemplateNameColTable',
    },
    {
      colDef: 'minBreakTraining',
      colTitleLocKey: 'trainingTemplateMinBreakColTable',
    },
    {
      colDef: 'maxBreakTraining',
      colTitleLocKey: 'trainingTemplateMaxBreakColTable',
    },
    {
      colDef: 'actions',
      colTitleLocKey: 'actions',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
  ];

  constructor(
    private dragOrderService: DragOrderService,
    private injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateTrainingTemplateDataSource();
  }

  openTrainingTemplateModal(): void {
    const modalRef = this.newModal.open(TrainingTemplateSelectionModalComponent, {
      data: {
        selectedTrainingTemplates: this.syllabusTemplate.trainingTemplates,
      },
    });
    this.closeModalHandler(modalRef);
  }

  closeModalHandler(modalRef: MatDialogRef<TrainingTemplateSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data?.save) {
          this.changeTrainingTemplateDataSource(data.selectedTrainingTemplates);
        }
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  changeTrainingTemplateDataSource(selectedTrainingTemplates: Array<TrainingTemplateModel>) {
    this.setMinMaxBreakTime(this.syllabusTemplate.trainingTemplates, selectedTrainingTemplates);

    this.syllabusTemplate.trainingTemplates = this.dragOrderService.processSettingOrder(
      selectedTrainingTemplates,
      this.syllabusTemplate.trainingTemplates,
    );

    this.updateTrainingTemplateDataSource();
  }

  setMinMaxBreakTime(sources: Array<TrainingTemplateModel>, targets: Array<TrainingTemplateModel>): void {
    targets.forEach(target => {
      let source = sources.find(source => source.id === target.id),
        minBreak = 0,
        maxBreak = 0;

      if (source) {
        minBreak = source.minBreakTraining;
        maxBreak = source.maxBreakTraining;
      }

      target.minBreakTraining = minBreak;
      target.maxBreakTraining = maxBreak;
    });
  }

  updateTrainingTemplateDataSource() {
    this.table.commonLoadTableHandler(this.syllabusTemplate.trainingTemplates);
  }

  trainingTemplateOpenViewModal(trainingTemplate: TrainingTemplateModel) {
    this.newModal.open(CreateUpdateTrainingTemplateModalComponent, {
      data: {
        model: trainingTemplate,
        isView: true,
      },
    });
  }

  removeTrainingTemplateFromList(targetTrainingTemplate: TrainingTemplateModel) {
    const newTrainingList = this.syllabusTemplate.trainingTemplates.filter(
      trainingTemplate => trainingTemplate !== targetTrainingTemplate,
    );

    this.syllabusTemplate.trainingTemplates = this.dragOrderService.processSettingOrder(newTrainingList);

    this.updateTrainingTemplateDataSource();
  }
}
