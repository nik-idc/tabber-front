import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BendReleaseGraphSelectorComponent } from './bend-release-graph-selector.component';

describe('BendReleaseGraphSelectorComponent', () => {
  let component: BendReleaseGraphSelectorComponent;
  let fixture: ComponentFixture<BendReleaseGraphSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BendReleaseGraphSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BendReleaseGraphSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
