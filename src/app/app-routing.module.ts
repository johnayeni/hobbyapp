import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
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
    ],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    component: NotFoundComponent,
     path: '404'
  },
  { path: '**',
    redirectTo: '404'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: [AuthGuard, GuestGuard],
})
export class AppRoutingModule { }
