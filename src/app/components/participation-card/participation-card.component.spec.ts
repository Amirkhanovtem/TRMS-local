import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationCardComponent } from './participation-card.component';

describe('PaticipationCardComponent', () => {
  let component: ParticipationCardComponent;
  let fixture: ComponentFixture<ParticipationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParticipationCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
