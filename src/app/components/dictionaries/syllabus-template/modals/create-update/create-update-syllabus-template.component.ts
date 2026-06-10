import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { DragOrderModalComponent } from '@common-drag-order-modal/drag-order-modal.component';
import { DragOrderModel } from '@common-drag-order-modal-models/drag-order.model';
import { DragOrderService } from '@common-drag-order-modal-services/drag-order.service';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { SyllabusTemplateTrainingTemplateTableComponent } from '@syllabus-template-modals-training-template-table/syllabus-template-training-template-table.component';
import { SyllabusTemplateModel } from '@syllabus-template-models/syllabus-template.model';
import { SyllabusTemplateService } from '@syllabus-template-services/syllabus-template.service';
import { TrainingCategoryService } from '@training-category-services/training-category.service';

@Component({
  selector: 'app-create-update-syllabus-template',
  templateUrl: './create-update-syllabus-template.component.html',
  styleUrls: ['./create-update-syllabus-template.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateSyllabusTemplateComponent
  extends CommonCreateUpdateComponents<SyllabusTemplateModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;
  @ViewChild(SyllabusTemplateTrainingTemplateTableComponent)
  syllabusTemplateTrainingTemplateTableComponent: SyllabusTemplateTrainingTemplateTableComponent;

  public syllabusTemplate: SyllabusTemplateModel = new SyllabusTemplateModel();
  public allTrainingCategories: Array<StandardNameIdModel> = [];

  constructor(
    private syllabusTemplateService: SyllabusTemplateService,
    private trainingCategoryService: TrainingCategoryService,
    private dragOrderService: DragOrderService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadSyllabusTemplateDetail();
    this.loadTrainingCategories();
  }

  loadTrainingCategories(): void {
    this.trainingCategoryService.getFirstLevelList().subscribe({
      next: data => {
        this.allTrainingCategories = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadSyllabusTemplateDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.syllabusTemplateService.getSyllabusTemplate(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.syllabusTemplate = data;
          this.updateChildComponentTable();
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  updateChildComponentTable(): void {
    this.syllabusTemplateTrainingTemplateTableComponent.syllabusTemplate = this.syllabusTemplate;
    this.syllabusTemplateTrainingTemplateTableComponent.updateTrainingTemplateDataSource();
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      code: ['', [Validators.required, this.noWhitespaceValidator]],
      description: ['', [Validators.required, this.noWhitespaceValidator]],
      syllabusCategory: ['', [Validators.required]],
    });
  }

  createOrSaveSyllabusTemplate(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.checkSyllabus();
    }
  }

  private checkSyllabus(): void {
    const syllabusTemplateModel = Object.assign(new SyllabusTemplateModel(), this.syllabusTemplate),
      syllabusHaveTrainings: boolean = syllabusTemplateModel.checkSyllabusTemplateHasTraining(),
      syllabusTrainingsHaveMinMaxBreak: boolean = syllabusTemplateModel.checkSyllabusTemplateTrainingHasMinMaxBreak();

    if (!syllabusHaveTrainings) {
      const message = this.localization.getLocalTextFromKey('syllabusTemplateEmptyTrainingsModulesErrorMessage');
      this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);
      return;
    }
    if (!syllabusTrainingsHaveMinMaxBreak) {
      const message = this.localization.getLocalTextFromKey('syllabusTemplateEmptyTrainingsMinMaxBreakErrorMessage');
      this.showSnackBarWithMessage(message, SnackBarTypeEnum.ERROR);
      return;
    }

    this.startCreateHandler();
    this.dialogParams?.isUpdate ? this.update() : this.create();
  }

  create(): void {
    this.syllabusTemplateService
      .create(this.syllabusTemplate)
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
    this.syllabusTemplateService
      .update(this.syllabusTemplate)
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
        case 'code':
          this.setErrorOnValidator('code', content.type);
          break;
      }
    });
  }

  getModuleCount(): number {
    let moduleCount: number = 0;

    this.syllabusTemplate.trainingTemplates.forEach(training => {
      moduleCount += Number(training.moduleCount);
    });

    return moduleCount;
  }

  changeOrderBtnDisabled(): boolean {
    return this.syllabusTemplate.trainingTemplates.length <= 1;
  }

  openChangeOrderModal(): void {
    const modalRef = this.newModal.open(DragOrderModalComponent, {
      data: {
        title: this.localization.getLocalTextFromKey('changeTrainingOrderTitle'),
        dragModelList: this.syllabusTemplate.trainingTemplates,
      },
    });

    this.closeChangeOrderModalHandler(modalRef);
  }

  closeChangeOrderModalHandler(modalRef: MatDialogRef<DragOrderModalComponent>): void {
    modalRef.afterClosed().subscribe(result => {
      if (result) {
        this.setNewOrder(result.newOrderedObjectList);
      }
    });
  }

  private setNewOrder(newOrderedObjectList: Array<DragOrderModel>): void {
    this.syllabusTemplate.trainingTemplates = this.dragOrderService.processSettingOrder(
      this.syllabusTemplate.trainingTemplates,
      newOrderedObjectList,
    );
    this.updateChildComponentTable();
  }
}
