import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { EntityExceptionEnum } from '@common-models/response-exceptions/entity-exception.enum';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { EquipmentChildTableComponent } from '@equipment-modals-child-table/equipment-child-table.component';
import { EquipmentModel } from '@equipment-models/equipment.model';
import { EquipmentService } from '@equipment-services/equipment.service';
import { ResourceCheckErrorCauseModel } from '@event-models/resource-check-error-cause.model';
import { SnackbarInfoComponent } from '@event-snackbar-info/snackbar-info.component';
import { LocationModel } from '@location-models/location.model';
import { LocationService } from '@location-services/location.service';
import { RoomModel } from '@room-models/room.model';
import { RoomService } from '@room-services/room.service';

@Component({
  selector: 'app-create-update-room-modal',
  templateUrl: './create-update-room-modal.component.html',
  styleUrls: ['./create-update-room-modal.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class CreateUpdateRoomModalComponent extends CommonCreateUpdateComponents<RoomModel> implements OnInit {
  @ViewChild('modal') modalComponent: CommonModalComponent;

  @ViewChild(EquipmentChildTableComponent) equipmentChildTableComponent: EquipmentChildTableComponent;
  public room: RoomModel = new RoomModel();
  public locations: Array<LocationModel> = [];
  public allRoomStatus: Array<StandardEnumModel>;

  constructor(
    private equipmentService: EquipmentService,
    private roomService: RoomService,
    public locationService: LocationService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  ngOnInit(): void {
    this.loadRoomDetail();
    this.loadLocations();
    this.loadAllRoomStatus();
  }

  loadAllRoomStatus(): void {
    this.roomService.getAllRoomStatus().subscribe({
      next: data => {
        this.allRoomStatus = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadLocations(): void {
    this.locationService.list().subscribe({
      next: data => {
        this.locations = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  loadRoomDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.roomService.getRoom(this.dialogParams?.model?.id).subscribe({
        next: data => {
          this.acceptRoomData(data);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      });
    }
  }

  acceptRoomData(data: RoomModel): void {
    this.room = data;
    this.loadBuiltInEquipmentByRoomId(this.room.id);
  }

  loadBuiltInEquipmentByRoomId(id: string): void {
    this.equipmentService.getEquipmentsByRoomIds(id).subscribe({
      next: data => {
        this.updateEquipmentChildTable({ data: data });
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  updateEquipmentChildTable({ data }: { data: Array<EquipmentModel> }): void {
    this.equipmentChildTableComponent.updateEquipmentDataSource(data);
  }

  createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      description: [''],
      capacity: ['', [Validators.required, Validators.min(0)]],
      quadrature: ['', [Validators.required]],
      location: [{ value: '', disabled: this.dialogParams?.isView }, [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  createOrSaveRoom(): void {
    this.modalForm.markAllAsTouched();

    if (this.validateForm()) {
      this.startCreateHandler();
      this.dialogParams?.isUpdate ? this.update() : this.create();
    }
  }

  create(): void {
    this.roomService
      .create(this.room)
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
    this.roomService
      .update(this.room)
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
        case EntityExceptionEnum.UNIQUENESS_CHECK_EXCEPTION_CONTENT: {
          this.uniquenessErrorHandler(content);
          break;
        }
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

  uniquenessErrorHandler(content): void {
    content.errorCauses.forEach(errorCause => {
      switch (errorCause.field) {
        case 'name': {
          this.setErrorOnValidator('name', content.type);
          break;
        }
        case 'location_id': {
          this.setErrorOnValidator('location', content.type);
          break;
        }
      }
    });
  }

  private showEventCreateResourceBusySnackBar(resourceCheckErrorCauseList: Array<ResourceCheckErrorCauseModel>): void {
    if (!resourceCheckErrorCauseList || resourceCheckErrorCauseList.length === 0) {
      return;
    }

    this.showSnackBarWithMessage(
      this.localization.getLocalTextFromKey('roomBusySnackBarMessage'),
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

  getLocationName(location: LocationModel): string {
    return location.name + ' (' + location.address + ')';
  }

  updateUniquenessCheckErrorState(): void {
    this.changeControlError(this.getValidator('name'), EntityExceptionEnum.UNIQUENESS_CHECK_EXCEPTION_CONTENT, false);
    this.changeControlError(
      this.getValidator('location'),
      EntityExceptionEnum.UNIQUENESS_CHECK_EXCEPTION_CONTENT,
      false,
    );
  }
}
