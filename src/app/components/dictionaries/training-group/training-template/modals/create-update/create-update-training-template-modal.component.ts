import { Component, Injector, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CertificateTemplateModel } from '@certificate-template-models/certificate-template.model';
import { CertificateTemplateService } from '@certificate-template-services/certificate-template.service';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DragOrderModalComponent } from '@common-drag-order-modal/drag-order-modal.component';
import { DragOrderModel } from '@common-drag-order-modal-models/drag-order.model';
import { DragOrderService } from '@common-drag-order-modal-services/drag-order.service';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CommonTreeSelectionModalComponent } from '@common-tree-modals-selection/common-tree-selection-modal.component';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { TreeSelectionTypeEnum } from '@common-tree-models/tree-selection-type.enum';
import { ExamTemplateModel } from '@exam-template-models/exam-template.model';
import { ExamTemplateService } from '@exam-template-services/exam-template.service';
import { ModuleTemplateModel } from '@module-template-models/module-template.model';
import { TrainerCategoryService } from '@trainer-category-services/trainer-category.service';
import { TrainingCategoryModel } from '@training-category-models/training-category.model';
import { TrainingCategoryService } from '@training-category-services/training-category.service';
import { TrainingTemplateCertificateTemplateHistoryModalComponent } from '@training-template-modals/training-template-certificate-template-history-modal/training-template-certificate-template-history-modal.component';
import { TrainingTemplateModuleTemplateTableComponent } from '@training-template-modals-module-template-table/training-template-module-template-table.component';
import { TrainingTemplateSyllabusTemplateTableComponent } from '@training-template-modals-syllabus-template-table/training-template-syllabus-template-table.component';
import { TrainingTemplateModel } from '@training-template-models/training-template.model';
import { TrainingTemplateService } from '@training-template-services/training-template.service';
import { TrainingTypeModel } from '@training-type-models/training-type.model';
import { TrainingTypeService } from '@training-type-services/training-type.service';

