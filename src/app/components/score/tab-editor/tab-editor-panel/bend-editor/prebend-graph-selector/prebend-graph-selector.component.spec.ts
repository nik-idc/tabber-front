import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrebendGraphSelectorComponent } from './prebend-graph-selector.component';

describe('PrebendGraphSelectorComponent', () => {
  let component: PrebendGraphSelectorComponent;
  let fixture: ComponentFixture<PrebendGraphSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrebendGraphSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrebendGraphSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
