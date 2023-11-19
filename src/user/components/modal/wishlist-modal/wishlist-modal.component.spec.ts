import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistModalComponent } from './wishlist-modal.component';

describe('WishlistModalComponent', () => {
  let component: WishlistModalComponent;
  let fixture: ComponentFixture<WishlistModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WishlistModalComponent]
    });
    fixture = TestBed.createComponent(WishlistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
