import { Component, Input } from '@angular/core';
import { Localization } from '@localization/localization';

@Component({
  selector: 'app-navbutton',
  templateUrl: './navbutton.component.html',
  styleUrls: ['./navbutton.component.scss', '../navbar/navbar.component.scss'],
  standalone: false,
})
export class NavbuttonComponent {
  @Input() key: string = '';
  @Input() link: string | undefined;
  @Input() arrow: boolean | undefined;

  constructor(public localization: Localization) {}
}
