import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonCreateUpdateComponents } from '@common-components/common-create-update.components';
import { CommonModalComponent } from '@common-components/common-modal/common-modal.component';
import { StandardEnumModel } from '@common-models/standard-enum.model';
import { UnavailabilityResourcesLabelModel } from '@unavailability-resources-label-models/unavailability-resources-label.model';
import { UnavailabilityResourcesLabelService } from '@unavailability-resources-label-services/unavailability-resources-label.service';

@Component({
  selector: 'app-create-update-unavailability-resources-label-modal',
  template: `
    <app-common-modal #modal>
      <ng-container modal-header>
        <h1 class="modal-title">
          {{
            dialogParams?.isUpdate
              ? ('editBtn' | transloco)
              : dialogParams?.isView
                ? ('viewBtn' | transloco)
                : ('createBtn' | transloco)
          }}
        </h1>
      </ng-container>

      <ng-container modal-content>
        <form [formGroup]="modalForm">
          <div class="input-fields-container">
            <div class="modal-input-field">
              <p class="modal-input-field-title">
                {{ 'resourceUnavailabilityLabelNameColTable' | transloco }}
              </p>
              <mat-form-field appearance="outline">
                <input
                  matInput
                  required
                  [placeholder]="'resourceUnavailabilityLabelNameColTable' | transloco"
                  [(ngModel)]="unavailabilityResourcesLabel.name"
                  formControlName="name"
                  [readonly]="dialogParams?.isView"
                />
              </mat-form-field>
              <div class="error-message">
                @if (isFieldEmpty('name')) {
                  <span>{{ 'validatorsEmptyFieldMessage' | transloco }}</span>
                }
              </div>
            </div>

            <div class="modal-input-field">
              <p class="modal-input-field-title">
                {{ 'resourceUnavailabilityLabelGroupResourceColTable' | transloco }}
              </p>
              <mat-form-field appearance="outline">
                <mat-select
                  required
                  [compareWith]="compareWithFn"
                  [placeholder]="'resourceUnavailabilityLabelGroupResourceColTable' | transloco"
                  [(ngModel)]="unavailabilityResourcesLabel.groupResource"
                  formControlName="groupResource"
                >
                  @for (group of allResourceGroups; track group) {
                    <mat-option [value]="group">
                      {{ group[localEnumField] }}
                    </mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <div class="error-message">
                @if (isFieldEmpty('groupResource')) {
                  <span>{{ 'validatorsEmptyFieldMessage' | transloco }}</span>
                }
              </div>
            </div>

            <div class="modal-input-field">
              <p class="modal-input-field-title">
                {{ 'resourceUnavailabilityLabelColorColTable' | transloco }}
              </p>
              <mat-form-field appearance="outline">
                <input
                  matInput
                  type="color"
                  [(ngModel)]="unavailabilityResourcesLabel.color"
                  formControlName="color"
                  [readonly]="dialogParams?.isView"
                />
              </mat-form-field>
            </div>
          </div>
        </form>
      </ng-container>

      <ng-container modal-footer>
        <div>
          @if (!dialogParams?.isView) {
            <button mat-raised-button color="primary" [disabled]="blockBtn" (click)="createOrSave()">
              {{ dialogParams?.isUpdate ? ('saveBtn' | transloco) : ('createBtn' | transloco) }}
            </button>
          }
          <button mat-raised-button color="warn" (click)="modal.closeBtnAction()">
            {{ 'closeBtn' | transloco }}
          </button>
        </div>
      </ng-container>
    </app-common-modal>
  `,
  standalone: false,
})
export class CreateUpdateUnavailabilityResourcesLabelModalComponent
  extends CommonCreateUpdateComponents<UnavailabilityResourcesLabelModel>
  implements OnInit
{
  @ViewChild('modal') modalComponent: CommonModalComponent;

  public unavailabilityResourcesLabel: UnavailabilityResourcesLabelModel = new UnavailabilityResourcesLabelModel();
  public allResourceGroups: Array<StandardEnumModel> = [];

  constructor(
    private unavailabilityResourcesLabelService: UnavailabilityResourcesLabelService,
    injector: Injector,
  ) {
    super(injector);
    this.createForm();
  }

  public ngOnInit(): void {
    this.loadResourceGroups();
    this.loadLabelDetail();
  }

  public createForm(): void {
    this.modalForm = this.formBuilder.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      groupResource: ['', [Validators.required]],
      color: [''],
    });
  }

  public loadResourceGroups(): void {
    this.unavailabilityResourcesLabelService.getAllResourceGroups().subscribe({
      next: data => {
        this.allResourceGroups = data;
      },
      error: e => {
        this.errorResponseHandler(e);
      },
    });
  }

  public loadLabelDetail(): void {
    if (this.dialogParams?.model?.id && (this.dialogParams?.isUpdate || this.dialogParams?.isView)) {
      this.unavailabilityResourcesLabelService
        .getUnavailabilityResourcesLabelById(this.dialogParams.model.id)
        .subscribe({
          next: data => {
            this.unavailabilityResourcesLabel = data;
          },
          error: e => {
            this.errorResponseHandler(e);
          },
        });
    }
  }

  public createOrSave(): void {
    this.modalForm.markAllAsTouched();

    if (!this.validateForm()) {
      return;
    }

    this.startCreateHandler();
    this.dialogParams?.isUpdate ? this.update() : this.create();
  }

  public create(): void {
    this.unavailabilityResourcesLabelService
      .create(this.unavailabilityResourcesLabel)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }

  public update(): void {
    this.unavailabilityResourcesLabelService
      .update(this.unavailabilityResourcesLabel)
      .subscribe({
        next: data => {
          this.modalComponent.closeCurrentModal(true);
        },
        error: e => {
          this.errorResponseHandler(e);
        },
      })
      .add(() => this.standardCompleteHandler());
  }
}
