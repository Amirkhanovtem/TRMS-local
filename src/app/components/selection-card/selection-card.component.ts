import {
  AfterViewInit,
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDivider, MatList, MatListItem, MatListItemTitle } from '@angular/material/list';
import { CommonComponent } from '@common-components/common.component';
import { SelectionCardActionOutputDataModel } from '@components/selection-card/models/selection-card-action-output-data.model';
import { SelectionCardInputDataModel } from '@components/selection-card/models/selection-card-input-data.model';
import { SelectionCardPreparedDataModel } from '@components/selection-card/models/selection-card-prepared-data.model';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-selection-card',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    TranslocoModule,
    MatList,
    MatListItem,
    MatListItemTitle,
    MatIcon,
    MatIconButton,
    MatDivider,
  ],
  templateUrl: './selection-card.component.html',
  standalone: true,
  styleUrl: './selection-card.component.scss',
})
export class SelectionCardComponent<D> extends CommonComponent implements AfterViewInit {
  readonly titleKey: InputSignal<string> = input('');
  readonly data: InputSignal<Array<SelectionCardInputDataModel<D>>> = input.required();
  readonly interactionMode: InputSignal<'select' | 'toggle-select'> = input('select');
  readonly getVisualFunc: InputSignal<(data: D) => string> = input((data: D) => data.toString());
  readonly selectionEvent: OutputEmitterRef<D> = output();
  readonly actionEvent: OutputEmitterRef<SelectionCardActionOutputDataModel<D>> = output();
  readonly selectedItem: InputSignal<D | null> = input<D | null>(null);

  readonly preparedData: Signal<Array<SelectionCardPreparedDataModel<D>>> = computed(() => {
    const isAllActive: boolean = this.interactionMode() === 'select';

    return this.data().map(obj => {
      return {
        data: obj.data,
        visualData: this.getVisualFunc()(obj.data),
        isActive: obj.isActive ?? isAllActive,
        isSelected: obj.data === this.selectedItem(),
      };
    });
  });

  readonly activeData: Signal<Array<SelectionCardPreparedDataModel<D>>> = computed(() => {
    return this.preparedData().filter(data => data.isActive);
  });

  readonly deactivatedData: Signal<Array<SelectionCardPreparedDataModel<D>>> = computed(() => {
    return this.preparedData().filter(data => !data.isActive);
  });

  readonly showActionButton: Signal<boolean> = computed(() => {
    return this.interactionMode() === 'toggle-select';
  });

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  onSelection(data: SelectionCardPreparedDataModel<D>): void {
    if (!data.isActive) {
      return;
    }

    this.selectionEvent.emit(data.data);
  }

  changeActive(event: MouseEvent, data: SelectionCardPreparedDataModel<D>, action: 'activate' | 'deactivate'): void {
    event.stopPropagation();
    this.actionEvent.emit({ data: data.data, action: action });
  }
}
