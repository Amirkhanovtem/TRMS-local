import { Component, Injector, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { DisplayedColumnInterface } from '@common-table-models/displayed-column.interface';
import { DisplayedColumnTypeEnum } from '@common-table-models/displayed-column-type.enum';
import { TableWrapperComponent } from '@common-table-table-wrapper/table-wrapper.component';
import { TableWrapperColumnDirective } from '@common-table-table-wrapper-directives/table-wrapper-column.directive';
import { CommonTreeSelectionModalComponent } from '@common-tree-modals-selection/common-tree-selection-modal.component';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { TreeSelectionTypeEnum } from '@common-tree-models/tree-selection-type.enum';
import { CreateUpdateEquipmentModalComponent } from '@equipment-modals-create-update/create-update-equipment-modal.component';
import { EquipmentModel } from '@equipment-models/equipment.model';
import { EquipmentType } from '@equipment-models/equipment-type';
import { EquipmentService } from '@equipment-services/equipment.service';
import { ModuleModel } from '@event-module-models/module.model';
import { EventService } from '@event-services/event.service';
import { LocationService } from '@location-services/location.service';
import { RoomModel } from '@room-models/room.model';

@Component({
  selector: 'app-creating-event-equipment-table',
  templateUrl: './creating-event-equipment-table.component.html',
  styleUrls: ['./creating-event-equipment-table.component.scss', '../../../../../../styles.scss'],
  standalone: false,
})
export class CreatingEventEquipmentTableComponent extends CommonComponent {
  @ViewChild('tableWrapper') table: TableWrapperComponent;
  @ViewChildren(TableWrapperColumnDirective) tableColTemplateList: QueryList<TableWrapperColumnDirective>;

  @Input() modules: Array<ModuleModel> = [];
  @Input() isView: boolean = false;
  @Input() tableId: string = '';
  public displayedColumns: Array<DisplayedColumnInterface> = [
    {
      colDef: 'name',
      colTitleLocKey: 'creatingEventEquipmentsTableNameCol',
    },
    {
      colDef: 'equipmentCategory',
      colTitleLocKey: 'creatingEventEquipmentsTableCategoryCol',
      modelPropertyPath: ['equipmentCategory', 'name'],
    },
    {
      colDef: 'status',
      colTitleLocKey: 'creatingEventEquipmentsTableStatusCol',
      colType: DisplayedColumnTypeEnum.ENUM,
    },
    {
      colDef: 'actions',
      colTitleLocKey: 'actions',
      colType: DisplayedColumnTypeEnum.FUNC_COL,
      offFilter: true,
    },
  ];

  constructor(
    private locationService: LocationService,
    private eventService: EventService,
    private equipmentService: EquipmentService,
    private injector: Injector,
  ) {
    super(injector);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateEquipmentsDataSource();
  }

  getSelectedNodesId(currentSelectedNodes: Array<StandardNameIdModel>): Array<string> {
    if (currentSelectedNodes) {
      return currentSelectedNodes.map(currentSelectedNode => currentSelectedNode.id);
    }

    return [];
  }

  openEquipmentsModal(): void {
    const modalRef = this.newModal.open(CommonTreeSelectionModalComponent, {
      data: {
        selectedNodesId: this.getSelectedNodesId(this.collectUniqueEquipmentsFromModules()),
        loadTreeDataObs: this.locationService.hierarchyListWithEquipmentsAndEquipmentCategories(),
        modalTitle: this.localization.getLocalTextFromKey('equipmentSelectionPageTitle'),
        treeSelectionType: TreeSelectionTypeEnum.STANDARD_MULTI_SELECTION,
        customSaveFunc: this.equipmentSelectionModalCheck,
        parentComponent: this,
      },
    });

    this.closeSelectionEquipmentsHandler(modalRef);
  }

  equipmentSelectionModalCheck = (
    selectedNods: Array<StandardFlatNodeModel>,
    modalRef: MatDialogRef<CommonModalComponent>,
    self: CreatingEventEquipmentTableComponent,
  ): void => {
    const equipments: Array<EquipmentModel> = selectedNods
        .filter(node => !node.expandable && node.nodeObject)
        .map(node => JSON.parse(JSON.stringify(node.nodeObject))),
      rooms: Array<RoomModel> = [];

    self.modules?.forEach(module => {
      module.roomReservations?.forEach(rs => {
        if (!rooms.includes(rs.room)) {
          rooms.push(rs.room);
        }
      });
    });

    const validLocations: boolean = this.eventService.checkRoomsEquipmentsLocation(rooms, equipments);

    if (!validLocations) {
      self.showConfirmEquipmentRoomLocationModal(selectedNods, modalRef, self);
    } else {
      self.confirmSaveCloseEquipmentModal(selectedNods, modalRef);
    }
  };

  private showConfirmEquipmentRoomLocationModal(
    selectedNods: Array<StandardFlatNodeModel>,
    modalRef: MatDialogRef<CommonModalComponent>,
    self: CreatingEventEquipmentTableComponent,
  ): void {
    const confirmMessage: string = self.localization.getLocalTextFromKey(
      'creatingEventEquipmentsTableInvalidLocationMessage',
    );

    self
      .showConfirmModal(confirmMessage)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          self.confirmSaveCloseEquipmentModal(selectedNods, modalRef);
        }
      });
  }

  private confirmSaveCloseEquipmentModal(
    selectedNods: Array<StandardFlatNodeModel>,
    modalRef: MatDialogRef<CommonModalComponent>,
  ): void {
    modalRef.close({
      result: selectedNods,
    });
  }

  closeSelectionEquipmentsHandler(modalRef: MatDialogRef<CommonTreeSelectionModalComponent>): void {
    modalRef.afterClosed().subscribe({
      next: data => {
        if (data) {
          this.changeEquipmentsDataSource(data.result);
        }
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  removeEquipmentsByRoom(roomId: string): void {
    this.modules.forEach(module => {
      module.equipments = module.equipments.filter(equipment => equipment.room?.id !== roomId);
    });

    this.updateEquipmentsDataSource();
  }

  updateEquipmentsBySelectedRooms(): void {
    const roomIdsSet: Set<string> = new Set<string>();

    this.modules.forEach(module => {
      module.roomReservations.forEach(rs => {
        roomIdsSet.add(rs.room.id);
      });
    });

    this.equipmentService.getEquipmentsByRoomIds(...roomIdsSet).subscribe({
      next: data => {
        this.addEquipmentsIfDontExist(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  addEquipmentsIfDontExist(newEquipments: Array<EquipmentModel>): void {
    this.modules.forEach(module => {
      const equipments: Array<EquipmentModel> = module.equipments;

      if (!equipments) {
        module.equipments = newEquipments;
        return;
      }

      newEquipments.forEach(newEquipment => {
        const equipmentExist: EquipmentModel = equipments.find(equipment => {
          return equipment.id === newEquipment.id;
        });

        if (!equipmentExist) {
          equipments.push(newEquipment);
        }
      });
    });

    this.updateEquipmentsDataSource();
  }

  changeEquipmentsDataSource(selectedInHierarchy: Array<StandardFlatNodeModel>): void {
    this.setEquipmentsToModules(selectedInHierarchy);

    this.updateEquipmentsDataSource();
  }

  private setEquipmentsToModules(selectedInHierarchy: Array<StandardFlatNodeModel>): void {
    const selectedEquipmentNodes = this.getSelectedEquipmentNodes(selectedInHierarchy);

    this.modules.forEach(module => {
      module.equipments = selectedEquipmentNodes;
    });
  }

  private getSelectedEquipmentNodes(selectedInHierarchy: Array<StandardFlatNodeModel>): Array<EquipmentModel> {
    const equipments: Array<EquipmentModel> = [];

    selectedInHierarchy
      .filter(selected => {
        return selected.unextendable;
      })
      .forEach(selected => {
        const equipment: EquipmentModel = selected.nodeObject;

        if (equipment) {
          equipments.push(equipment);
        }
      });

    return equipments;
  }

  private collectUniqueEquipmentsFromModules(): Array<EquipmentModel> {
    const uniqueEquipments: Array<EquipmentModel> = [];

    this.modules.forEach(module => {
      module.equipments?.forEach(equipment => {
        const i = uniqueEquipments.findIndex(uniqueEquipment => {
          return uniqueEquipment.id === equipment.id;
        });

        if (i <= -1) {
          uniqueEquipments.push(equipment);
        }
      });
    });

    return uniqueEquipments;
  }

  updateEquipmentsDataSource(): void {
    this.table.commonLoadTableHandler(this.collectUniqueEquipmentsFromModules());
  }

  equipmentOpenViewModal(equipment: EquipmentModel): void {
    this.newModal.open(CreateUpdateEquipmentModalComponent, {
      data: {
        model: equipment,
        isView: true,
      },
    });
  }

  removeEquipmentFromList(targetEquipment: EquipmentModel): void {
    this.modules.forEach(module => {
      module.equipments = module.equipments.filter(equipment => {
        return equipment.id !== targetEquipment.id;
      });
    });

    this.updateEquipmentsDataSource();
  }

  canDeleteRow(equipment: EquipmentModel): boolean {
    return !this.isView && equipment.type.id !== EquipmentType.BUILT_IN;
  }
}
