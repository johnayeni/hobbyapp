import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Hobby } from '../../classes/hobby';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  hobbies = Hobby[1000];

  navigationSubscription;

  constructor(private apiService: ApiService, private authService: AuthService, public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getHobbies();
  }

  getHobbies(): void {
    this.apiService.getHobbies()
        .subscribe(hobbies => this.hobbies = hobbies,
                  errors => this.authService.logout()
        );
  }

  toggleHobbyLike(hobby: Hobby): void {
    if (hobby.favourite === true) {
      this.apiService.unLikeHobby(hobby)
          .subscribe(response => (this.apiService.handleCallback(response),
                    this.getHobbies()),
                    errors => this.openSnackBar('server error', 'close')
          );
    } else {
      this.apiService.likeHobby(hobby)
          .subscribe(response => (this.apiService.handleCallback(response),
                    this.getHobbies()),
                    errors => this.openSnackBar('server error', 'close')
          );
    }
  }

  removeHobby(name: string) {
    const confirm = window.confirm('Remove hobby ?');
    if (confirm === true) {
      this.apiService.removeHobby(name)
      .subscribe(response => (this.apiService.handleCallback(response),
                this.getHobbies()),
                errors => this.openSnackBar('server error', 'close')
      );
    } else {
      this.openSnackBar('Operation aborted', 'close');
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getHobbies();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
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
    private apiService: ApiService,
    public snackBar: MatSnackBar
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.is_loading = true;
    this.apiService.addHobby(this.hobby)
      .subscribe(response => (this.apiService.handleCallback(response),
                              this.dialogRef.close(),
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

