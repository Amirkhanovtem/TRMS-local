import { Component, Injector, ViewChild } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { CommonTreeComponent } from '@common-tree/common-tree.component';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { StandardTreeModel } from '@common-tree-models/standard-tree.model';
import { TreeSelectionTypeEnum } from '@common-tree-models/tree-selection-type.enum';
import { SyllabusTemplateService } from '@syllabus-template-services/syllabus-template.service';
import { TrainingCategoryService } from '@training-category-services/training-category.service';
import { TrainingTemplateService } from '@training-template-services/training-template.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-creating-new-event-modal',
  templateUrl: './creating-new-event-modal.component.html',
  styleUrls: ['./creating-new-event-modal.component.scss'],
  standalone: false,
})
export class CreatingNewEventModalComponent extends CommonComponent {
  @ViewChild('treeSelection') treeSelection: CommonTreeComponent;
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public selected: StandardNameIdModel = null;
  public treeSelectionType: TreeSelectionTypeEnum = TreeSelectionTypeEnum.ONLY_CHILD_SINGLE_SELECTION;
  public selectedToggleBtn: string = 'training';

  constructor(
    private syllabusTemplateService: SyllabusTemplateService,
    private trainingTemplateService: TrainingTemplateService,
    public trainingCategoryService: TrainingCategoryService,
    injector: Injector,
  ) {
    super(injector);
  }

  changeToggleHandler($event) {
    let newLoadTreeObs: Observable<Array<StandardTreeModel>> = null;

    switch ($event.value) {
      case 'training': {
        newLoadTreeObs = this.trainingCategoryService.listWithTrainingTemplatesActive();
        break;
      }
      case 'syllabus': {
        newLoadTreeObs = this.trainingCategoryService.listWithSyllabusTemplates();
        break;
      }
    }

    this.updateTreeSelection(newLoadTreeObs);
  }

  updateTreeSelection(newLoadTreeObs: Observable<Array<StandardTreeModel>>) {
    if (newLoadTreeObs) {
      this.treeSelection.loadDataObs = newLoadTreeObs;
      this.treeSelection.loadData();
    }
  }

  treeFilterFunc = (node: StandardFlatNodeModel, filter: string): boolean => {
    return (
      node.name.toLowerCase().includes(filter.toLowerCase()) ||
      node.nodeObject?.code.toLowerCase().includes(filter.toLowerCase())
    );
  };

  public continueCreating(): void {
    this.selected = this.treeSelection.getSelectedNodes()[0];

    if (this.selected) {
      this.modalComponent.modal.close({
        eventType: this.selectedToggleBtn,
        model: this.selected,
      });
    }
  }

  checkContinueBtnDisabled(): boolean {
    if (!this.treeSelection) {
      return true;
    }

    return this.treeSelection.getSelectedNodes().length === 0;
  }
}
