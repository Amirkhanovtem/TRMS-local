import { CommonComponent } from '@common-components/common.component';
import { StandardFlatNodeModel } from '@common-tree-models/standard-flat-node.model';
import { Role } from '@config/role';

export class CommonDictionaryComponent extends CommonComponent {
  checkShowBtn(btnName: string): boolean {
    let availableRoles: Array<string> = [];

    switch (btnName) {
      case 'create':
      case 'delete':
      case 'edit': {
        availableRoles = [Role.ADMIN];
        break;
      }
      case 'view': {
        availableRoles = [Role.ADMIN, Role.SENIOR_PLANER, Role.PLANER, Role.TRAINER];
        break;
      }
    }

    return this.currentUserHasSomeRole(availableRoles);
  }

  getDefaultDictionariesMapCheckCrudBtnShowFuncMapForTree(): Map<
    string,
    (btnName: string, node: StandardFlatNodeModel) => boolean
  > {
    const checkShowFunc = (btnName: string, node: StandardFlatNodeModel): boolean => {
      return this.checkShowBtn(btnName);
    };

    return new Map<string, (btnName: string, node: StandardFlatNodeModel) => boolean>([
      ['create', checkShowFunc],
      ['edit', checkShowFunc],
      ['delete', checkShowFunc],
    ]);
  }
}
