import { Component, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { ModuleModel } from '@event-module-models/module.model';
import { CreateUpdateTrainerModalComponent } from '@trainer-modals-create-update/create-update-trainer-modal.component';
import { LinearOrMainTrainerSelectionModalComponent } from '@trainer-modals-selection/linear-or-main-trainer-selection-modal.component';
import { TrainerModel } from '@trainer-models/trainer.model';

@Component({
  selector: 'app-creating-event-linear-trainer-table',
  templateUrl: './creating-event-linear-trainer-table.component.html',
  styleUrls: ['./creating-event-linear-trainer-table.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class CreatingEventLinearTrainerTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() trainingTemplateId: string = null;
  @Input() modules: Array<ModuleModel> = [];
  @Input() isView: boolean = false;
  @Input() tableId: string = '';

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'actions',
      colTitleLocKey: 'actions',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
    {
      colDef: 'fullNameEn',
      colTitleLocKey: 'personFullNameEnColTable',
      modelPropertyPath: ['person', 'fullNameEn'],
    },
    {
      colDef: 'fullNameRu',
      colTitleLocKey: 'personFullNameRuColTable',
      modelPropertyPath: ['person', 'fullNameRu'],
    },
    {
      colDef: 'personalNumber',
      colTitleLocKey: 'creatingEventLinearTrainerTablePersonalNumberCol',
      modelPropertyPath: ['person', 'personalNumber'],
    },
    {
      colDef: 'email',
      colTitleLocKey: 'creatingEventLinearTrainerTableEmailCol',
      modelPropertyPath: ['person', 'email'],
    },
    {
      colDef: 'employmentDate',
      colTitleLocKey: 'creatingEventLinearTrainerTableEmploymentDateCol',
      colType: DisplayedColumnTypeEnum.DATE,
      modelPropertyPath: ['person', 'employmentDate'],
    },
    {
      colDef: 'subdivision',
      colTitleLocKey: 'creatingEventLinearTrainerTableSubdivisionCol',
      modelPropertyPath: ['person', 'subdivision', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'position',
      colTitleLocKey: 'creatingEventLinearTrainerTablePositionCol',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'position', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'costCenter',
      colTitleLocKey: 'creatingEventLinearTrainerTableCostCenterCol',
      modelPropertyPath: ['person', 'costCenter', 'name'],
    },
    {
      colDef: 'city',
      colTitleLocKey: 'creatingEventLinearTrainerTableCityCol',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'city', this.localization.getLocalFieldEnumName()],
    },
    {
      colDef: 'company',
      colTitleLocKey: 'creatingEventLinearTrainerTableCompanyCol',
      modelPropertyPath: ['person', 'company', 'name'],
    },
    {
      colDef: 'status',
      colTitleLocKey: 'creatingEventLinearTrainerTableStatusCol',
      colType: DisplayedColumnTypeEnum.ENUM,
      modelPropertyPath: ['person', 'status', this.localization.getLocalFieldEnumName()],
    },
  ];

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateLinearTrainerDataSource();
  }

  openLinearTrainerModal(): void {
    const modalRef = this.newModal.open(LinearOrMainTrainerSelectionModalComponent, {
      data: {
        selectedTrainers: this.collectUniqueLinearTrainersFromModules(),
        trainingTemplateId: this.trainingTemplateId,
        mainTrainer: false,
      },
    });

    this.closeModalHandler(modalRef);
  }

  closeModalHandler(modalRef: MatDialogRef<LinearOrMainTrainerSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data?.save) {
          this.changeLinearTrainerDataSource(data.selectedTrainers);
        }
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  changeLinearTrainerDataSource(selectedLinearTrainers: Array<TrainerModel>): void {
    this.setLinearTrainersToModules(selectedLinearTrainers);

    this.updateLinearTrainerDataSource();
  }

  private setLinearTrainersToModules(selectedLinearTrainers: Array<TrainerModel>): void {
    this.modules.forEach(module => (module.linearTrainers = selectedLinearTrainers));
  }

  private collectUniqueLinearTrainersFromModules(): Array<TrainerModel> {
    const uniqueLinearTrainers: Array<TrainerModel> = [];

    this.modules.forEach(module => {
      module.linearTrainers?.forEach(linearTrainer => {
        const i = uniqueLinearTrainers.findIndex(uniqueLinearTrainer => {
          return uniqueLinearTrainer.id === linearTrainer.id;
        });

        if (i <= -1) {
          uniqueLinearTrainers.push(linearTrainer);
        }
      });
    });

    return uniqueLinearTrainers;
  }

  updateLinearTrainerDataSource(): void {
    this.table.commonLoadTableHandler(this.collectUniqueLinearTrainersFromModules());
  }

  linearTrainerOpenViewModal(linearTrainer: TrainerModel): void {
    this.newModal.open(CreateUpdateTrainerModalComponent, {
      data: {
        model: linearTrainer,
        isView: true,
      },
    });
  }

  removeLinearTrainerFromList(targetLinearTrainer: TrainerModel) {
    this.modules.forEach(module => {
      module.linearTrainers = module.linearTrainers.filter(linearTrainer => {
        return linearTrainer.id !== targetLinearTrainer.id;
      });
    });

    this.updateLinearTrainerDataSource();
  }
}
