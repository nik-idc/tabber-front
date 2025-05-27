import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempoEditorComponent } from './tempo-editor.component';

describe('TempoEditorComponent', () => {
  let component: TempoEditorComponent;
  let fixture: ComponentFixture<TempoEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempoEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TempoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
