import { OverlayRef } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonComponent } from '@common-components/common.component';

@Component({
  selector: 'app-collapsed-modal-list',
  templateUrl: './collapsed-modal-list.component.html',
  styleUrls: ['./collapsed-modal-list.component.scss'],
  standalone: false,
})
export class CollapsedModalListComponent extends CommonComponent {
  open(modal: MatDialogRef<any>) {
    const overlayRef: OverlayRef = modal['_ref'].overlayRef,
      overlayContainer: Element = modal['overlayContainer'],
      backdropElement: HTMLElement = overlayRef.backdropElement,
      hostElement: HTMLElement = overlayRef.hostElement;

    overlayContainer.append(backdropElement);
    overlayContainer.append(hostElement);
    modal['collapsed'] = false;
  }

  showCollapsedModalList(): boolean {
    const openModals: Array<MatDialogRef<any>> = this.newModal.openDialogs;

    if (openModals.length === 0) {
      return false;
    }

    return !openModals.some(modal => !modal['collapsed']);
  }
}
