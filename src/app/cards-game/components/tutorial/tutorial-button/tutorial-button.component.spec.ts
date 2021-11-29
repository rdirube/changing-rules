import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialButtonComponent } from './tutorial-button.component';

describe('TutorialButtonComponent', () => {
  let component: TutorialButtonComponent;
  let fixture: ComponentFixture<TutorialButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
