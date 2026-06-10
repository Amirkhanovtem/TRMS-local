import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { PersonModel } from '@person-models/person.model';
import { PersonTrainingTableComponent } from '@profile-child-tables-person-training/person-training-table.component';
import { FullProfileComponent } from '@profile-full/full-profile.component';
import { ProfileService } from '@profile-services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../../../styles.scss'],
  standalone: false,
})
export class ProfileComponent extends CommonComponent implements OnInit {
  @ViewChild(PersonTrainingTableComponent) personTrainingTableComponent: PersonTrainingTableComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public person: PersonModel = new PersonModel();

  constructor(
    private profileService: ProfileService,
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.profileService.loadShortProfile().subscribe({
      next: data => {
        this.loadProfileSuccessHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  override ngAfterViewInit() {
    this.modalComponent.changeCloseWithoutConfirmField(true);
    super.ngAfterViewInit();
  }

  private loadProfileSuccessHandler(data: PersonModel): void {
    this.person = data;
    this.updateChildTables();
  }

  private updateChildTables(): void {
    this.updatePersonTrainingTable();
  }

  private updatePersonTrainingTable(): void {
    this.personTrainingTableComponent.personId = this.person.id;
    this.personTrainingTableComponent.loadPersonTrainingTable();
  }

  openFullPersonCardModal(): void {
    this.newModal.open(FullProfileComponent);
  }
}
