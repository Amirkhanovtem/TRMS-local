import { Component, Injector, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { ModuleModel } from '@event-module-models/module.model';
import { PersonService } from '@person-services/person.service';
import { CreateUpdateTrainerModalComponent } from '@trainer-modals-create-update/create-update-trainer-modal.component';
import { LinearOrMainTrainerSelectionModalComponent } from '@trainer-modals-selection/linear-or-main-trainer-selection-modal.component';
import { TrainerModel } from '@trainer-models/trainer.model';

@Component({
  selector: 'app-creating-event-main-trainer-table',
  templateUrl: './creating-event-main-trainer-table.component.html',
  styleUrls: ['./creating-event-main-trainer-table.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class CreatingEventMainTrainerTableComponent extends CommonComponent {
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

  constructor(
    private personService: PersonService,
    private modal: MatDialog,
    private injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateMainTrainerDataSource();
  }

  openMainTrainerModal(): void {
    const modalRef = this.modal.open(LinearOrMainTrainerSelectionModalComponent, {
      data: {
        selectedTrainers: this.collectUniqueMainTrainersFromModules(),
        trainingTemplateId: this.trainingTemplateId,
        mainTrainer: true,
      },
    });
    this.closeModalHandler(modalRef);
  }

  closeModalHandler(modalRef: MatDialogRef<LinearOrMainTrainerSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data?.save) {
          this.changeMainTrainerDataSource(data.selectedTrainers);
        }
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  changeMainTrainerDataSource(selectedMainTrainers: Array<TrainerModel>): void {
    this.setMainTrainersToModules(selectedMainTrainers);

    this.updateMainTrainerDataSource();
  }

  private setMainTrainersToModules(selectedMainTrainers: Array<TrainerModel>): void {
    this.modules.forEach(module => (module.mainTrainers = selectedMainTrainers));
  }

  private collectUniqueMainTrainersFromModules(): Array<TrainerModel> {
    const uniqueMainTrainers: Array<TrainerModel> = [];

    this.modules.forEach(module => {
      module.mainTrainers?.forEach(mainTrainer => {
        const i = uniqueMainTrainers.findIndex(uniqueMainTrainer => {
          return uniqueMainTrainer.id === mainTrainer.id;
        });

        if (i <= -1) {
          uniqueMainTrainers.push(mainTrainer);
        }
      });
    });

    return uniqueMainTrainers;
  }

  updateMainTrainerDataSource() {
    this.table.commonLoadTableHandler(this.collectUniqueMainTrainersFromModules());
  }

  mainTrainerOpenViewModal(mainTrainer: TrainerModel): void {
    this.modal.open(CreateUpdateTrainerModalComponent, {
      data: {
        model: mainTrainer,
        isView: true,
      },
    });
  }

  removeMainTrainerFromList(targetMainTrainer: TrainerModel): void {
    this.modules.forEach(module => {
      module.mainTrainers = module.mainTrainers.filter(mainTrainer => {
        return mainTrainer.id !== targetMainTrainer.id;
      });
    });

    this.updateMainTrainerDataSource();
  }
}
