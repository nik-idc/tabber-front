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
import { TabComponent } from './components/tab/tab.component';
import { UserService } from './_services/user.service';
import { TokenInterceptorService } from './_services/token-interceptor.service';
import { ConfirmDeleteDialogComponent } from './components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { InfoComponent } from './components/info/info.component';
import { TabListComponent } from './components/tab-list/tab-list.component';
import { TabCardComponent } from './components/tab-list/tab-card/tab-card.component';
import { TabEditorComponent } from './components/tab/tab-editor/tab-editor.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    UserComponent,
    UserDataComponent,
    TabComponent,
    RoutingComponents,
    ConfirmDeleteDialogComponent,
    InfoComponent,
    TabListComponent,
    TabCardComponent,
    TabEditorComponent
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
