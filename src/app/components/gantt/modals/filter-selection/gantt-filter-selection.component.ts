import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { CommonTreeComponent } from '@common-tree/common-tree.component';
import { TreeSelectionTypeEnum } from '@common-tree-models/tree-selection-type.enum';
import { GanttFilterData } from '@gantt-modals-filter-selection-models/gantt-filter-data.model';
import { GanttFilterService } from '@gantt-modals-filter-selection-services/gantt-filter.service';

@Component({
  selector: 'gantt-filter-selection',
  templateUrl: './gantt-filter-selection.component.html',
  styleUrls: ['./gantt-filter-selection.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class GanttFilterSelectionComponent extends CommonComponent implements OnInit {
  treeSelectionType = TreeSelectionTypeEnum.STANDARD_MULTI_SELECTION;

  @ViewChild('roomTree') roomTreeComponent: CommonTreeComponent;
  @ViewChild('trainerTree') trainerTreeComponent: CommonTreeComponent;
  @ViewChild('equipmentTree') equipmentTreeComponent: CommonTreeComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public ganttFilterData: GanttFilterData = new GanttFilterData();
  public blockConfirm: boolean = false;

  constructor(
    injector: Injector,
    public ganttFilterService: GanttFilterService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.ganttFilterService.selectedRooms().subscribe({
      next: data => {
        this.ganttFilterData.rooms = data.selectedIds;
        this.setSelectedNodes(this.roomTreeComponent, this.ganttFilterData.rooms);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });

    this.ganttFilterService.selectedTrainers().subscribe({
      next: data => {
        this.ganttFilterData.trainers = data.selectedIds;
        this.setSelectedNodes(this.trainerTreeComponent, this.ganttFilterData.trainers);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });

    this.ganttFilterService.selectedEquipments().subscribe({
      next: data => {
        this.ganttFilterData.equipments = data.selectedIds;
        this.setSelectedNodes(this.equipmentTreeComponent, this.ganttFilterData.equipments);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  setSelectedNodes(tree: CommonTreeComponent, selectedNodeIds: Array<string>): void {
    tree.selectedNodesId = selectedNodeIds;
    tree.selectNodeBySelectedNodesId();
  }

  confirm(): void {
    this.confirmStartHandler();

    this.ganttFilterData.rooms = this.collectSelectedItemsId(this.roomTreeComponent);

    this.ganttFilterData.trainers = this.collectSelectedItemsId(this.trainerTreeComponent);

    this.ganttFilterData.equipments = this.collectSelectedItemsId(this.equipmentTreeComponent);

    this.ganttFilterService
      .saveFilter(this.ganttFilterData)
      .subscribe({
        next: data => {
          this.modalComponent.modal.close(true);
        },
        error: e => {
          this.errorHandler(e);
        },
      })
      .add(() => this.confirmEndHandler());
  }

  private confirmStartHandler(): void {
    this.blockConfirm = true;
    this.showLoadPage();
  }

  private confirmEndHandler(): void {
    this.blockConfirm = false;
    this.hideLoadPage();
  }

  errorHandler(error): void {
    const errorBody = error.error;

    if (!errorBody) {
      this.errorResponseHandler(error);
    } else {
      this.showSnackBarWithMessage(errorBody.message, SnackBarTypeEnum.ERROR);
    }
  }

  clearAll(): void {
    this.roomTreeComponent.checklistSelection.clear();
    this.trainerTreeComponent.checklistSelection.clear();
    this.equipmentTreeComponent.checklistSelection.clear();
  }

  collectSelectedItemsId(tree: CommonTreeComponent): Array<string> {
    return tree
      .getSelectedNodes()
      .filter(data => {
        return data.unextendable;
      })
      .map(data => data.id);
  }
}
