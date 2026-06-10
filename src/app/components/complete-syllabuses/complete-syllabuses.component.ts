import { Component, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CompleteSyllabusModel } from '@complete-syllabuses/models/complete-syllabus.model';
import { SyllabusFactualStatusModel } from '@complete-syllabuses/models/syllabus-factual-status.model';
import { CompleteSyllabusesService } from '@complete-syllabuses/services/complete-syllabuses.service';
import { Role } from '@config/role';
import { CreateUpdateSyllabusModalComponent } from '@event-syllabus-modals-create-update/create-update-syllabus-modal.component';
import { SyllabusService } from '@event-syllabus-services/syllabus.service';

@Component({
  selector: 'app-completed-syllabuses',
  templateUrl: './complete-syllabuses.component.html',
  styleUrls: ['./complete-syllabuses.component.scss', '../../../styles.scss'],
  standalone: false,
})
export class CompleteSyllabusesComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'completedSyllabusesNameColTable',
    },
    {
      colDef: 'category',
      colTitleLocKey: 'completedSyllabusesCategoryColTable',
      modelPropertyPath: ['trainingCategory', 'name'],
    },
    {
      colDef: 'trainers',
      colTitleLocKey: 'completedSyllabusesTrainersColTable',
    },
    {
      colDef: 'startDate',
      colTitleLocKey: 'completedSyllabusesStartDateColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'endDate',
      colTitleLocKey: 'completedSyllabusesEndDateColTable',
      colType: DisplayedColumnTypeEnum.DATE_TIME,
    },
    {
      colDef: 'factualStatus',
      colTitleLocKey: 'completedSyllabusesFactualStatusColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
  ];

  public allFactualStatuses: Array<StandardEnumModel> = [];

  constructor(
    private completeSyllabusesService: CompleteSyllabusesService,
    private syllabusService: SyllabusService,
    private modal: MatDialog,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadCompleteSyllabuses();
    this.loadAllFactualStatuses();
  }

  private loadAllFactualStatuses(): void {
    this.completeSyllabusesService.getAllFactualStatuses().subscribe({
      next: data => {
        this.allFactualStatuses = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private loadCompleteSyllabuses(): void {
    this.table.loading = true;

    this.completeSyllabusesService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  public currentUserCanEditEvent(event): boolean {
    return event.isEditable;
  }

  public currentUserCanViewEventModal(): boolean {
    const rolesCanView: Array<string> = [Role.ADMIN, Role.SENIOR_PLANER, Role.PLANER, Role.TRAINER];

    return this.currentUserHasSomeRole(rolesCanView);
  }

  public openEditEventModal(completedSyllabus: CompleteSyllabusModel): void {
    if (!this.currentUserCanViewEventModal()) {
      return;
    }

    const isCurrentUserCanEditEvent = this.currentUserCanEditEvent(completedSyllabus);

    if (isCurrentUserCanEditEvent) {
      this.openSyllabusEditModal(completedSyllabus);
    } else {
      this.openSyllabusViewModal(completedSyllabus);
    }
  }

  private openSyllabusEditModal(syllabusIdNameModel): void {
    const modalRef = this.newModal.open(CreateUpdateSyllabusModalComponent, {
      data: {
        model: syllabusIdNameModel,
        isUpdate: true,
      },
    });

    this.closeCreateUpdateSyllabusHandler(modalRef);
  }

  private closeCreateUpdateSyllabusHandler(modalRef: MatDialogRef<CreateUpdateSyllabusModalComponent>): void {
    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCompleteSyllabuses();
      }
    });
  }

  private openSyllabusViewModal(syllabusIdNameModel): void {
    this.newModal.open(CreateUpdateSyllabusModalComponent, {
      data: {
        model: syllabusIdNameModel,
        isView: true,
      },
    });
  }

  saveFactualStatus(completedSyllabus, factualStatus): void {
    completedSyllabus.factualStatus = factualStatus;

    const syllabusModel: SyllabusFactualStatusModel = new SyllabusFactualStatusModel();
    syllabusModel.id = completedSyllabus.id;
    syllabusModel.factualStatus = completedSyllabus.factualStatus;

    this.syllabusService.updateFactualStatus(syllabusModel).subscribe({
      next: data => {
        this.successResponseHandler('saveSuccessfulMessage');
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }
}
