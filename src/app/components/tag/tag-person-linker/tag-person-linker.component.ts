import { Component, computed, effect, Injector, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { SnackBarTypeEnum } from '@common-models/snack-bar-type.enum';
import { StandardNameIdModel } from '@common-models/standard-name-id.model';
import { SelectionCardActionOutputDataModel } from '@components/selection-card/models/selection-card-action-output-data.model';
import { SelectionCardInputDataModel } from '@components/selection-card/models/selection-card-input-data.model';
import { SelectionCardComponent } from '@components/selection-card/selection-card.component';
import { TagPersonLinkerPersonModel } from '@components/tag/tag-person-linker/models/tag-person-linker-person.model';
import { TagPersonLinkerTagRoleModel } from '@components/tag/tag-person-linker/models/tag-person-linker-tag-role.model';
import { UpdateTagRoleModel } from '@components/tag/tag-person-linker/models/update-tag-role.model';
import { UpdateTagRolePersonModel } from '@components/tag/tag-person-linker/models/update-tag-role-person.model';
import { TagPersonLinkerService } from '@components/tag/tag-person-linker/services/tag-person-linker.service';
import { TranslocoModule } from '@ngneat/transloco';
import { PersonService } from '@person-services/person.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tag-person-linker',
  imports: [TranslocoModule, SelectionCardComponent],
  templateUrl: './tag-person-linker.component.html',
  standalone: true,
  styleUrl: './tag-person-linker.component.scss',
})
export class TagPersonLinkerComponent extends CommonComponent {
  readonly selectedTag: WritableSignal<StandardNameIdModel | null> = signal(null);
  readonly selectedTagId: Signal<string | null> = computed(() => this.selectedTag()?.id ?? null);
  readonly tags: WritableSignal<Array<StandardNameIdModel>> = signal([]);
  readonly getTagVisualFunc: (tag: StandardNameIdModel) => string = (tag: StandardNameIdModel) => tag.name;
  readonly tagsViewData: Signal<Array<SelectionCardInputDataModel<StandardNameIdModel>>> = computed(() => {
    return this.tags().map(tag => {
      return { data: tag };
    });
  });

  readonly selectedTagRole: WritableSignal<TagPersonLinkerTagRoleModel | null> = signal(null);
  readonly selectedTagRoleId: Signal<string | null> = computed(() => this.selectedTagRole()?.tagRole.id ?? null);
  readonly tagRoles: WritableSignal<Array<TagPersonLinkerTagRoleModel>> = signal([]);
  readonly getTagRoleVisualFunc: (tagRole: TagPersonLinkerTagRoleModel) => string = (
    tagRole: TagPersonLinkerTagRoleModel,
  ) => tagRole.tagRole.name;
  readonly tagRolesViewData: Signal<Array<SelectionCardInputDataModel<TagPersonLinkerTagRoleModel>>> = computed(() => {
    return this.tagRoles().map(tagRole => {
      return { data: tagRole, isActive: tagRole.isSelected };
    });
  });

  readonly persons: WritableSignal<Array<TagPersonLinkerPersonModel>> = signal([]);
  readonly getPersonVisualFunc: (person: TagPersonLinkerPersonModel) => string = (person: TagPersonLinkerPersonModel) =>
    this.personService.getFullName(person.person);
  readonly personsViewData: Signal<Array<SelectionCardInputDataModel<TagPersonLinkerPersonModel>>> = computed(() => {
    return this.persons().map(person => {
      return { data: person, isActive: person.isSelected };
    });
  });

  constructor(
    injector: Injector,
    private tagPersonLinkerService: TagPersonLinkerService,
    private personService: PersonService,
  ) {
    super(injector);
    this.loadTags();
    this.initEffects();
  }

  onTagSelection(tag: StandardNameIdModel): void {
    this.selectedTag.set(tag);
  }

  onTagRoleSelection(tagRole: TagPersonLinkerTagRoleModel): void {
    this.selectedTagRole.set(tagRole);
  }

