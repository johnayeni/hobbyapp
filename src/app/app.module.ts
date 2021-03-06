// angular module imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';

// router import
import { AppRoutingModule } from './app-routing.module';

// component imports
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent, DialogComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HeaderComponent } from './partials/header/header.component';
import { FooterComponent } from './partials/footer/footer.component';

// services import
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    DialogComponent,
    ProfileComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
  ],
  entryComponents: [DialogComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [
  ApiService,
  AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
