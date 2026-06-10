import { Component, computed, effect, Injector, Signal, signal, WritableSignal } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { SelectionCardActionOutputDataModel } from '@components/selection-card/models/selection-card-action-output-data.model';
import { SelectionCardInputDataModel } from '@components/selection-card/models/selection-card-input-data.model';
import { SelectionCardComponent } from '@components/selection-card/selection-card.component';
import { TagResourceLinkerResourceModel } from '@components/tag/tag-resource-linker/models/tag-resource-linker-resource.model';
import { UpdateResourceTagModel } from '@components/tag/tag-resource-linker/models/update-resource-tag.model';
import { TagResourceLinkerService } from '@components/tag/tag-resource-linker/services/tag-resource-linker.service';
import { TranslocoModule } from '@ngneat/transloco';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tag-resource-linker',
  imports: [SelectionCardComponent, TranslocoModule],
  templateUrl: './tag-resource-linker.component.html',
  standalone: true,
  styleUrl: './tag-resource-linker.component.scss',
})
export class TagResourceLinkerComponent extends CommonComponent {
  readonly selectedTag: WritableSignal<StandardNameIdModel | null> = signal(null);
  readonly tags: WritableSignal<Array<StandardNameIdModel>> = signal([]);
  readonly getTagVisualFunc: (tag: StandardNameIdModel) => string = (tag: StandardNameIdModel) => tag.name;
  readonly tagsViewData: Signal<Array<SelectionCardInputDataModel<StandardNameIdModel>>> = computed(() => {
    return this.tags().map(tag => {
      return { data: tag };
    });
  });

  readonly selectedResourceType: WritableSignal<StandardEnumModel | null> = signal(null);
  readonly resourceTypes: WritableSignal<Array<StandardEnumModel>> = signal([]);
  readonly getResourceTypeVisualFunc: (tagRole: StandardEnumModel) => string = (tagRole: StandardEnumModel) =>
    tagRole[this.localEnumField];
  readonly resourceTypesViewData: Signal<Array<SelectionCardInputDataModel<StandardEnumModel>>> = computed(() => {
    return this.resourceTypes().map(resourceType => {
      return { data: resourceType };
    });
  });

  readonly resources: WritableSignal<Array<TagResourceLinkerResourceModel>> = signal([]);
  readonly getResourceVisualFunc: (resource: TagResourceLinkerResourceModel) => string = (
    resource: TagResourceLinkerResourceModel,
  ) => resource.tagResourceData.name;
  readonly resourcesViewData: Signal<Array<SelectionCardInputDataModel<TagResourceLinkerResourceModel>>> = computed(
    () => {
      return this.resources().map(resource => {
        return { data: resource, isActive: resource.isSelected };
      });
    },
  );

  constructor(
    injector: Injector,
    private tagResourceLinkerService: TagResourceLinkerService,
  ) {
    super(injector);
    this.loadTags();
    this.loadResourceTypes();
    this.initEffects();
  }

  onTagSelection(tag: StandardNameIdModel): void {
    this.selectedTag.set(tag);
  }

  onResourceTypeSelection(resourceType: StandardEnumModel): void {
    this.selectedResourceType.set(resourceType);
  }

  onResourceAction(selectionAction: SelectionCardActionOutputDataModel<TagResourceLinkerResourceModel>): void {
    const isActive: boolean = selectionAction.action === 'activate',
      resourceId: string = selectionAction.data.tagResourceData.id,
      updateBody: UpdateResourceTagModel = this.buildUpdateResourceTagBody(resourceId),
      update: Observable<void> = isActive
        ? this.tagResourceLinkerService.saveResourceTag(updateBody)
        : this.tagResourceLinkerService.deleteResourceTag(updateBody);

    update.subscribe({
      next: result => {
        this.updateResourceState(resourceId, isActive);
        this.showSuccessSaveSnackbar();
      },
      error: error => {
        this.errorResponseHandler(error);
      },
    });
  }

  private buildUpdateResourceTagBody(resourceId: string): UpdateResourceTagModel {
    const selectedTagId: string = this.selectedTag()?.id,
      selectedResourceType: StandardEnumModel = this.selectedResourceType();

    return { tagId: selectedTagId, type: selectedResourceType, resourceId: resourceId };
  }

  private initEffects(): void {
    effect(() => {
      const tagId: string = this.selectedTag()?.id,
        resourceType: StandardEnumModel = this.selectedResourceType();

      this.loadPersons(tagId, resourceType);
    });
  }

  private loadTags(): void {
    this.tagResourceLinkerService.getTags().subscribe({
      next: data => {
        this.updateTags(data);
      },
      error: error => {
        this.errorResponseHandler(error);
      },
    });
  }

  private updateTags(data: Array<StandardNameIdModel>): void {
    this.tags.set(data);
  }

  private loadResourceTypes(): void {
    this.tagResourceLinkerService.getResourceTypes().subscribe({
      next: data => {
        this.updateResourceTypes(data);
      },
      error: error => {
        this.errorResponseHandler(error);
      },
    });
  }

  private updateResourceTypes(data: Array<StandardEnumModel>): void {
    this.resourceTypes.set(data);
  }

  private loadPersons(tagId: string, resourceType: StandardEnumModel): void {
    if (!tagId || !resourceType) {
      this.updateResources([]);
      return;
    }

    this.tagResourceLinkerService.getResources(tagId, resourceType).subscribe({
      next: data => {
        this.updateResources(data);
      },
      error: error => {
        this.errorResponseHandler(error);
      },
    });
  }

  private updateResources(data: Array<TagResourceLinkerResourceModel>): void {
    this.resources.set(data);
  }

  private updateResourceState(resourceId: string, isActive: boolean): void {
    this.resources.update(current => {
      const updatedResource: TagResourceLinkerResourceModel = current.find(linker => {
        return linker.tagResourceData.id === resourceId;
      });

      if (updatedResource) {
        updatedResource.isSelected = isActive;
      }

      return [...current];
    });
  }

  private showSuccessSaveSnackbar(): void {
    this.showSnackBarWithMessage(
      this.localization.getLocalTextFromKey('saveSuccessfulMessage'),
      SnackBarTypeEnum.SUCCESS,
    );
  }
}
