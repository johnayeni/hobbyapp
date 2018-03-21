import { Component, OnInit , ViewContainerRef} from '@angular/core';
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

  is_loading: Boolean = false;

  onSubmit(): void {
    this.is_loading = true;
    this.authService.loginUser(this.formData)
      .subscribe(
                response => this.authService.handleLoginCallback(response),
                errors => alert('server error')
              );
    this.is_loading = false;
  }


  constructor(private authService: AuthService) {}

  ngOnInit() {
  }

}
