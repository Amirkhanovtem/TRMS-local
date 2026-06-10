import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CityModel } from '@city-models/city.model';
import { CityService } from '@city-services/city.service';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { SearchComponent } from '@common-search/search.component';
import { CommonTreeSelectionModalComponent } from '@common-tree-modals-selection/common-tree-selection-modal.component';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { TreeSelectionTypeEnum } from '@common-tree-models/tree-selection-type.enum';
import { CreateUpdatePersonModalComponent } from '@person-modals-create-update/create-update-person-modal.component';
import { PersonModel } from '@person-models/person.model';
import { PersonService } from '@person-services/person.service';
import { PositionModel } from '@position-models/position.model';
import { PositionService } from '@position-services/position.service';
import { SubdivisionService } from '@subdivision-services/subdivision.service';
import { TrainerCategoryService } from '@trainer-category-services/trainer-category.service';
import { TrainerTrainingTableComponent } from '@trainer-modals-create-update-child-tables-trainer-training-table/trainer-training-table.component';
import { TrainerModel } from '@trainer-models/trainer.model';
import { TrainerService } from '@trainer-services/trainer.service';
import { TrainingCategoryService } from '@training-category-services/training-category.service';

@Component({
  selector: 'app-create-update-trainer-modal',
  templateUrl: './create-update-trainer-modal.component.html',
  styleUrls: ['./create-update-trainer-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateTrainerModalComponent extends CommonCreateUpdateComponents<TrainerModel> implements OnInit {
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChild('personSearch') personSearch: SearchComponent;
  @ViewChild(TrainerTrainingTableComponent) trainerTrainingTableComponent: TrainerTrainingTableComponent;

  public trainer: TrainerModel = new TrainerModel();
  public allPersonsUnattachedTrainer: Array<PersonModel> = [];
  public maxDate: Date = new Date();

  public cities: Array<CityModel> = [];
  public positions: Array<PositionModel> = [];

  constructor(
    public personService: PersonService,
    private trainerService: TrainerService,
    injector: Injector,
    private cityService: CityService,
    private positionService: PositionService,
    private subdivisionService: SubdivisionService,
    private trainerCategoryService: TrainerCategoryService,
    private trainingCategoryService: TrainingCategoryService,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadTrainerDetail();

    this.loadCities();
    this.loadPositions();

    this.loadAllPersonsUnattachedTrainer();
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

  loadAllPersonsUnattachedTrainer(): void {
    this.personService.getAllPersonsUnattachedTrainer().subscribe({
      next: data => {
        this.collectAllPersonsUnattachedTrainer(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  getAllFilteredPersons(): Array<PersonModel> {
    return this.allPersonsUnattachedTrainer.filter(person => {
      const search: string = this.personSearch?.search?.toLowerCase();

      if (!search || search.trim().length === 0) {
        return true;
      }

      const fullNameContainsSearch: boolean = this.compareWithSearch(person.fullName, search),
        personalNumberContainsSearch: boolean = this.compareWithSearch(person.personalNumber, search);

      return fullNameContainsSearch || personalNumberContainsSearch;
    });
  }

  compareWithSearch(value: string, search: string): boolean {
    if (!search || search.trim().length === 0) {
      return true;
    }

    const notEmptyValue: string = value ?? '';

    return notEmptyValue.toLowerCase().includes(this.personSearch.search.toLowerCase());
  }

  collectAllPersonsUnattachedTrainer(data: Array<PersonModel>): void {
    this.allPersonsUnattachedTrainer = data;

    if (this.dialogParams?.isUpdate || this.dialogParams?.isView) {
      if (this.trainer.person != null) {
        this.allPersonsUnattachedTrainer.push(this.trainer.person);
      }
    }
  }

  loadPersonDetail(id: string): void {
    if (this.dialogParams?.isView) {
      return;
    }

    this.personService.getPerson(id).subscribe({
      next: data => {
        this.trainer.person = data;
        this.setPersonFullName();
        this.calcExperience();
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadTrainerDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.trainerService.getTrainer(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.loadTrainerSuccessfulHandler(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  loadTrainerSuccessfulHandler(data: TrainerModel): void {
    this.trainer = data;
    this.setPersonFullName();
    this.calcExperience();
  }

  calcExperience(): void {
    this.trainer.person.experience = this.personService.calcExperience(this.trainer.person, this.localization);
  }

  setPersonFullName(): void {
    this.trainer.person.fullName = this.personService.getFullName(this.trainer.person);
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      person: ['', [Validators.required]],
      fullNameRu: ['', []],
      fullNameEn: ['', []],
      email: ['', [Validators.required, this.noWhitespaceValidator, Validators.email]],
      position: ['', [Validators.required]],
      city: ['', [Validators.required]],
      personalNumber: ['', [Validators.required, this.noWhitespaceValidator]],
    });
  }

  createOrSaveTrainer(): void {
    this.modalForm.markAllAsTouched();

    this.modalForm.patchValue({
      subdivision: this.trainer?.person.subdivision,
      trainerCategory: this.trainer?.trainerCategory,
      mainTrainingCategories: this.trainer?.mainTrainingCategories,
      linearTrainingCategories: this.trainer?.linearTrainingCategories,
      mainTrainingTemplates: this.trainer?.mainTrainingTemplates,
      linearTrainingTemplates: this.trainer?.linearTrainingTemplates,
    });

    if (this.validateForm() && this.checkTrainerHasSubdivision() && this.checkTrainerHasCategory()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  public checkTrainerHasSubdivision(): boolean {
    const trainerHasSubdivision = this.trainer?.person?.subdivision?.id != null;

    if (trainerHasSubdivision) {
      return true;
    }

    const message = this.localization.getLocalTextFromKey('trainerEmptySubdivisionErrorMessage');
    this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);

    return false;
  }

  public checkTrainerHasCategory(): boolean {
    const trainerHasCategory = this.trainer?.trainerCategory?.id != null;

    if (trainerHasCategory) {
      return true;
    }

    const message = this.localization.getLocalTextFromKey('trainerEmptyCategoryErrorMessage');
    this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);

    return false;
  }

  create(): void {
    this.trainerService
      .create(this.trainer)
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
    this.trainerService
      .update(this.trainer)
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

  uniquenessErrorHandler(content): void {
    content.errorCauses.forEach(errorCause => {
      switch (errorCause.field) {
        case 'person_id':
          this.setErrorOnValidator('person', content.type);
          break;
        case 'username':
          this.setErrorOnValidator('username', content.type);
          break;
        case 'personal_number':
          this.setErrorOnValidator('personalNumber', content.type);
          break;
      }
    });
  }

  getTrainingCategoryAndTemplateIds(
    categories: Array<StandardNameIdModel>,
    templates: Array<StandardNameIdModel>,
  ): Array<string> {
    const categoryIds: Array<string> = categories ? categories.map(category => category.id) : [],
      templateIds: Array<string> = templates ? templates.map(template => template.id) : [];

    return [...categoryIds, ...templateIds];
  }

  openSelectionMainTrainingCategoryAndTemplate(): void {
    const modalRef = this.newModal.open(CommonTreeSelectionModalComponent, {
      data: {
        selectedNodesId: this.getTrainingCategoryAndTemplateIds(
          this.trainer.mainTrainingCategories,
          this.trainer.mainTrainingTemplates,
        ),
        loadTreeDataObs: this.trainingCategoryService.listWithTrainingTemplatesActive(),
        modalTitle: this.localization.getLocalTextFromKey('trainingCategoryMainSelectionPageTitle'),
        treeSelectionType: TreeSelectionTypeEnum.MULTI_PARENT_NODE_SELECTION,
        isView: this.dialogParams?.isView,
      },
    });

    this.closeSelectionTrainingCategoryAndTemplateHandler(modalRef, true);
  }

  openSelectionLinearTrainingCategoryAndTemplate(): void {
    const modalRef = this.newModal.open(CommonTreeSelectionModalComponent, {
      data: {
        selectedNodesId: this.getTrainingCategoryAndTemplateIds(
          this.trainer.linearTrainingCategories,
          this.trainer.linearTrainingTemplates,
        ),
        loadTreeDataObs: this.trainingCategoryService.listWithTrainingTemplatesActive(),
        modalTitle: this.localization.getLocalTextFromKey('trainingCategoryLinearSelectionPageTitle'),
        treeSelectionType: TreeSelectionTypeEnum.MULTI_PARENT_NODE_SELECTION,
        isView: this.dialogParams?.isView,
      },
    });

    this.closeSelectionTrainingCategoryAndTemplateHandler(modalRef, false);
  }

  openSelectionTrainerCategory(): void {
    const modalRef = this.newModal.open(CommonTreeSelectionModalComponent, {
      data: {
        selectedNodesId: [this.trainer?.trainerCategory?.id],
        loadTreeDataObs: this.trainerCategoryService.listWithoutTrainers(),
        modalTitle: this.localization.getLocalTextFromKey('trainerCategorySelectionPageTitle'),
        treeSelectionType: TreeSelectionTypeEnum.SINGLE_PARENT_NODE_SELECTION,
        isView: this.dialogParams?.isView,
      },
    });

    this.closeSelectionTrainerCategoryHandler(modalRef);
  }

  openSelectionSubdivision(): void {
    const modalRef = this.newModal.open(CommonTreeSelectionModalComponent, {
      data: {
        selectedNodesId: [this.trainer?.person?.subdivision?.id],
        loadTreeDataObs: this.subdivisionService.list(),
        modalTitle: this.localization.getLocalTextFromKey('subdivisionSelectionPageTitle'),
        treeSelectionType: TreeSelectionTypeEnum.SINGLE_PARENT_NODE_SELECTION,
        isView: this.dialogParams?.isView,
      },
    });

    this.closeSelectionSubdivisionHandler(modalRef);
  }

  closeSelectionTrainingCategoryAndTemplateHandler(
    modalRef: MatDialogRef<CommonTreeSelectionModalComponent>,
    isMainSelected: boolean,
  ): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.fillSelectedTrainingCategoryAndTemplate(data.result, isMainSelected);
        }
      },
      error: e => {
        this.errorHandler(e);
      },
    });
  }

  closeSelectionTrainerCategoryHandler(modalRef: MatDialogRef<CommonTreeSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.trainer.trainerCategory = modalRef.componentInstance.getMinLevelNode(data.result);
        }
      },
      error: e => {
        this.errorHandler(e);
      },
    });
  }

  closeSelectionSubdivisionHandler(modalRef: MatDialogRef<CommonTreeSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.trainer.person.subdivision = modalRef.componentInstance.getMinLevelNode(data.result);
        }
      },
      error: e => {
        this.errorHandler(e);
      },
    });
  }

  fillSelectedTrainingCategoryAndTemplate(
    selectedInHierarchy: Array<StandardFlatNodeModel>,
    isMainSelected: boolean,
  ): void {
    const newSelectedTrainingTemplates: Array<StandardNameIdModel> = [],
      newSelectedTrainingCategories: Array<StandardNameIdModel> = [];

    while (selectedInHierarchy.length > 0) {
      const newSelected: StandardNameIdModel = new StandardNameIdModel(),
        node = selectedInHierarchy.pop(),
        parentNode = selectedInHierarchy.filter(selected => selected.id === node.parentId);

      newSelected.id = node.id;
      newSelected.name = node.name;

      if (parentNode && parentNode.length > 0) {
        continue;
      }

      if (node.unextendable) {
        newSelectedTrainingTemplates.push(newSelected);
      } else {
        newSelectedTrainingCategories.push(newSelected);
      }
    }

    if (isMainSelected) {
      this.trainer.mainTrainingTemplates = newSelectedTrainingTemplates;
      this.trainer.mainTrainingCategories = newSelectedTrainingCategories;
    } else {
      this.trainer.linearTrainingTemplates = newSelectedTrainingTemplates;
      this.trainer.linearTrainingCategories = newSelectedTrainingCategories;
    }
  }

  openFullProfile(): void {
    this.newModal.open(CreateUpdatePersonModalComponent, {
      data: {
        model: this.trainer.person,
        isView: true,
      },
    });
  }
}
