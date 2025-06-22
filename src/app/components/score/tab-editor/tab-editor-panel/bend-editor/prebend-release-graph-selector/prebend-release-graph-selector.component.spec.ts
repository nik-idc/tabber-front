import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrebendReleaseGraphSelectorComponent } from './prebend-release-graph-selector.component';

describe('PrebendReleaseGraphSelectorComponent', () => {
  let component: PrebendReleaseGraphSelectorComponent;
  let fixture: ComponentFixture<PrebendReleaseGraphSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrebendReleaseGraphSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrebendReleaseGraphSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
