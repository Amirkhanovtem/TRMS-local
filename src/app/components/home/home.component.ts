import { Component } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent extends CommonComponent {}
