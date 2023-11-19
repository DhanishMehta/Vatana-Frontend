import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCartModalComponent } from './add-to-cart-modal.component';

describe('AddToCartModalComponent', () => {
  let component: AddToCartModalComponent;
  let fixture: ComponentFixture<AddToCartModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddToCartModalComponent]
    });
    fixture = TestBed.createComponent(AddToCartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
