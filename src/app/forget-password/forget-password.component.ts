import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastServiceService } from '../toast-service.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  constructor(private apiService: ApiService, private router: Router,private toast: ToastServiceService) {}

  email: string = '';
  loading: boolean = false;

  onSubmit(form: any) {
    if (form.valid) {
      this.loading = true;

      this.apiService.auth.forgotPassword({ email: this.email }).pipe(
        tap(response => {
          console.log('Forgot Password API Response:', response);
          this.toast.show(response.message);
          this.router.navigate(['/reset-password']); 
        }),
        catchError(error => {
          console.error('Forgot Password API Error:', error);
          this.toast.show(error?.error?.message);
          return of(null); 
        })
      ).subscribe(() => {
        this.loading = false;
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
