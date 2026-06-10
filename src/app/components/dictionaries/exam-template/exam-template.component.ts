import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CreateUpdateExamTemplateModalComponent } from '@exam-template-modals-create-update/create-update-exam-template-modal.component';
import { ExamTemplateService } from '@exam-template-services/exam-template.service';
import { Role } from '@config/role';

@Component({
  selector: 'app-exam',
  templateUrl: './exam-template.component.html',
  styleUrls: ['./exam-template.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class ExamTemplateComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateExamTemplateModalComponent> =
    CreateUpdateExamTemplateModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'examTemplateNameColTable',
    },
    {
      colDef: 'code',
      colTitleLocKey: 'examTemplateCodeColTable',
    },
    {
      colDef: 'description',
      colTitleLocKey: 'examTemplateDescriptionColTable',
    },
    {
      colDef: 'type',
      colTitleLocKey: 'examTemplateTypeColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'scoreType',
      colTitleLocKey: 'examTemplateScoreTypeColTable',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'maxScore',
      colTitleLocKey: 'examTemplateMaxScoreColTable',
    },
    {
      colDef: 'passingScore',
      colTitleLocKey: 'examTemplatePassingScoreColTable',
    },
    {
      colDef: 'triesCount',
      colTitleLocKey: 'examTemplateTriesCountColTable',
    },
  ];

  constructor(
    public examTemplateService: ExamTemplateService,
    private modal: MatDialog,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadExamTemplates();
  }

  public loadExamTemplates(): void {
    this.table.loading = true;

    this.examTemplateService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.table.errorResponseHandler(e);
      },
    });
  }

  public getMapCheckCrudBtnShowFuncMap(): Map<string, (btnName: string) => boolean> {
    const checkCreateEditViewBtnsShowFunc = (btnName: string): boolean => {
      return this.currentUserHasSomeRole([Role.ADMIN, Role.SENIOR_PLANER, Role.PLANER]);
    };

    const checkDeleteBtnShowFunc = (btnName: string): boolean => {
      return this.currentUserHasSomeRole([Role.ADMIN]);
    };

    return new Map<string, (btnName: string) => boolean>([
      ['create', checkCreateEditViewBtnsShowFunc],
      ['edit', checkCreateEditViewBtnsShowFunc],
      ['delete', checkDeleteBtnShowFunc],
      ['view', checkCreateEditViewBtnsShowFunc],
    ]);
  }
}
