import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      GuestGuard
    ]

  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [
      GuestGuard
    ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [
      AuthGuard
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, GuestGuard],
})
export class AppRoutingModule { }
