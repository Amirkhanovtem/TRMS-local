export class TableSaveVisualModel {
  id: string;
  tableId: string;
  hiddenColumnDefs: Array<string> = [];
  columnOrderDefs: Array<string> = [];
  paginatorPageSize: number;

  constructor(tableId: string) {
    this.tableId = tableId;
  }
}
