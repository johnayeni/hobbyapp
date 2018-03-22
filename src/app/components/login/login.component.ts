import { Component, OnInit , ViewContainerRef} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../classes/user';
import { MatSnackBar } from '@angular/material';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formData = new User();

  response: object;

  errors: string;

  is_loading: Boolean = false;

  constructor(private authService: AuthService, public snackBar: MatSnackBar) {}

  ngOnInit() {}

  onSubmit(): void {
    this.is_loading = true;
    this.authService.loginUser(this.formData)
      .subscribe(
                response => (this.authService.handleLoginCallback(response),
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
