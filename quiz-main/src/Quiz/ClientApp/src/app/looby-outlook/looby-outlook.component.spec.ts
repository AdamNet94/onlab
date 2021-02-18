import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoobyOutlookComponent } from './looby-outlook.component';

describe('LoobyOutlookComponent', () => {
  let component: LoobyOutlookComponent;
  let fixture: ComponentFixture<LoobyOutlookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoobyOutlookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoobyOutlookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
