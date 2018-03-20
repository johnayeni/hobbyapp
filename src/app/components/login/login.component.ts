import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../classes/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formData = new User();

  response: object;

  errors: string;

  onSubmit(): void {
    this.authService.loginUser(this.formData)
      .subscribe(
                response => this.authService.handleLoginCallback(response),
                errors => alert('Server Error')
              );
  }


  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

}
