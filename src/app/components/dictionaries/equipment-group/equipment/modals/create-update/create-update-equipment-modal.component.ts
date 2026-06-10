import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { EquipmentCategoryModel } from '@equipment-category-models/equipment-category.model';
import { EquipmentCategoryService } from '@equipment-category-services/equipment-category.service';
import { EquipmentModel } from '@equipment-models/equipment.model';
import { EquipmentType } from '@equipment-models/equipment-type';
import { EquipmentService } from '@equipment-services/equipment.service';
import { ResourceCheckErrorCauseModel } from '@event-models/resource-check-error-cause.model';
import { SnackbarInfoComponent } from '@event-snackbar-info/snackbar-info.component';
import { RoomModel } from '@room-models/room.model';
import { RoomService } from '@room-services/room.service';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-update-equipment-modal.component.html',
  styleUrls: ['./create-update-equipment-modal.component.scss', '../../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateEquipmentModalComponent
  extends CommonCreateUpdateComponents<EquipmentModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public equipment: EquipmentModel = new EquipmentModel();
  public rooms: Array<RoomModel> = [];
  public categories: Array<EquipmentCategoryModel> = [];
  public allEquipmentTypes: Array<StandardEnumModel>;
  public allEquipmentStatuses: Array<StandardEnumModel>;

  readonly EQUIPMENT_TYPE: typeof EquipmentType = EquipmentType;

  constructor(
    private equipmentService: EquipmentService,
    private roomService: RoomService,
    private equipmentCategoryService: EquipmentCategoryService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadEquipmentDetail();
    this.loadRooms();
    this.loadEquipmentCategory();
    this.loadAllEquipmentTypes();
    this.loadAllEquipmentStatuses();
  }

  loadEquipmentDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.equipmentService.getEquipment(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.equipment = data;
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  loadRooms(): void {
    this.roomService.getIdNameList().subscribe({
      next: data => {
        this.rooms = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadEquipmentCategory(): void {
    this.equipmentCategoryService.getIdNameList().subscribe({
      next: data => {
        this.categories = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAllEquipmentTypes(): void {
    this.equipmentService.getAllEquipmentTypes().subscribe({
      next: data => {
        this.allEquipmentTypes = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadAllEquipmentStatuses(): void {
    this.equipmentService.getAllEquipmentStatuses().subscribe({
      next: data => {
        this.allEquipmentStatuses = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      type: ['', [Validators.required]],
      status: ['', [Validators.required]],
      quantity: [
        '',
        [Validators.required, Validators.min(this.DEFAULT_MIN_NUM_VALUE), Validators.max(this.DEFAULT_MAX_NUM_VALUE)],
      ],
      room: [
        {
          value: '',
          disabled: this.dialogParams?.isView || this.dialogParams?.model?.type?.id !== EquipmentType.BUILT_IN,
        },
      ],
      equipmentCategory: ['', [Validators.required]],
      code: ['', [Validators.required, this.noWhitespaceValidator]],
      description: ['', []],
    });
  }

  isNotValidRoom(): boolean {
    const equipmentType = this.equipment?.type,
      room = this.equipment?.room;

    if (equipmentType && equipmentType.id === this.EQUIPMENT_TYPE.BUILT_IN && !room) {
      return true;
    }

    return false;
  }

  createOrSaveEquipment(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create(): void {
    this.equipmentService
      .create(this.equipment)
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
    this.equipmentService
      .update(this.equipment)
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

  changeType(equipmentType): void {
    if (this.dialogParams?.isView || this.dialogParams?.isUpdate) {
      return;
    }

    const roomValidator = this.getValidator('room');
    this.equipment.type = equipmentType;

    switch (equipmentType.id) {
      case EquipmentType.PORTABLE: {
        this.equipment.room = null;
        roomValidator.disable();
        break;
      }
      case EquipmentType.BUILT_IN: {
        roomValidator.enable();
        break;
      }
    }
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
        case EntityExceptionEnum.UNIQUENESS_CHECK_EXCEPTION_CONTENT: {
          this.uniquenessErrorHandler(content);
          break;
        }
        case EntityExceptionEnum.RESOURCE_CHECK_EXCEPTION_CONTENT: {
          resourceCheckErrorCauseList.push(...content.errorCauses);
          this.showEventCreateResourceBusySnackBar(resourceCheckErrorCauseList);
          break;
        }
        default:
          this.errorResponseHandler(error);
      }
    });

    this.hideLoadPage();
  }

  private showEventCreateResourceBusySnackBar(resourceCheckErrorCauseList: Array<ResourceCheckErrorCauseModel>): void {
    this.showSnackBarWithMessage(
      this.localization.getLocalTextFromKey('equipmentBusySnackBarMessage'),
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

  uniquenessErrorHandler(content): void {
    content.errorCauses.forEach(errorCause => {
      switch (errorCause.field) {
        case 'code':
          this.setErrorOnValidator('code', content.type);
          break;
      }
    });
  }
}
