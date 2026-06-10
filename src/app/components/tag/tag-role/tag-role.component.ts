import { ComponentType } from '@angular/cdk/overlay';
import { Component, Injector, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { CreateUpdateTagRoleModalComponent } from '@tag-role-modals-create-update/create-update-tag-role-modal.component';
import { TagRoleService } from '@tag-role-services/tag-role.service';

@Component({
  selector: 'app-tag-role',
  templateUrl: './tag-role.component.html',
  styleUrls: ['./tag-role.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class TagRoleComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;

  public createUpdateComponent: ComponentType<CreateUpdateTagRoleModalComponent> = CreateUpdateTagRoleModalComponent;
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'select',
      colTitleLocKey: 'check',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
    },
    {
      colDef: 'name',
      colTitleLocKey: 'tagRole.nameColTable',
    },
  ];

  constructor(
    public tagRoleService: TagRoleService,
    injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadTagRoles();
  }

  public loadTagRoles(): void {
    this.table.loading = true;

    this.tagRoleService.list().subscribe({
      next: data => {
        this.table.commonLoadTableHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }
}
