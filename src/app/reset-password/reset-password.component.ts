import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../api.service';
import { AppToasterService } from '../services/toaster.service';
import { LOCAL_STORAGE } from '../local-storage.token';
import { UserService } from '../services/user-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  constructor(private apiService: ApiService, private router: Router,private toast: AppToasterService,@Inject(LOCAL_STORAGE)private localStorage:Storage,private userService:UserService){
     if(this.localStorage.getItem('user')!==null){
      const user = JSON.parse(this.localStorage.getItem('user') || '{}');
      this.userService.saveUser(user)
      router.navigate(["/dashboard"])
    }
  }

  resetData = {
    token: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  passwordsMatch: boolean = true;
  loading: boolean = false;
  showNewPassword=true;
  showConfirmPassword=true;
  
  checkPasswordsMatch() {
    this.passwordsMatch =
      this.resetData.newPassword === this.resetData.confirmPassword;
  }

  onSubmit(form: any) {
    this.checkPasswordsMatch();

    if (form.valid && this.passwordsMatch) {
      this.loading = true;

      const payload = {
        token: this.resetData.token,
        newPassword: this.resetData.newPassword
      };

      this.apiService.auth.resetPassword(payload).pipe(
        tap(response => {
          console.log('Reset Password Response:', response);
          this.toast.success(response.message);
          this.router.navigate(['/admin-login']);
        }),
        catchError(error => {
          console.error('Reset Password Error:', error);
          this.toast.error(error?.error?.message);
          return of(null);
        })
      ).subscribe(() => {
        this.loading = false;
      });

    } else {
      if (!this.passwordsMatch) {
        this.toast.info('Passwords do not match!');
      } else {
        console.warn('Form is invalid');
      }
    }
  }
}
