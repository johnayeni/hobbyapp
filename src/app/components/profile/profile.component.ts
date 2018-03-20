import { Component, OnInit } from '@angular/core';
import { User } from '../../classes/user';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = new User();

  constructor(private apiService: ApiService, private authService: AuthService) { }

  ngOnInit() {
    this.apiService.getUser()
      .subscribe(user => this.user = user,
                // errors => this.authService.logout()
                errors => console.log(errors)
              );
  }

}
