import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAnimationComponent } from './modal-animation.component';

describe('ModalAnimationComponent', () => {
  let component: ModalAnimationComponent;
  let fixture: ComponentFixture<ModalAnimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAnimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
