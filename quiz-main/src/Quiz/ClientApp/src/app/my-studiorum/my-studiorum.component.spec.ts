import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStudiorumComponent } from './my-studiorum.component';

describe('MyStudiorumComponent', () => {
  let component: MyStudiorumComponent;
  let fixture: ComponentFixture<MyStudiorumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyStudiorumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyStudiorumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
