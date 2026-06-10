import { Component, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CreateUpdatePersonModalComponent } from '@person-modals-create-update/create-update-person-modal.component';
import { PersonModel } from '@person-models/person.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-person-full-name-info-table',
  templateUrl: './person-full-name-info-table.component.html',
  styleUrls: ['./person-full-name-info-table.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class PersonFullNameInfoTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;
  @Input() tableId: string = '';

  public loadDataSourceObs: Observable<Array<PersonModel>>;

  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'lastName',
      colTitleLocKey: 'personLastNameColTable',
    },
    {
      colDef: 'firstName',
      colTitleLocKey: 'personFirstNameColTable',
    },
    {
      colDef: 'patronymic',
      colTitleLocKey: 'personPatronymicColTable',
    },
    {
      colDef: 'actions',
      colTitleLocKey: 'actions',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
  ];

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.loadPersons();
  }

  public loadPersons() {
    this.table.loading = true;

    if (this.loadDataSourceObs) {
      this.loadDataSourceObs.subscribe({
        next: data => {
          this.table.commonLoadTableHandler(data);
        },
        error: e => {
          this.table.errorResponseHandler(e);
        },
      });
    } else {
      this.table.commonLoadTableHandler([]);
    }
  }

  openViewPersonModal(person: PersonModel): void {
    this.newModal.open(CreateUpdatePersonModalComponent, {
      data: {
        model: person,
        isView: true,
      },
    });
  }
}