  onTagRoleAction(selectionAction: SelectionCardActionOutputDataModel<TagPersonLinkerTagRoleModel>): void {
    const isActive: boolean = selectionAction.action === 'activate',
      tagRoleId: string = selectionAction.data.tagRole.id,
      updateBody: UpdateTagRoleModel = this.buildUpdateTagRoleBody(tagRoleId),
      update: Observable<void> = isActive
        ? this.tagPersonLinkerService.saveTagRole(updateBody)
        : this.tagPersonLinkerService.deleteTagRole(updateBody);

    update.subscribe({
      next: result => {
        this.updateTagRoleState(tagRoleId, isActive);
        this.showSuccessSaveSnackbar();
      },
      error: error => {
        this.errorResponseHandler(error);
      },
    });
  }

  onPersonAction(selectionAction: SelectionCardActionOutputDataModel<TagPersonLinkerPersonModel>): void {
    const isActive: boolean = selectionAction.action === 'activate',
      personId: string = selectionAction.data.person.id,
      updateBody: UpdateTagRolePersonModel = this.buildUpdatePersonRoleBody(personId),
      update: Observable<void> = isActive
        ? this.tagPersonLinkerService.savePersonRole(updateBody)
        : this.tagPersonLinkerService.deletePersonRole(updateBody);

    update.subscribe({
      next: result => {
        this.updatePersonState(personId, isActive);
        this.showSuccessSaveSnackbar();
      },
      error: error => {
        this.errorResponseHandler(error);
      },
    });
  }

  private buildUpdateTagRoleBody(tagRoleId: string): UpdateTagRoleModel {
    const selectedTagId: string = this.selectedTagId();

    return { tagId: selectedTagId, tagRoleId: tagRoleId };
  }

  private buildUpdatePersonRoleBody(personId: string): UpdateTagRolePersonModel {
    const selectedTagId: string = this.selectedTagId(),
      selectedTagRoleId: string = this.selectedTagRoleId();

    return { tagId: selectedTagId, tagRoleId: selectedTagRoleId, personId: personId };
  }

  private initEffects(): void {
    effect(() => {
      const tagId: string = this.selectedTagId();

      this.loadTagRoles(tagId);
    });

    effect(() => {
      const tagId: string = untracked(() => this.selectedTagId()),
        tagRoleId: string = this.selectedTagRoleId();

      this.loadPersons(tagId, tagRoleId);
    });
  }

  private loadTags(): void {
    this.tagPersonLinkerService.getTags().subscribe({
      next: data => {
        this.updateTags(data);
      },
      error: error => {
        this.errorResponseHandler(error);
      },
    });
  }

  private updateTags(data: Array<StandardNameIdModel>): void {
    this.selectedTag.set(null);
    this.tags.set(data);
  }

  private loadTagRoles(tagId: string): void {
    if (!tagId) {
      this.updateTagRoles([]);
      return;
    }

    this.tagPersonLinkerService.getTagRoles(tagId).subscribe({
      next: data => {
        this.updateTagRoles(data);
      },
      error: error => {
        this.updateTagRoles([]);
        this.errorResponseHandler(error);
      },
    });
  }

  private updateTagRoles(data: Array<TagPersonLinkerTagRoleModel>): void {
    this.selectedTagRole.set(null);
    this.tagRoles.set(data);
  }

  private loadPersons(tagId: string, tagRoleId: string): void {
    if (!tagId || !tagRoleId) {
      this.updatePersons([]);
      return;
    }

    this.tagPersonLinkerService.getPersons(tagId, tagRoleId).subscribe({
      next: data => {
        this.updatePersons(data);
      },
      error: error => {
        this.errorResponseHandler(error);
      },
    });
  }

  private updatePersons(data: Array<TagPersonLinkerPersonModel>): void {
    this.persons.set(data);
  }

  private updateTagRoleState(tagRoleId: string, isActive: boolean): void {
    this.tagRoles.update(current => {
      const updatedTagRole: TagPersonLinkerTagRoleModel = current.find(linker => linker.tagRole.id === tagRoleId);

      if (updatedTagRole) {
        updatedTagRole.isSelected = isActive;

        this.selectedTagRole.update(current => {
          return current?.tagRole.id === updatedTagRole.tagRole.id && !isActive ? null : current;
        });
      }

      return [...current];
    });
  }

  private updatePersonState(personId: string, isActive: boolean): void {
    this.persons.update(current => {
      const updatedPerson: TagPersonLinkerPersonModel = current.find(linker => linker.person.id === personId);

      if (updatedPerson) {
        updatedPerson.isSelected = isActive;
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
