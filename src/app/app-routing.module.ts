import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/signin/signin.component';
import { SignUpComponent } from './components/signup/signup.component';

import { UserComponent } from './components/user/user.component';
import { TabComponent } from './components/tab/tab.component';
import { userResolver } from './resolvers/user-resolver';
import { canActivateUser } from './guards/user-guard'

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'user', component: UserComponent, canActivate: [canActivateUser], resolve: { user: userResolver } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const RoutingComponents = [
  SignInComponent,
  SignUpComponent,
]