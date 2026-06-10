import { Component, Injector, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { TrainingSummaryService } from '@components/training-summary/services/training-summary.service';
import { ParentEventModel } from '@event-models/parent-event.model';
import { CreateUpdateSyllabusModalComponent } from '@event-syllabus-modals-create-update/create-update-syllabus-modal.component';
import { CreateUpdateTrainingModalComponent } from '@event-training-modals-create-update/create-update-training-modal.component';
import { EventParentTypeEnum } from '@gantt-models/event-parent-type.enum';
import { ComponentType } from 'ngx-toastr';

@Component({
  selector: 'app-trainer-training-table',
  templateUrl: './trainer-training-table.component.html',
  styleUrls: ['./trainer-training-table.component.scss', '../../../../../../../../../styles.scss'],
  standalone: false,
})
export class TrainerTrainingTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() trainerId: string;

  constructor(
    injector: Injector,
    private trainingSummaryService: TrainingSummaryService,
  ) {
    super(injector);
  }

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'trainingTemplateName',
      colTitleLocKey: 'trainerTrainingTableTrainingTemplateCol',
    },
    {
      colDef: 'modules',
      colTitleLocKey: 'trainerTrainingTableModulesCol',
    },
    {
      colDef: 'role',
      colTitleLocKey: 'trainerTrainingTableRoleCol',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'startDateTraining',
      colTitleLocKey: 'trainerTrainingTableTrainingStartDateCol',
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'endDateTraining',
      colTitleLocKey: 'trainerTrainingTableTrainingEndDateCol',
      colType: DisplayedColumnTypeEnum.DATE,
    },
    {
      colDef: 'trainingFactualStatus',
      colTitleLocKey: 'trainerTrainingTableTrainingFactualStatusCol',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'parentEvent',
      colTitleLocKey: 'trainerTrainingTableOpenParentEventCol',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
  ];

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.loadTrainerTrainingTable();
  }

  public loadTrainerTrainingTable(): void {
    if (!this.trainerId) {
      return;
    }

    this.trainingSummaryService.getTrainingsSummaryByTrainerId(this.trainerId).subscribe({
      next: data => this.table.commonLoadTableHandler(data),
      error: e => this.table.errorResponseHandler(e),
    });
  }

  public openParentEvent(parentEvent: ParentEventModel, $event): void {
    $event.stopPropagation();

    if (!parentEvent) {
      return;
    }

    let component: ComponentType<CreateUpdateTrainingModalComponent | CreateUpdateSyllabusModalComponent>;

    switch (parentEvent.eventParentType.id) {
      case EventParentTypeEnum.TRAINING: {
        component = CreateUpdateTrainingModalComponent;
        break;
      }
      case EventParentTypeEnum.SYLLABUS: {
        component = CreateUpdateSyllabusModalComponent;
        break;
      }
    }

    this.openNewModalComponent(parentEvent.id, component);
  }

  private openNewModalComponent(
    parentEventId: string,
    component: ComponentType<CreateUpdateTrainingModalComponent | CreateUpdateSyllabusModalComponent>,
  ): void {
    if (!component) {
      return;
    }

    const standardNameIdModel: StandardNameIdModel = new StandardNameIdModel();
    standardNameIdModel.id = parentEventId;

    this.newModal.open(component, {
      data: {
        model: standardNameIdModel,
        isView: true,
      },
    });
  }
}
