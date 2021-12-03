import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckPerCardComponent } from './deck-per-card.component';

describe('DeckPerCardComponent', () => {
  let component: DeckPerCardComponent;
  let fixture: ComponentFixture<DeckPerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeckPerCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckPerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
