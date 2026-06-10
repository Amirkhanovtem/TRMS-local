import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonCloseableModalComponents } from '@common-components/common-closeable-modal.components';
import { CommonModalSizeEnum } from '@common-components/common-modal/models/common-modal-size.enum';

@Component({
  selector: 'app-common-modal',
  templateUrl: './common-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./common-modal.component.scss'],
  standalone: false,
})
export class CommonModalComponent extends CommonCloseableModalComponents<CommonModalComponent> implements OnInit {
  private readonly MEDIUM_MODAL_WIDTH: string = '50vw';
  private readonly MEDIUM_MODAL_HEIGHT: string = '80vh';

  private readonly LARGE_MODAL_WIDTH: string = '80vw';
  private readonly LARGE_MODAL_HEIGHT: string = '80vh';

  offCollapseModal: boolean = this.setOffCollapseModal();

  @Input() loadingModal: boolean = false;
  @Input() modalSize: CommonModalSizeEnum | string;
  @Input() width: string;
  @Input() height: string;

  constructor(injector: Injector) {
    super(injector);
  }

  showHideLoadingModal(show: boolean): void {
    this.loadingModal = show;
    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    this.setDefaultColeWithoutConfirm();
    this.setModalSize();
  }

  private setOffCollapseModal(): boolean {
    const openModals: Array<MatDialogRef<any>> = this.newModal.openDialogs;

    if (openModals.length === 0) {
      return false;
    }

    return openModals.filter(modal => modal.id !== this.modal.id).some(modal => !modal['collapsed']);
  }

  private setModalSize(): void {
    const overlayRef: OverlayRef = this.modal['_ref'].overlayRef,
      hostElement = overlayRef.hostElement,
      paneElement = overlayRef['_pane'],
      surfaceElement = paneElement.getElementsByClassName('mat-mdc-dialog-surface').item(0);

    let width: string, height: string;

    switch (this.modalSize) {
      case CommonModalSizeEnum.L: {
        width = this.LARGE_MODAL_WIDTH;
        height = this.LARGE_MODAL_HEIGHT;
        break;
      }
      case CommonModalSizeEnum.M:
      default: {
        width = this.MEDIUM_MODAL_WIDTH;
        height = this.MEDIUM_MODAL_HEIGHT;
      }
    }

    surfaceElement.style.width = this.width ?? width;
    surfaceElement.style.height = this.height ?? height;

    paneElement.style.left = `${(hostElement.offsetWidth - surfaceElement.offsetWidth) / 2}px`;
    paneElement.style.top = `${(hostElement.offsetHeight - surfaceElement.offsetHeight) / 2}px`;
  }

  private setDefaultColeWithoutConfirm(): void {
    const closeWithoutConfirm: boolean = this.modal?.componentInstance?.['dialogParams']?.isView ?? false;

    this.changeCloseWithoutConfirmField(closeWithoutConfirm);
  }

  collapseModal() {
    const overlayRef: OverlayRef = this.modal['_ref'].overlayRef,
      hostElement: HTMLElement = overlayRef.hostElement,
      overlayContainer: Element = hostElement.offsetParent,
      backdropElement: HTMLElement = overlayRef.backdropElement;

    this.modal['collapsed'] = true;
    this.modal['modalTitle'] = this.findModalTitle(hostElement);
    this.modal['overlayContainer'] = overlayContainer;

    backdropElement.remove();
    hostElement.remove();
  }

  private findModalTitle(hostElement: HTMLElement): string {
    const element = hostElement.getElementsByClassName('modal-title')?.item(0) as HTMLElement;

    return element?.innerText ?? '-----';
  }
}
