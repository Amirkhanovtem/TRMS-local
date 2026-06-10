import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { PersonModel } from '@person-models/person.model';
import { PersonService } from '@person-services/person.service';
import { PersonTrainingTableComponent } from '@profile-child-tables-person-training/person-training-table.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class ProfilePageComponent extends CommonComponent implements OnInit {
  @ViewChild(PersonTrainingTableComponent)
  personTrainingTableComponent: PersonTrainingTableComponent;

  public person: PersonModel = new PersonModel();

  constructor(
    private personService: PersonService,
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadPersonDetail();
  }

  loadPersonDetail(): void {
    this.personService.getAuthPersonDetail().subscribe({
      next: data => {
        this.loadProfileSuccessHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private loadProfileSuccessHandler(data: PersonModel): void {
    this.person = data;
    this.calcExperience();
    this.updateChildTables();
  }

  calcExperience(): void {
    this.person.experience = this.personService.calcExperience(this.person, this.localization);
  }

  private updateChildTables(): void {
    this.updatePersonTrainingTable();
  }

  private updatePersonTrainingTable(): void {
    if (this.personTrainingTableComponent) {
      this.personTrainingTableComponent.personId = this.person.id;
      this.personTrainingTableComponent.loadPersonTrainingTable();
    }
  }
}
