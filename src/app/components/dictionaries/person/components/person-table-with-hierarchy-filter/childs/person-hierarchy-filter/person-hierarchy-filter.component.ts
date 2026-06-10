import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  Injector,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonComponent } from '@common-components/common.component';
import { StandardTreeModel } from '@common-tree-models/standard-tree.model';
import { FilterOutputModel } from '@person/components/person-table-with-hierarchy-filter/childs/person-hierarchy-filter/models/filter-output.model';
import { PersonStatusEnum } from '@person-models/person-status.enum';
import { SubdivisionService } from '@subdivision-services/subdivision.service';

type Folder = {
  id: string;
  name: string;
  children?: Array<Folder>;
  type: 'folder' | 'search' | 'status' | 'subdivision';
  searchArray: Array<string>;
};

@Component({
  selector: 'app-person-hierarchy-filter',
  templateUrl: './person-hierarchy-filter.component.html',
  styleUrl: './person-hierarchy-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PersonHierarchyFilterComponent extends CommonComponent {
  readonly folderSelectEvent: OutputEmitterRef<FilterOutputModel> = output<FilterOutputModel>();
  readonly subdivisionFolders: WritableSignal<Array<Folder>> = signal([]);
  readonly showSubordinates: WritableSignal<boolean> = signal(true);
  readonly rootFolder: Signal<Folder> = computed(() => {
    return {
      id: 'rootFolder',
      name: this.localization.getLocalTextFromKey('personStatusColTable'),
      type: 'folder',
      searchArray: [],
      children: [
        {
          id: PersonStatusEnum.ACTIVE,
          name: this.localization.getLocalTextFromKey(`person_status.${PersonStatusEnum.ACTIVE}`),
          type: 'status',
          children: this.subdivisionFolders(),
          searchArray: [this.localization.getLocalTextFromKey(`person_status.${PersonStatusEnum.ACTIVE}`)],
        },
        {
          id: PersonStatusEnum.TERMINATED,
          name: this.localization.getLocalTextFromKey(`person_status.${PersonStatusEnum.TERMINATED}`),
          type: 'status',
          searchArray: [this.localization.getLocalTextFromKey(`person_status.${PersonStatusEnum.TERMINATED}`)],
        },
        {
          id: PersonStatusEnum.SUSPENDED,
          name: this.localization.getLocalTextFromKey(`person_status.${PersonStatusEnum.SUSPENDED}`),
          type: 'status',
          searchArray: [this.localization.getLocalTextFromKey(`person_status.${PersonStatusEnum.SUSPENDED}`)],
        },
        {
          id: PersonStatusEnum.CANDIDATE,
          name: this.localization.getLocalTextFromKey(`person_status.${PersonStatusEnum.CANDIDATE}`),
          type: 'status',
          searchArray: [this.localization.getLocalTextFromKey(`person_status.${PersonStatusEnum.CANDIDATE}`)],
        },
      ],
    };
  });

  constructor(
    injector: Injector,
    private subdivisionService: SubdivisionService,
  ) {
    super(injector);

    this.createSelectFolderEffect();
  }

  private createSelectFolderEffect(): void {
    effect(() => {
      this.folderSelectEvent.emit({
        status: this.selectedStatus(),
        subdivisionId: this.selectedSubdivisionId(),
        showSubordinates: this.showSubordinates(),
      });
    });
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.loadSubdivisions();
  }

  readonly childStack: WritableSignal<Array<Folder>> = signal([]);
  readonly stack: Signal<Array<Folder>> = computed(() => [this.rootFolder(), ...this.childStack()]);

  readonly currentFolder: Signal<Folder> = computed(() => {
    return this.stack().at(-1) ?? this.rootFolder();
  });

  readonly selectedStatus: Signal<string> = computed(() => {
    return this.stack().find(folder => folder.type === 'status')?.id ?? PersonStatusEnum.ACTIVE;
  });

  readonly selectedSubdivisionId: Signal<string | null> = computed(() => {
    return [...this.stack()].reverse().find(folder => folder.type === 'subdivision')?.id ?? null;
  });

  readonly prevFolder: Signal<Folder | null> = computed(() => {
    return this.stack().at(-2) ?? null;
  });

  open(folder: Folder): void {
    this.childStack.update(current => [...current, folder]);
  }

  back(): void {
    this.childStack.update(current => current.slice(0, -1));
  }

  onShowSubordinateChange(value: boolean) {
    this.showSubordinates.set(value);
  }

  private loadSubdivisions(): void {
    this.subdivisionService.list().subscribe({
      next: data => {
        this.successLoadHandler(data);
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  private successLoadHandler(subdivisions: Array<StandardTreeModel>): void {
    const subdivisionFolders: Array<Folder> = subdivisions.map(subdivision => this.mapToFolder(subdivision));

    this.subdivisionFolders.set(subdivisionFolders);
  }

  private mapToFolder(node: StandardTreeModel): Folder {
    return {
      id: node.id,
      name: node.name,
      children: node.children ? node.children.map(child => this.mapToFolder(child)) : [],
      type: 'subdivision',
      searchArray: [node.name, node.nameRu, node.nameEn, node.nameKz],
    };
  }

  applySearch(value: string): void {
    if (value.trim().length === 0) {
      return;
    }

    this.createFolderBySearch(value);
  }

  createFolderBySearch(search: string): void {
    const currentFolder: Folder = this.currentFolder(),
      preparedSearch: string = search.toLowerCase(),
      children: Array<Folder> = this.collectChildrenBySearch(preparedSearch, new Set(), currentFolder.children),
      newFolder: Folder = {
        id: search,
        name: this.localization.getLocalFormattedTextFromKey('search_by', new Map([['search', search]])),
        children: children,
        type: 'search',
        searchArray: [],
      };

    this.open(newFolder);
  }

  collectChildrenBySearch(search: string, trackedIdSet: Set<string>, children?: Array<Folder>): Array<Folder> {
    const result: Array<Folder> = [];

    if (!children) {
      return result;
    }

    children.forEach(child => {
      const childId: string = child.id;

      if (this.checkSearch(child, search) && !trackedIdSet.has(childId)) {
        result.push(child);
        trackedIdSet.add(childId);
      }

      const subFolders: Array<Folder> = this.collectChildrenBySearch(search, trackedIdSet, child.children);
      result.push(...subFolders);
    });

    return result;
  }

  checkSearch(folder: Folder, search: string): boolean {
    return folder.searchArray.some(value => value.toLowerCase().includes(search));
  }
}
