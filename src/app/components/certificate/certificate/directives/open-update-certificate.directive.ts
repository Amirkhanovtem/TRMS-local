import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdateCertificateModalComponent } from '@components/certificate/certificate/modals/update-certificate-modal/update-certificate-modal.component';

@Directive({
  selector: '[openUpdateCertificateDirective]',
  standalone: false,
})
export class OpenUpdateCertificateDirective {
  @Input() certificateId: string;
  @Input() isView: boolean;
  @Input() beforeOpen: () => Promise<void>;

  @HostListener('click', ['$event'])
  private onClick(): void {
    Promise.resolve()
      .then(() => (this.beforeOpen ? this.beforeOpen() : Promise.resolve()))
      .then(() => this.openAuditModal());
  }

  constructor(public newModal: MatDialog) {}

  openAuditModal(): void {
    this.newModal.open(UpdateCertificateModalComponent, {
      data: {
        model: { id: this.certificateId },
        isUpdate: !this.isView,
        isView: this.isView,
      },
    });
  }
}
