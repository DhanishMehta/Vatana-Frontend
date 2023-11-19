import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPageAreaComponent } from './product-page-area.component';

describe('ProductPageAreaComponent', () => {
  let component: ProductPageAreaComponent;
  let fixture: ComponentFixture<ProductPageAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductPageAreaComponent]
    });
    fixture = TestBed.createComponent(ProductPageAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
