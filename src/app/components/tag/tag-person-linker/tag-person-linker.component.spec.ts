import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagPersonLinkerComponent } from './tag-person-linker.component';

describe('TagPersonLinkerComponent', () => {
  let component: TagPersonLinkerComponent;
  let fixture: ComponentFixture<TagPersonLinkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagPersonLinkerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagPersonLinkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
