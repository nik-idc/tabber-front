import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabEditorPanelComponent } from './tab-editor-panel.component';

describe('TabEditorPanelComponent', () => {
  let component: TabEditorPanelComponent;
  let fixture: ComponentFixture<TabEditorPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabEditorPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabEditorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
