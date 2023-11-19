import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureAreaComponent } from './feature-area.component';

describe('FeatureAreaComponent', () => {
  let component: FeatureAreaComponent;
  let fixture: ComponentFixture<FeatureAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeatureAreaComponent]
    });
    fixture = TestBed.createComponent(FeatureAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
