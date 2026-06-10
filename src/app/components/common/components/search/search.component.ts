import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss', '../../../../../styles.scss'],
  standalone: false,
})
export class SearchComponent extends CommonComponent {
  @Input() searchStyleClass: string;
  @Input() offLabel?: boolean;
  @Input() appearance?: 'fill' | 'outline' = 'outline';
  @Output() applySearch: EventEmitter<string> = new EventEmitter<string>();
  search: string;
}
