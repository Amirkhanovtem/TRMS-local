import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { FilterOutputModel } from '@person/components/person-table-with-hierarchy-filter/childs/person-hierarchy-filter/models/filter-output.model';
import { PersonModel } from '@person-models/person.model';
import { PersonService } from '@person-services/person.service';

@Component({
  selector: 'app-person-table-with-hierarchy-filter',
  templateUrl: './person-table-with-hierarchy-filter.component.html',
  styleUrl: './person-table-with-hierarchy-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PersonTableWithHierarchyFilterComponent extends CommonComponent {
  readonly tableWrapper: Signal<TableWrapperComponent | undefined> = contentChild<TableWrapperComponent | undefined>(
    TableWrapperComponent,
  );
  readonly personService: PersonService = inject(PersonService);
  readonly lastFilter: WritableSignal<FilterOutputModel | null> = signal(null);

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.initTableSettings();
  }

  initTableSettings(): void {
    const tableWrapper: TableWrapperComponent | undefined = this.tableWrapper();

    if (!tableWrapper) {
      return;
    }

    tableWrapper.clearSelectionAfterLoad = false;
    tableWrapper.selection.compareWith = (o1: PersonModel, o2: PersonModel) => o1.id === o2.id;
  }

  onFolderSelectEvent(filter: FilterOutputModel): void {
    this.lastFilter.set(filter);
    this.loadPersons();
  }

  public loadPersons(): void {
    const tableWrapper: TableWrapperComponent | undefined = this.tableWrapper();

    if (!tableWrapper) {
      return;
    }

    const filter: FilterOutputModel = this.lastFilter();
    tableWrapper.loading = true;

    this.personService.listForTable(filter.status, filter.subdivisionId, filter.showSubordinates).subscribe({
      next: data => {
        this.calcExperience(data);
        tableWrapper.commonLoadTableHandler(data);
      },
      error: e => {
        tableWrapper.errorResponseHandler(e);
      },
    });
  }

  calcExperience(persons: Array<PersonModel>): void {
    for (const person of persons) {
      person.experience = this.personService.calcExperience(person, this.localization);
    }
  }
}
