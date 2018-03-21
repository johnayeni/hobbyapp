import { Component, OnInit, Inject } from '@angular/core';
import { Hobby } from '../../classes/hobby';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  hobbies = Hobby[1000];

  constructor(private apiService: ApiService, private authService: AuthService, public dialog: MatDialog) { }

  ngOnInit() {
    this.apiService.getHobbies()
        .subscribe(hobbies => this.hobbies = hobbies,
                  errors => this.authService.logout()
        );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog.component.html',
})
export class DialogComponent {

  hobby =  new Hobby();

  is_loading: Boolean = false;


  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.is_loading = true;
    this.apiService.addHobby(this.hobby)
      .subscribe(response => this.apiService.handleAddHobbyCallback(response),
                errors => alert('server error')
    );
    this.is_loading = false;

  }

}

