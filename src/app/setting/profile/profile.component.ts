import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as alertFunctions from '../../shared/data/sweet-alert';
import { CookieService } from 'ngx-cookie';
import { AuthService } from 'app/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [AuthService],
  encapsulation: ViewEncapsulation.None
})

export class ProfileComponent {
  data: any = {};

  passwordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required)
  });

  constructor(private _httpService: AuthService, private cookieService: CookieService) {
  }

  changePassword() {
    const data = this.passwordForm.value;
    this._httpService.changePassword(data)
      .subscribe((result: any) => {
        if (result.success === true) {
          alertFunctions.typeCustom('Great!', 'Changes Saved!', 'success');
          this.passwordForm.reset();
        } else {
          alertFunctions.typeCustom('Sorry!', 'Changes could not be made', 'error');
        }
      }, (err: any) => {
        // this.errMsg = true;
        this.errorHandle(err);
      }, () => console.log());
  }

  errorHandle(err) {
    // this.displayMessageError = true;
    if (err.status === 0) {
      // this.message = 'Please check your internet connection';
      alertFunctions.typeCustom('Please check your internet connection!', 'Changes could not be made', 'error');
      return;
    } else if (err.status === 500) {
      // this.message = 'Server error';
      alertFunctions.typeCustom('Server error', 'Changes could not be made', 'error');
    } else if (err.status === 406) {
      alertFunctions.typeCustom('Incorrect Old Password', 'Changes could not be made', 'error');
    } else if (err.status === 422) {
      alertFunctions.typeCustom('Incorrect Old Password', 'Changes could not be made', 'error');
    } else if (err.status === 401) {
      alertFunctions.typeCustom('Unauthorised', 'Changes could not be made', 'error');
    }
    // this.message = JSON.parse(err._body).message;
  }
}
