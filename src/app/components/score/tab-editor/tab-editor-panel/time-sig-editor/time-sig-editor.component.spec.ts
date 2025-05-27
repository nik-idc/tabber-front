import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSigEditorComponent } from './time-sig-editor.component';

describe('TimeSigEditorComponent', () => {
  let component: TimeSigEditorComponent;
  let fixture: ComponentFixture<TimeSigEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeSigEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeSigEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
