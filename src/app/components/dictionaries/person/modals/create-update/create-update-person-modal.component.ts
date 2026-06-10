import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CityModel } from '@city-models/city.model';
import { CityService } from '@city-services/city.service';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { CommonTreeSelectionModalComponent } from '@common-tree-modals-selection/common-tree-selection-modal.component';
import { TreeSelectionTypeEnum } from '@common-tree-models/tree-selection-type.enum';
import { CompanyModel } from '@company-models/company.model';
import { CompanyService } from '@company-services/company.service';
import { CostCenterModel } from '@cost-center-models/cost-center.model';
import { CostCenterService } from '@cost-center-services/cost-center.service';
import { PersonFullNameInfoTableComponent } from '@person-modals-full-name-info-table/person-full-name-info-table.component';
import { PersonModel } from '@person-models/person.model';
import { PersonService } from '@person-services/person.service';
import { PositionModel } from '@position-models/position.model';
import { PositionService } from '@position-services/position.service';
import { SubdivisionService } from '@subdivision-services/subdivision.service';

@Component({
  selector: 'app-create-update-person-modal',
  templateUrl: './create-update-person-modal.component.html',
  styleUrls: ['./create-update-person-modal.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdatePersonModalComponent extends CommonCreateUpdateComponents<PersonModel> implements OnInit {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  @ViewChild('teamTable') teamTable: PersonFullNameInfoTableComponent;
  @ViewChild('supervisorTable') supervisorTable: PersonFullNameInfoTableComponent;

  public person: PersonModel = new PersonModel();
  public allPersonStatus: Array<StandardEnumModel>;
  public allPersonLanguages: Array<StandardEnumModel> = [null];
  public allPersonGenders: Array<StandardEnumModel>;
  public allPersonnelTypes: Array<StandardEnumModel> = [null];
  public maxDate: Date = new Date();

  public companies: Array<CompanyModel> = [];
  public cities: Array<CityModel> = [];
  public positions: Array<PositionModel> = [];
  public costCenters: Array<CostCenterModel> = [];

  constructor(
    private personService: PersonService,
    private companyService: CompanyService,
    private cityService: CityService,
    private positionService: PositionService,
    private costCenterService: CostCenterService,
    private subdivisionService: SubdivisionService,
    private injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadPersonDetail();

    this.loadCompanies();
    this.loadCities();
    this.loadPositions();
    this.loadCostCenters();

    this.loadAllPersonStatus();
    this.loadAllPersonLanguages();
    this.loadAllPersonGenders();
    this.loadAllPersonnelTypes();
  }

  loadAllPersonnelTypes(): void {
    this.personService.getAllPersonnelType().subscribe({
      next: data => {
        this.allPersonnelTypes.push(...data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAllPersonStatus(): void {
    this.personService.getAllPersonStatus().subscribe({
      next: data => {
        this.allPersonStatus = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAllPersonLanguages(): void {
    this.personService.getAllPersonLanguages().subscribe({
      next: data => {
        this.allPersonLanguages.push(...data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAllPersonGenders(): void {
    this.personService.getAllPersonGenders().subscribe({
      next: data => {
        this.allPersonGenders = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadCompanies(): void {
    this.companyService.list().subscribe({
      next: data => {
        this.companies = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadCities(): void {
    this.cityService.list().subscribe({
      next: data => {
        this.cities = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadPositions(): void {
    this.positionService.list().subscribe({
      next: data => {
        this.positions = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadCostCenters(): void {
    this.costCenterService.list().subscribe({
      next: data => {
        this.costCenters = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadPersonDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.personService.getPerson(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.loadPersonSuccessHandler(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  loadPersonSuccessHandler(person: PersonModel): void {
    this.person = person;
    this.calcExperience();
    this.updateChildTablesByPosition();
  }

  updateChildTablesByPosition(): void {
    this.updateTeamTable();
    this.updateSupervisorTable();
  }

  updateTeamTable(): void {
    const positionId: string = this.person?.position?.id;

    if (!positionId) {
      return;
    }

    this.teamTable.loadDataSourceObs = this.personService.getTeam(this.person.id, positionId);
    this.teamTable.loadPersons();
  }

  updateSupervisorTable(): void {
    const positionId: string = this.person?.position?.id;

    if (!positionId) {
      return;
    }

    this.supervisorTable.loadDataSourceObs = this.personService.getSupervisors(this.person.id, positionId);
    this.supervisorTable.loadPersons();
  }

  calcExperience(): void {
    this.person.experience = this.personService.calcExperience(this.person, this.localization);
  }

  changePersonPosition(position: PositionModel): void {
    if (this.dialogParams?.isView) {
      return;
    }

    this.person.position = position;
    this.updateChildTablesByPosition();
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      lastName: ['', [Validators.required, this.noWhitespaceValidator]],
      firstName: ['', [Validators.required, this.noWhitespaceValidator]],
      patronymic: ['', []],
      email: ['', [Validators.required, this.noWhitespaceValidator, Validators.email]],
      username: ['', [Validators.required, this.noWhitespaceValidator]],
      trmsRole: ['', []],
      employmentDate: ['', [Validators.required]],
      position: ['', [Validators.required]],
      costCenter: ['', [Validators.required]],
      language: ['', []],
      city: ['', [Validators.required]],
      company: ['', [Validators.required]],
      status: ['', [Validators.required]],
      personnelType: ['', []],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      subdivision: ['', []],
      placeOfBirth: ['', []],
      personalNumber: ['', [Validators.required, this.noWhitespaceValidator]],
    });

    this.modalForm.setValidators([this.subdivisionValidator()]);
  }

  subdivisionValidator(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors => {
      const subdivisionControl = formGroup.controls['subdivision'],
        errorCode = 'required';

      const invalidSubdivision: boolean = this.person.subdivision?.id == null && subdivisionControl.touched;

      this.changeControlError(subdivisionControl, errorCode, invalidSubdivision);

      return null;
    };
  }

  createOrSavePerson(): void {
    this.modalForm.markAllAsTouched();

    this.modalForm.controls['subdivision'].updateValueAndValidity();

    if (this.validateForm() && this.checkPersonHasSubdivision()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  public checkPersonHasSubdivision(): boolean {
    const personHasSubdivision = this.person.subdivision?.id != null;

    if (personHasSubdivision) {
      return true;
    }

    const message = this.localization.getLocalTextFromKey('personEmptySubdivisionErrorMessage');

    this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);

    return false;
  }

  create(): void {
    this.personService
      .create(this.person)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  update(): void {
    this.personService
      .update(this.person)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  errorHandler(error): void {
    const errorBody = error.error,
      contents = errorBody.contents;

    if (!contents || contents.length <= 0) {
      this.errorResponseHandler(error);
      return;
    }

    contents.forEach(content => {
      switch (content.type) {
        case EntityExceptionEnum.UNIQUENESS_CHECK_EXCEPTION_CONTENT: {
          this.uniquenessErrorHandler(content);
          break;
        }
        default:
          this.errorResponseHandler(error);
      }
    });
  }

  openSelectionSubdivision(): void {
    const modalRef = this.newModal.open(CommonTreeSelectionModalComponent, {
      data: {
        selectedNodesId: [this.person?.subdivision?.id],
        loadTreeDataObs: this.subdivisionService.list(),
        modalTitle: this.localization.getLocalTextFromKey('subdivisionSelectionPageTitle'),
        treeSelectionType: TreeSelectionTypeEnum.SINGLE_PARENT_NODE_SELECTION,
        isView: this.dialogParams?.isView,
      },
    });

    this.closeSelectionSubdivisionHandler(modalRef);
  }

  closeSelectionSubdivisionHandler(modalRef: MatDialogRef<CommonTreeSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.person.subdivision = modalRef.componentInstance.getMinLevelNode(data.result);
          this.modalForm.controls['subdivision'].updateValueAndValidity();
        }
      },
      error: e => {
        this.errorHandler(e);
      },
    });
  }

  uniquenessErrorHandler(content): void {
    content.errorCauses.forEach(errorCause => {
      switch (errorCause.field) {
        case 'username':
          this.setErrorOnValidator('username', content.type);
          break;
        case 'personal_number':
          this.setErrorOnValidator('personalNumber', content.type);
          break;
      }
    });
  }
}