@Component({
  selector: 'app-create-update-training-template-modal',
  templateUrl: './create-update-training-template-modal.component.html',
  styleUrls: ['./create-update-training-template-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateTrainingTemplateModalComponent extends CommonCreateUpdateComponents<TrainingTemplateModel> {
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChild(TrainingTemplateModuleTemplateTableComponent)
  trainingTemplateModuleTemplateTableComponent: TrainingTemplateModuleTemplateTableComponent;
  @ViewChild(TrainingTemplateSyllabusTemplateTableComponent)
  trainingTemplateSyllabusTemplateTableComponent: TrainingTemplateSyllabusTemplateTableComponent;

  public trainingTemplate: TrainingTemplateModel = new TrainingTemplateModel();
  public allTrainingTypes: Array<TrainingTypeModel>;
  public allCertificateTemplatesUnattachedTrainingTemplate: Array<CertificateTemplateModel> = [];
  public allExamTemplates: Array<ExamTemplateModel>;
  public allTrainingTemplateFormats: Array<StandardEnumModel>;
  public allTrainingTemplateStatus: Array<StandardEnumModel>;
  public readonly MIN_REGISTRATION_LIMIT_RECOMMENDATION: number = 0;
  public readonly MAX_REGISTRATION_LIMIT_RECOMMENDATION: number = 999;

  constructor(
    private trainingTemplateService: TrainingTemplateService,
    private trainingTypeService: TrainingTypeService,
    private certificateTemplateService: CertificateTemplateService,
    private trainingCategoryService: TrainingCategoryService,
    private dragOrderService: DragOrderService,
    private examTemplateService: ExamTemplateService,
    injector: Injector,
    private trainerCategoryService: TrainerCategoryService,
  ) {
    super(injector);
    this.createForm();
  }

  override ngAfterViewInit(): void {
    this.loadTrainingTemplateDetail();

    this.loadAllTrainingTypes();
    this.loadAllCertificateTemplatesUnattachedTrainingTemplate();
    this.loadAllExamTemplates();
    this.loadAllTrainingTemplateFormatTypes();
    this.loadAllTrainingTemplateStatus();

    super.ngAfterViewInit();
  }

  loadAllTrainingTemplateStatus(): void {
    this.trainingTemplateService.getAllTrainingTemplateStatus().subscribe({
      next: data => {
        this.allTrainingTemplateStatus = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAllTrainingTemplateFormatTypes(): void {
    this.trainingTemplateService.getAllTrainingTemplateFormatTypes().subscribe({
      next: data => {
        this.allTrainingTemplateFormats = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAllTrainingTypes(): void {
    this.trainingTypeService.getIdNameList().subscribe({
      next: data => {
        this.allTrainingTypes = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAllCertificateTemplatesUnattachedTrainingTemplate(): void {
    this.certificateTemplateService.getAllCertificateTemplatesUnattachedTrainingTemplate().subscribe({
      next: data => {
        this.allCertificateTemplatesUnattachedTrainingTemplate.push(...data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAllExamTemplates(): void {
    this.examTemplateService.getIdNameList().subscribe({
      next: data => {
        this.allExamTemplates = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadTrainingTemplateDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.trainingTemplateService.getTrainingTemplate(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.loadTrainingTemplateDetailSuccessHandler(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  private loadTrainingTemplateDetailSuccessHandler(data: TrainingTemplateModel): void {
    this.trainingTemplate = data;
    this.updateChildComponentTable();
    this.allCertificateTemplatesUnattachedTrainingTemplate.unshift(...data.certificateTemplates);
  }

  updateChildComponentTable(): void {
    this.updateTrainingTemplateModuleTemplateTableComponent();
    this.updateTrainingTemplateSyllabusTemplateTableComponent();
  }

  updateTrainingTemplateModuleTemplateTableComponent(): void {
    this.trainingTemplateModuleTemplateTableComponent.trainingTemplate = this.trainingTemplate;
    this.trainingTemplateModuleTemplateTableComponent.updateModuleTemplateDataSource();
  }

  updateTrainingTemplateSyllabusTemplateTableComponent(): void {
    if (!this.trainingTemplateSyllabusTemplateTableComponent) {
      return;
    }

    this.trainingTemplateSyllabusTemplateTableComponent.trainingTemplate = this.trainingTemplate;
    this.trainingTemplateSyllabusTemplateTableComponent.updateSyllabusTemplateDataSource();
  }

  createForm() {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      code: ['', [Validators.required, this.noWhitespaceValidator]],
      description: ['', []],
      trainingType: ['', [Validators.required]],
      examTemplate: ['', []],
      certificateTemplate: ['', []],
      format: ['', [Validators.required]],
      status: ['', [Validators.required]],
      selfEnrollmentEnabled: [{ value: false, disabled: this.dialogParams?.isView }, [Validators.required]],
      registrationLimitRecommendation: [
        '',
        [
          Validators.required,
          Validators.min(this.MIN_REGISTRATION_LIMIT_RECOMMENDATION),
          Validators.max(this.MAX_REGISTRATION_LIMIT_RECOMMENDATION),
        ],
      ],
    });

    this.createSelfEnrollmentEnabledChangeHandler();
  }

  createSelfEnrollmentEnabledChangeHandler(): void {
    this.getValidator('selfEnrollmentEnabled').valueChanges.subscribe({
      next: enable => {
        const registrationLimitRecommendationValidator = this.getValidator('registrationLimitRecommendation'),
          value: number = this.trainingTemplate.trainingTemplateSelfEnrollmentSettings.defaultRegistrationLimit,
          defaultValue: number = 10;

        if (enable) {
          registrationLimitRecommendationValidator.enable();

          if (!value) {
            registrationLimitRecommendationValidator.setValue(defaultValue);
          }
        } else {
          registrationLimitRecommendationValidator.setValue(0);
          registrationLimitRecommendationValidator.disable();
        }
      },
    });
  }

  createOrSaveTrainingTemplate() {
    this.modalForm.markAllAsTouched();

    this.modalForm.patchValue({
      trainingCategory: this.trainingTemplate.trainingCategory,
      trainingModuleTemplates: this.trainingTemplate.trainingModuleTemplates,
    });

    if (this.validateForm() && this.checkTrainingHasCategory() && this.checkTrainingHasModules()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  private checkTrainingHasModules(): boolean {
    const trainingsHasModules: boolean = Object.assign(
      new TrainingTemplateModel(),
      this.trainingTemplate,
    ).checkTrainingTemplateHasModule();

    if (trainingsHasModules) {
      return true;
    }

    const message = this.localization.getLocalTextFromKey('trainingTemplateEmptyModulesErrorMessage');
    this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);

    return false;
  }

  private checkTrainingHasCategory(): boolean {
    const trainingHasCategory = this.trainingTemplate.trainingCategory?.id != null;

    if (trainingHasCategory) {
      return true;
    }

    const message = this.localization.getLocalTextFromKey('trainingTemplateEmptyCategoryErrorMessage');
    this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);

    return false;
  }

  create() {
    this.trainingTemplateService
      .create(this.trainingTemplate)
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

  update() {
    this.trainingTemplateService
      .update(this.trainingTemplate)
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

  errorHandler(error) {
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

  setFormatToTrainingAndModules(format: StandardEnumModel): void {
    if (this.dialogParams?.isView) {
      return;
    }

    this.trainingTemplate.format = format;

    this.trainingTemplate.trainingModuleTemplates
      .filter(module => !module.isDeleted)
      .forEach(module => {
        module.format = format;
        module.isUpdated = true;
      });
  }

  getFormatModulesCountList(): Array<string> {
    const formatModulesCountList: Array<string> = [];

    const formatModulesCountMap = new Map<string, number>();

    this.trainingTemplate.trainingModuleTemplates
      .map(module => module.format)
      .forEach(format => {
        let localFormatName = format?.[this.localEnumField],
          newFormatCount = 1;

        if (formatModulesCountMap.has(localFormatName)) {
          newFormatCount = formatModulesCountMap.get(localFormatName) + 1;
        }

        formatModulesCountMap.set(localFormatName, newFormatCount);
      });

    for (const formatModulesCount of formatModulesCountMap.entries()) {
      formatModulesCountList.push(
        formatModulesCount[0] +
          ': ' +
          formatModulesCount[1] +
          ' ' +
          this.localization.getLocalTextFromKey('trainingTemplateSelectedFormatsModules'),
      );
    }

    return formatModulesCountList;
  }

  uniquenessErrorHandler(content) {
    content.errorCauses.forEach(errorCause => {
      switch (errorCause.field) {
        case 'code':
          this.setErrorOnValidator('code', content.type);
          break;
      }
    });
  }

  getModuleCount(): number {
    return this.getNotDeletedModules().length;
  }

  getNotDeletedModules(): Array<ModuleTemplateModel> {
    return this.trainingTemplate.trainingModuleTemplates.filter(module => !module.isDeleted);
  }

  changeOrderBtnDisabled(): boolean {
    return this.trainingTemplate.trainingModuleTemplates.length <= 1;
  }

  openChangeOrderModal(): void {
    const modalRef = this.newModal.open(DragOrderModalComponent, {
      data: {
        title: this.localization.getLocalTextFromKey('changeModuleOrderTitle'),
        dragModelList: this.getNotDeletedModules(),
      },
    });

    this.closeChangeOrderModalHandler(modalRef);
  }

  closeChangeOrderModalHandler(modalRef: MatDialogRef<DragOrderModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.setNewOrder(data.newOrderedObjectList);
        }
      },
      error: e => {
        this.errorHandler(e);
      },
    });
  }

  private setNewOrder(newOrderedObjectList: Array<DragOrderModel>) {
    this.trainingTemplate.trainingModuleTemplates = this.dragOrderService.processSettingOrder(
      this.trainingTemplate.trainingModuleTemplates,
      newOrderedObjectList,
    );
    this.trainingTemplate.trainingModuleTemplates.forEach(module => {
      if (!module.isCreated && !module.isDeleted) {
        module.isUpdated = true;
      }
    });
    this.updateChildComponentTable();
  }

  getTrainerCategoryAndTrainerIds(
    categories: Array<StandardNameIdModel>,
    trainers: Array<StandardNameIdModel>,
  ): Array<string> {
    const categoryIds: Array<string> = categories ? categories.map(category => category.id) : [],
      trainerIds: Array<string> = trainers ? trainers.map(template => template.id) : [];

    return [...categoryIds, ...trainerIds];
  }

  openSelectionTrainingCategory(): void {
    const modalRef = this.newModal.open(CommonTreeSelectionModalComponent, {
      data: {
        selectedNodesId: [this.trainingTemplate?.trainingCategory?.id],
        loadTreeDataObs: this.trainingCategoryService.listWithoutTrainingTemplates(),
        modalTitle: this.localization.getLocalTextFromKey('trainingCategorySelectionPageTitle'),
        treeSelectionType: TreeSelectionTypeEnum.SINGLE_PARENT_NODE_SELECTION,
        isView: this.dialogParams?.isView,
      },
    });

    this.closeSelectionTrainingCategoriesHandler(modalRef);
  }

  openSelectionMainTrainersAndTrainerCategories(): void {
    const modalRef = this.newModal.open(CommonTreeSelectionModalComponent, {
      data: {
        selectedNodesId: this.getTrainerCategoryAndTrainerIds(
          this.trainingTemplate.mainTrainerCategories,
          this.trainingTemplate.mainTrainers,
        ),
        loadTreeDataObs: this.trainerCategoryService.listWithTrainers(),
        modalTitle: this.localization.getLocalTextFromKey('trainerCategorySelectionPageTitle'),
        treeSelectionType: TreeSelectionTypeEnum.MULTI_PARENT_NODE_SELECTION,
        isView: this.dialogParams?.isView,
      },
    });

    this.closeSelectionTrainersAndTrainerCategoriesHandler(modalRef, true);
  }

  openSelectionLinearTrainersAndTrainerCategories(): void {
    const modalRef = this.newModal.open(CommonTreeSelectionModalComponent, {
      data: {
        selectedNodesId: this.getTrainerCategoryAndTrainerIds(
          this.trainingTemplate.linearTrainerCategories,
          this.trainingTemplate.linearTrainers,
        ),
        loadTreeDataObs: this.trainerCategoryService.listWithTrainers(),
        modalTitle: this.localization.getLocalTextFromKey('trainerCategorySelectionPageTitle'),
        treeSelectionType: TreeSelectionTypeEnum.MULTI_PARENT_NODE_SELECTION,
        isView: this.dialogParams?.isView,
      },
    });

    this.closeSelectionTrainersAndTrainerCategoriesHandler(modalRef, false);
  }

  closeSelectionTrainingCategoriesHandler(modalRef: MatDialogRef<CommonTreeSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          const minLevelNodeTrainingCategory: StandardNameIdModel = modalRef.componentInstance.getMinLevelNode(
            data.result,
          );

          this.parseMinLevelNodeTrainingCategory(minLevelNodeTrainingCategory);
        }
      },
      error: e => {
        this.errorHandler(e);
      },
    });
  }

  parseMinLevelNodeTrainingCategory(minLevelNodeTrainingCategory: StandardNameIdModel): void {
    const trainingCategory: TrainingCategoryModel = new TrainingCategoryModel();

    trainingCategory.id = minLevelNodeTrainingCategory.id;
    trainingCategory.name = minLevelNodeTrainingCategory.name;

    this.trainingTemplate.trainingCategory = trainingCategory;
  }

  closeSelectionTrainersAndTrainerCategoriesHandler(
    modalRef: MatDialogRef<CommonTreeSelectionModalComponent>,
    isMainSelected: boolean,
  ): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.fillSelectedTrainersAndTrainerCategories(data.result, isMainSelected);
        }
      },
      error: e => {
        this.errorHandler(e);
      },
    });
  }

  fillSelectedTrainersAndTrainerCategories(
    selectedInHierarchy: Array<StandardFlatNodeModel>,
    isMainSelected: boolean,
  ): void {
    const newSelectedTrainers: Array<StandardNameIdModel> = [],
      newSelectedTrainerCategories: Array<StandardNameIdModel> = [];

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
        newSelectedTrainers.push(newSelected);
      } else {
        newSelectedTrainerCategories.push(newSelected);
      }
    }

    if (isMainSelected) {
      this.trainingTemplate.mainTrainers = newSelectedTrainers;
      this.trainingTemplate.mainTrainerCategories = newSelectedTrainerCategories;
    } else {
      this.trainingTemplate.linearTrainers = newSelectedTrainers;
      this.trainingTemplate.linearTrainerCategories = newSelectedTrainerCategories;
    }
  }

  getSelectedDataInHierarchy(selectedInHierarchy: Array<StandardFlatNodeModel>): Array<StandardNameIdModel> {
    const newSelectedData: Array<StandardNameIdModel> = [];

    selectedInHierarchy.forEach(selected => {
      newSelectedData.push({
        id: selected.id,
        name: selected.name,
      });
    });

    return newSelectedData;
  }

  openCertificateTemplateHistoryModal(): void {
    this.newModal.open(TrainingTemplateCertificateTemplateHistoryModalComponent, {
      data: {
        certificateTemplate: this.trainingTemplate,
      },
    });
  }

  checkCertificateTemplateDisabled(targetCertificateTemplate: CertificateTemplateModel): boolean {
    if (this.dialogParams?.isView) {
      return true;
    }

    const selectedCertificateTemplates: Array<CertificateTemplateModel> = this.trainingTemplate.certificateTemplates,
      certificateTemplateLimit: number = 5,
      isMaxLimit: boolean = selectedCertificateTemplates.length >= certificateTemplateLimit,
      targetNotSelectedYet: boolean = !selectedCertificateTemplates.includes(targetCertificateTemplate);

    return isMaxLimit && targetNotSelectedYet;
  }
}
