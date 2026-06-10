export class StandardTreeModel {
  id: string = null;
  name: string = null;
  nameEn?: string = null;
  nameKz?: string = null;
  nameRu?: string = null;
  children?: Array<StandardTreeModel> = [];
  unextendable: boolean = true;
  parentId: string = null;
  selectable: boolean = true;
  hide: boolean = false;

  nodeObject;
}
