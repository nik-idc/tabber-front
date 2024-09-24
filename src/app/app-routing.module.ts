import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/signin/signin.component';
import { SignUpComponent } from './components/signup/signup.component';

import { UserComponent } from './components/user/user.component';
import { TabComponent } from './components/tab/tab.component';
import { userResolver } from './_resolvers/user-resolver';
import { canActivateUser } from './_guards/user-guard';
import { InfoComponent } from './components/info/info.component';
import { canActivateAuth } from './_guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    // canActivate: [canActivateAuth],
    pathMatch: 'full',
    redirectTo: 'signin',
  },
  { path: 'info', component: InfoComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  {
    path: 'user/:id',
    component: UserComponent,
    canActivate: [canActivateUser],
    resolve: { user: userResolver },
  },
  {
    path: 'tab/:id',
    component: TabComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const RoutingComponents = [SignInComponent, SignUpComponent];
