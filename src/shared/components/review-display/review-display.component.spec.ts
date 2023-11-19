import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDisplayComponent } from './review-display.component';

describe('ReviewDisplayComponent', () => {
  let component: ReviewDisplayComponent;
  let fixture: ComponentFixture<ReviewDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewDisplayComponent]
    });
    fixture = TestBed.createComponent(ReviewDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
