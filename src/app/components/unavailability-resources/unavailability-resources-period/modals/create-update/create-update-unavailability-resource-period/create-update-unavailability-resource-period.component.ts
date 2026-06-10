import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CommonTreeComponent } from '@common-tree/common-tree.component';
import { TreeSelectionTypeEnum } from '@common-tree-models/tree-selection-type.enum';
import { ResourceCheckErrorCauseModel } from '@event-models/resource-check-error-cause.model';
import { SnackbarInfoComponent } from '@event-snackbar-info/snackbar-info.component';
import { GanttFilterService } from '@gantt-modals-filter-selection-services/gantt-filter.service';
import { GanttResourceGroupType } from '@gantt-models/gantt-resource-group-type.model';
import { UnavailabilityResourcesLabelModel } from '@unavailability-resources-label-models/unavailability-resources-label.model';
import { UnavailabilityResourcesLabelService } from '@unavailability-resources-label-services/unavailability-resources-label.service';
import { UnavailabilityResourcePeriodModel } from '@unavailability-resources-period-models/unavailability-resource-period.model';
import { UnavailabilityResourcesPeriodService } from '@unavailability-resources-period-services/unavailability-resources-period.service';
import moment, { Moment } from 'moment/moment';

@Component({
  selector: 'app-create-update-unavailability-resource-period',
  templateUrl: './create-update-unavailability-resource-period.component.html',
  styleUrls: ['./create-update-unavailability-resource-period.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateUnavailabilityResourcePeriodComponent
  extends CommonCreateUpdateComponents<UnavailabilityResourcePeriodModel>
  implements OnInit
{
  readonly TRAINER_GROUP: GanttResourceGroupType = GanttResourceGroupType.TRAINER_GROUP;
  readonly ROOM_GROUP: GanttResourceGroupType = GanttResourceGroupType.ROOM_GROUP;
  readonly EQUIPMENT_GROUP: GanttResourceGroupType = GanttResourceGroupType.EQUIPMENT_GROUP;
  readonly treeSelectionType = this.dialogParams?.isUpdate
    ? TreeSelectionTypeEnum.ONLY_CHILD_SINGLE_SELECTION
    : TreeSelectionTypeEnum.STANDARD_MULTI_SELECTION;

  public unavailabilityResourcePeriod: UnavailabilityResourcePeriodModel = new UnavailabilityResourcePeriodModel();
  public allUnavailabilityResourceLabels: Array<UnavailabilityResourcesLabelModel> = [];
  public selectedUnavailabilityLabelTrainer: UnavailabilityResourcesLabelModel = null;
  public selectedUnavailabilityLabelRoom: UnavailabilityResourcesLabelModel = null;
  public selectedUnavailabilityLabelEquipment: UnavailabilityResourcesLabelModel = null;
  public selectedResources: Array<StandardNameIdModel> = [];

  @ViewChild('roomTree') roomTreeComponent: CommonTreeComponent;
  @ViewChild('trainerTree') trainerTreeComponent: CommonTreeComponent;
  @ViewChild('equipmentTree') equipmentTreeComponent: CommonTreeComponent;
  @ViewChild('toggleGroup') toggleGroup: MatButtonToggleGroup;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public readyToHide: boolean = false;

  constructor(
    injector: Injector,
    private unavailabilityResourcesPeriodService: UnavailabilityResourcesPeriodService,
    public ganttFilterService: GanttFilterService,
    private unavailabilityResourcesLabelService: UnavailabilityResourcesLabelService,
  ) {
    super(injector);
    this.createForm();
    setTimeout(() => (this.readyToHide = true));
  }

  getSelectedLabelBySelectedGroup(): UnavailabilityResourcesLabelModel {
    switch (this.toggleGroup?.value) {
      case GanttResourceGroupType.ROOM_GROUP:
        return this.selectedUnavailabilityLabelRoom;
      case GanttResourceGroupType.TRAINER_GROUP:
        return this.selectedUnavailabilityLabelTrainer;
      case GanttResourceGroupType.EQUIPMENT_GROUP:
        return this.selectedUnavailabilityLabelEquipment;
      default:
        return null;
    }
  }

  setLabelBySelectedGroup(label: UnavailabilityResourcesLabelModel): void {
    switch (this.toggleGroup?.value) {
      case GanttResourceGroupType.ROOM_GROUP: {
        this.selectedUnavailabilityLabelRoom = label;
        break;
      }
      case GanttResourceGroupType.TRAINER_GROUP: {
        this.selectedUnavailabilityLabelTrainer = label;
        break;
      }
      case GanttResourceGroupType.EQUIPMENT_GROUP: {
        this.selectedUnavailabilityLabelEquipment = label;
        break;
      }
    }
  }

  getLabelsByGroup(): Array<UnavailabilityResourcesLabelModel> {
    return this.allUnavailabilityResourceLabels.filter(label => label.groupResource.id === this.toggleGroup?.value);
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      label: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    });

    this.modalForm.setValidators([this.startAfterEndValidator()]);
  }

  startAfterEndValidator(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors => {
      const startDateControl = formGroup.controls['startDate'],
        endDateControl = formGroup.controls['endDate'],
        errorCode = 'startDateAfterEnd';

      if (startDateControl.hasError('required') || endDateControl.hasError('required')) {
        return null;
      }

      const start: Moment = moment(startDateControl.value),
        end: Moment = moment(endDateControl.value);

      const checkStartAfterEnd: boolean = start.isAfter(end);

      this.changeControlError(startDateControl, errorCode, checkStartAfterEnd);
      this.changeControlError(endDateControl, errorCode, checkStartAfterEnd);

      return null;
    };
  }

  isStartAfterEnd(): boolean {
    return (
      this.getValidator('startDate').hasError('startDateAfterEnd') ||
      this.getValidator('endDate').hasError('startDateAfterEnd')
    );
  }

  ngOnInit(): void {
    this.loadUnavailabilityResourcePeriodDetail();
    this.loadAllUnavailabilityResourceLabels();
  }

  loadAllUnavailabilityResourceLabels(): void {
    this.unavailabilityResourcesLabelService.list().subscribe({
      next: data => {
        this.allUnavailabilityResourceLabels = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadUnavailabilityResourcePeriodDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.unavailabilityResourcesPeriodService
        .getUnavailabilityResourcePeriodById(this.dialogParams?.model?.id)
        .subscribe({
          next: data => {
            this.afterLoadDetailHandler(data);
          },
          error: e => {
            this.errorResponseHandler(e);
          },
        });
    }
  }

  afterLoadDetailHandler(data: UnavailabilityResourcePeriodModel): void {
    this.unavailabilityResourcePeriod = data;
    this.toggleGroup.value = this.unavailabilityResourcePeriod?.unavailabilityResourceLabel?.groupResource?.id;
    this.setLabelBySelectedGroup(this.unavailabilityResourcePeriod.unavailabilityResourceLabel);
    this.setTreeSelectedNodes();
  }

  collectDataBeforeCreate(): void {
    this.collectSelectedResources();
    this.collectLabel();
  }

  setTreeSelectedNodes(): void {
    const resourceTree: CommonTreeComponent = this.getResourcesTreeBySelectedGroup();

    resourceTree.selectedNodesId = [this.unavailabilityResourcePeriod.resource.id];
    resourceTree.selectNodeBySelectedNodesId();
  }

  collectLabel(): void {
    this.unavailabilityResourcePeriod.unavailabilityResourceLabel = this.getSelectedLabelBySelectedGroup();
  }

  convertStartEndDate(): void {
    this.unavailabilityResourcePeriod.startDate = moment(this.unavailabilityResourcePeriod.startDate)?.utc(true);
    this.unavailabilityResourcePeriod.endDate = moment(this.unavailabilityResourcePeriod.endDate)?.utc(true);
  }

  getResourcesTreeBySelectedGroup(): CommonTreeComponent {
    let selectedTree: CommonTreeComponent = null;

    switch (this.toggleGroup.value) {
      case this.TRAINER_GROUP: {
        selectedTree = this.trainerTreeComponent;
        break;
      }
      case this.ROOM_GROUP: {
        selectedTree = this.roomTreeComponent;
        break;
      }
      case this.EQUIPMENT_GROUP: {
        selectedTree = this.equipmentTreeComponent;
        break;
      }
    }

    return selectedTree;
  }

  collectSelectedResources(): void {
    let selectedTree: CommonTreeComponent = this.getResourcesTreeBySelectedGroup(),
      selectedResources: Array<StandardNameIdModel> = [];

    if (selectedTree) {
      selectedResources = this.collectSelectedTreeItems(selectedTree);
    }

    this.selectedResources = selectedResources;
  }

  collectSelectedTreeItems(tree: CommonTreeComponent): Array<StandardNameIdModel> {
    return tree
      .getSelectedNodes()
      .filter(data => data.unextendable)
      .map(data => Object.assign(new StandardNameIdModel(), data));
  }

  validateCollectedData(): boolean {
    return this.validateForm() && this.checkResources();
  }

  checkResources(): boolean {
    if (!this.selectedResources || this.selectedResources.length === 0) {
      const errorMessage: string = this.localization.getLocalTextFromKey(
        'resourceUnavailabilityPeriodModalEmptyResourceError',
      );

      this.showSnackBarWithMessage(errorMessage, SnackBarTypeEnum.ERROR);

      return false;
    }

    return true;
  }

  createOrSaveUnavailabilityResourceLabel(): void {
    this.modalForm.markAllAsTouched();

    this.collectDataBeforeCreate();

    if (this.validateCollectedData()) {
      this.convertStartEndDate();
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  getUnavailabilityResourcePeriods(): Array<UnavailabilityResourcePeriodModel> {
    return this.selectedResources.map(selectedResource => {
      const unavailabilityResourcePeriod: UnavailabilityResourcePeriodModel = Object.assign(
        new UnavailabilityResourcePeriodModel(),
        this.unavailabilityResourcePeriod,
      );

      unavailabilityResourcePeriod.resource = selectedResource;

      return unavailabilityResourcePeriod;
    });
  }

  create(): void {
    const unavailabilityResourcePeriods: Array<UnavailabilityResourcePeriodModel> =
      this.getUnavailabilityResourcePeriods();

    this.unavailabilityResourcesPeriodService
      .create(unavailabilityResourcePeriods)
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
    const unavailabilityResourcePeriod: UnavailabilityResourcePeriodModel = this.getUnavailabilityResourcePeriods()[0];

    this.unavailabilityResourcesPeriodService
      .update(unavailabilityResourcePeriod)
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
    const resourceCheckErrorCauseList: Array<ResourceCheckErrorCauseModel> = [];

    if (!contents || contents.length <= 0) {
      this.errorResponseHandler(error);
      return;
    }

    contents.forEach(content => {
      switch (content.type) {
        case EntityExceptionEnum.RESOURCE_CHECK_EXCEPTION_CONTENT: {
          resourceCheckErrorCauseList.push(...content.errorCauses);
          break;
        }
        default:
          this.errorResponseHandler(error);
      }
    });

    this.hideLoadPage();
    this.showEventCreateResourceBusySnackBar(resourceCheckErrorCauseList);
  }

  private showEventCreateResourceBusySnackBar(resourceCheckErrorCauseList: Array<ResourceCheckErrorCauseModel>): void {
    if (resourceCheckErrorCauseList?.length === 0) {
      return;
    }

    this.showSnackBarWithMessage(
      this.localization.getLocalTextFromKey('unavailableResourceCreateErrorsSnackBarMessage'),
      SnackBarTypeEnum.ERROR,
      {
        timeOut: 0,
        toastComponent: SnackbarInfoComponent,
        payload: {
          data: resourceCheckErrorCauseList,
          self: this,
        },
      },
    );
  }
}
