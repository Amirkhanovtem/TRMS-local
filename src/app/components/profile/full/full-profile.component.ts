import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { PersonModel } from '@person-models/person.model';
import { PersonService } from '@person-services/person.service';

@Component({
  selector: 'app-full-profile',
  templateUrl: './full-profile.component.html',
  styleUrls: ['./full-profile.component.scss', '../../../../styles.scss'],
  standalone: false,
})
export class FullProfileComponent extends CommonComponent implements OnInit {
  @ViewChild('modal') modalComponent: CommonModalComponent;
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

  override ngAfterViewInit() {
    this.modalComponent.changeCloseWithoutConfirmField(true);
    super.ngAfterViewInit();
  }

  loadPersonDetail(): void {
    this.personService.getAuthPersonDetail().subscribe({
      next: data => {
        this.person = data;
        this.calcExperience();
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  calcExperience(): void {
    this.person.experience = this.personService.calcExperience(this.person, this.localization);
  }
}
