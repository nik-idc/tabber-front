import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BendGraphSelectorComponent } from './bend-graph-selector.component';

describe('BendGraphSelectorComponent', () => {
  let component: BendGraphSelectorComponent;
  let fixture: ComponentFixture<BendGraphSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BendGraphSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BendGraphSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
