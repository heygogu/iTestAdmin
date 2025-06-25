import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../api.service';
import { ToastServiceService } from '../toast-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  constructor(private apiService: ApiService, private router: Router,private toast: ToastServiceService){}

  resetData = {
    token: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  passwordsMatch: boolean = true;
  loading: boolean = false;
  
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
          this.toast.show(response.message);
          this.router.navigate(['/admin-login']);
        }),
        catchError(error => {
          console.error('Reset Password Error:', error);
          this.toast.show(error?.error?.message);
          return of(null);
        })
      ).subscribe(() => {
        this.loading = false;
      });

    } else {
      if (!this.passwordsMatch) {
        this.toast.show('Passwords do not match!');
      } else {
        console.warn('Form is invalid');
      }
    }
  }
}
