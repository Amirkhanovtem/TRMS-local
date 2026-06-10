import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CommonComponent } from '@common-components/common.component';
import { SearchComponent } from '@common-search/search.component';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { StandardTreeModel } from '@common-tree-models/standard-tree.model';
import { TreeSelectionTypeEnum } from '@common-tree-models/tree-selection-type.enum';
import { SelectionBuilderService } from '@common-tree-services/selection/selection-builder.service';
import { TreeSelectionInterface } from '@common-tree-services/selection/tree-selection.interface';
import { TreeNodeBtnsComponent } from '@common-tree-tree-node-btns/tree-node-btns.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-common-tree',
  templateUrl: './common-tree.component.html',
  styleUrls: ['./common-tree.component.scss'],
  standalone: false,
})
export class CommonTreeComponent extends CommonComponent implements TreeSelectionInterface, OnInit {
  @Input() isSelectableTree: boolean = false;
  @Input() isView?: boolean = false;
  @Input() urlService?: string;
  @Input() selectedNodesId?: Array<string>;
  @Input() loadDataObs: Observable<Array<StandardTreeModel>>;
  @Input() treeSelectionType?: TreeSelectionTypeEnum;
  @Input() filterFunc?: (node: StandardFlatNodeModel, filter: string) => boolean;
  @Input() openCreateUpdateModalFunc?: (
    node: StandardFlatNodeModel,
    isUpdate: boolean,
    urlService: string,
  ) => MatDialogRef<any, any>;
  @Input() mapCheckCrudBtnShowFuncMap?: Map<string, (btnName: string, node: StandardFlatNodeModel) => boolean>;
  @ViewChild(TreeNodeBtnsComponent) treeNodeBtnsComponent: TreeNodeBtnsComponent;
  @ViewChild(SearchComponent) searchComponent: SearchComponent;
  selectionService: TreeSelectionInterface;

  private _transformer = (node: StandardTreeModel, level: number) => {
    return {
      id: node.id,
      name: node.name,
      expandable: node.children && node.children.length > 0,
      level: level,
      unextendable: node.unextendable,
      nodeObject: node.nodeObject,
      selectable: node.selectable,
      parentId: node.parentId,
      hide: node.hide,
    };
  };

  treeControl = new FlatTreeControl<StandardFlatNodeModel>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    injector: Injector,
    private selectionServiceBuilder: SelectionBuilderService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadData();
    this.getServiceByTreeSelectionType();
  }

  loadData(): void {
    this.loadDataObs?.subscribe({
      next: data => {
        this.updateDataSource(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  updateDataSource(data: Array<StandardTreeModel>): void {
    this.dataSource.data = data;
    this.treeControl.expandAll();
    this.selectNodeBySelectedNodesId();
    this.applyFilter();
  }

  applyFilter() {
    this.filterTree();
    this.treeControl.expandAll();
  }

  filterTree() {
    this.treeControl.dataNodes
      .filter(node => !node.parentId)
      .forEach(node => {
        this.filterNode(node);
      });
  }

  filterNode(node: StandardFlatNodeModel) {
    let filter: string = '';

    if (this.searchComponent?.search) {
      filter = this.searchComponent.search;
    }

    node.hide = this.filterFunc ? !this.filterFunc(node, filter) : !this.defaultFilterFunc(node, filter);

    if (node.hide) {
      this.getAllChildNodes(node)?.forEach(child => this.filterNode(child));
    } else {
      this.setForAllChild(node, node.hide);
      this.setForAllParent(node, node.hide);
    }
  }

  defaultFilterFunc(node: StandardFlatNodeModel, filter: string): boolean {
    return node.name.toLowerCase().includes(filter.toLowerCase());
  }

  setForAllChild(parent: StandardFlatNodeModel, hide: boolean) {
    this.getAllChildNodes(parent).forEach(node => {
      node.hide = hide;
      this.setForAllChild(node, hide);
    });
  }

  setForAllParent(node: StandardFlatNodeModel, hide: boolean) {
    const parentNode = this.getParentNode(node);

    if (parentNode) {
      parentNode.hide = hide;
      this.setForAllParent(parentNode, hide);
    }
  }

  getParentNode(node: StandardFlatNodeModel): StandardFlatNodeModel {
    return this.treeControl.dataNodes.filter(parent => parent.id === node.parentId)[0];
  }

  getAllChildNodes(node: StandardFlatNodeModel): Array<StandardFlatNodeModel> {
    return this.treeControl.dataNodes.filter(child => child.parentId === node.id);
  }

  selectNodeBySelectedNodesId(): void {
    if (!this.selectedNodesId || this.selectedNodesId.length === 0 || !this.treeControl?.dataNodes) return;

    this.treeControl.dataNodes
      .filter(node => {
        return this.selectedNodesId.includes(node.id);
      })
      .forEach(node => {
        if (!this.checklistSelection.isSelected(node)) {
          if (node.expandable) {
            this.selectionService.changeNodeHandler(node);
          } else {
            this.selectionService.changeNodeLeafHandler(node);
          }
        }
      });
  }

  hasChild = (_: number, node: StandardFlatNodeModel) => node.expandable;

  checklistSelection = new SelectionModel<StandardFlatNodeModel>(true);

  checkBtnsShow(node: StandardFlatNodeModel): boolean {
    return node.showBtns && !node.unextendable && !this.isSelectableTree && !this.isView;
  }

  checkSingleAddBtn(): boolean {
    return !this.isSelectableTree;
  }

  private getServiceByTreeSelectionType(): void {
    this.selectionService = this.selectionServiceBuilder.getSelectionServiceByTreeSelectionType(
      this.treeSelectionType,
      this.checklistSelection,
      this.treeControl,
    );
  }

  changeNodeHandler(node: StandardFlatNodeModel): void {
    this.selectionService.changeNodeHandler(node);
  }

  changeNodeLeafHandler(node: StandardFlatNodeModel): void {
    this.selectionService.changeNodeLeafHandler(node);
  }

  isDisabled(node: StandardFlatNodeModel): boolean {
    if (this.isView || !node.selectable) return true;

    return this.selectionService.isDisabled(node);
  }

  checkNode(node: StandardFlatNodeModel): boolean {
    return this.selectionService.checkNode(node);
  }

  checkNodeLeaf(node: StandardFlatNodeModel): boolean {
    return this.selectionService.checkNodeLeaf(node);
  }

  checkIndeterminate(node: StandardFlatNodeModel): boolean {
    return this.selectionService.checkIndeterminate(node);
  }

  getSelectedNodes(): Array<StandardFlatNodeModel> {
    return this.selectionService.getSelectedNodes();
  }
}
