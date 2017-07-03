import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerMaterialComponent } from './datepicker-material.component';

describe('DatepickerMaterialComponent', () => {
  let component: DatepickerMaterialComponent;
  let fixture: ComponentFixture<DatepickerMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
