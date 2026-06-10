import { Component, OnInit } from '@angular/core';
import { CommonComponent } from '@common-components/common.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
})
export class AppComponent extends CommonComponent implements OnInit {
  title = 'trmsFront';
  isLogged: boolean = false;

  ngOnInit(): void {}
}
