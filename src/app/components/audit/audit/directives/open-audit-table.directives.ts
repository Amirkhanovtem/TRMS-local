import { Directive, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuditModalComponent } from '@components/audit/audit/modals/audit-modal/audit-modal.component';

@Directive({
  selector: '[openAuditTable]',
  standalone: false,
})
export class OpenAuditTableDirectives {
  @Input() entityId: string;

  @HostListener('click', ['$event'])
  private onClick(): void {
    this.openAuditModal();
  }

  constructor(public newModal: MatDialog) {}

  openAuditModal(): void {
    this.newModal.open(AuditModalComponent, {
      data: {
        entityId: this.entityId,
      },
    });
  }
}
