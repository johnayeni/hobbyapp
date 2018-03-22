import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../classes/user';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formData = new User();

  response: object;

  errors: string;

  is_loading: Boolean = false;

  constructor(private authService: AuthService, public snackBar: MatSnackBar) { }

  ngOnInit() {}

  onSubmit(): void {
    this.is_loading = true;
    this.authService.registerUser(this.formData)
      .subscribe(
                response => (this.authService.handleRegisterCallback(response),
                                this.is_loading = false),
                errors => (this.openSnackBar('server error', 'close'), this.is_loading = false)
              );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }


}
