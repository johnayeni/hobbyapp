import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../classes/user';

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


  onSubmit(): void {
    this.is_loading = true;
    this.authService.registerUser(this.formData)
      .subscribe(
                response => this.authService.handleRegisterCallback(response),
                errors => alert('Server error')
              );
    this.is_loading = false;
  }

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

}
