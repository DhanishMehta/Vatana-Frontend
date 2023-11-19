import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadCrumbAreaComponent } from './bread-crumb-area.component';

describe('BreadCrumbAreaComponent', () => {
  let component: BreadCrumbAreaComponent;
  let fixture: ComponentFixture<BreadCrumbAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BreadCrumbAreaComponent]
    });
    fixture = TestBed.createComponent(BreadCrumbAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
