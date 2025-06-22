import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SignInComponent } from './components/signin/signin.component';
import { SignUpComponent } from './components/signup/signup.component';
import { MaterialModule } from './app-material.module';

import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { UserComponent } from './components/user/user.component';
import { UserDataComponent } from './components/user/user-data/user-data.component';
import { ScoreComponent } from './components/score/score.component';
import { UserService } from './_services/user.service';
import { TokenInterceptorService } from './_services/token-interceptor.service';
import { ConfirmDeleteDialogComponent } from './components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { InfoComponent } from './components/info/info.component';
import { ScoreListComponent } from './components/score-list/score-list.component';
import { ScoreCardComponent } from './components/score-list/score-card/score-card.component';
import { TabEditorComponent } from './components/score/tab-editor/tab-editor.component';
import { TabEditorPanelComponent } from './components/score/tab-editor/tab-editor-panel/tab-editor-panel.component';
import { TempoEditorComponent } from './components/score/tab-editor/tab-editor-panel/tempo-editor/tempo-editor.component';
import { TimeSigEditorComponent } from './components/score/tab-editor/tab-editor-panel/time-sig-editor/time-sig-editor.component';
import { AudioUploaderComponent } from './components/dialogs/audio-uploader/audio-uploader.component';
import { BendEditorComponent } from './components/score/tab-editor/tab-editor-panel/bend-editor/bend-editor.component';
import { BendGraphSelectorComponent } from './components/score/tab-editor/tab-editor-panel/bend-editor/bend-graph-selector/bend-graph-selector.component';
import { BendReleaseGraphSelectorComponent } from './components/score/tab-editor/tab-editor-panel/bend-editor/bend-release-graph-selector/bend-release-graph-selector.component';
import { PrebendGraphSelectorComponent } from './components/score/tab-editor/tab-editor-panel/bend-editor/prebend-graph-selector/prebend-graph-selector.component';
import { PrebendReleaseGraphSelectorComponent } from './components/score/tab-editor/tab-editor-panel/bend-editor/prebend-release-graph-selector/prebend-release-graph-selector.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    UserComponent,
    UserDataComponent,
    ScoreComponent,
    RoutingComponents,
    ConfirmDeleteDialogComponent,
    InfoComponent,
    ScoreListComponent,
    ScoreCardComponent,
    TabEditorComponent,
    TabEditorPanelComponent,
    TempoEditorComponent,
    TimeSigEditorComponent,
    AudioUploaderComponent,
    BendEditorComponent,
    BendGraphSelectorComponent,
    BendReleaseGraphSelectorComponent,
    PrebendGraphSelectorComponent,
    PrebendReleaseGraphSelectorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
