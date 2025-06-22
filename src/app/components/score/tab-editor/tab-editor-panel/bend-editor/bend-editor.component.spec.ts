import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BendEditorComponent } from './bend-editor.component';

describe('BendEditorComponent', () => {
  let component: BendEditorComponent;
  let fixture: ComponentFixture<BendEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BendEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BendEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
