import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ToastServiceService } from '../toast-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  captchaToken: string | null = null;
  captchaError: boolean = false;
  hidePassword=true;

  constructor(private apiService: ApiService,private router: Router,private toast: ToastServiceService) {}

  // Captures the CAPTCHA token
  onCaptchaResolved(token: string) {
    this.captchaToken = token;
    this.captchaError = false;
    console.log('CAPTCHA Token:', token);
  }

  onSubmit(form: any) {
    if (!this.captchaToken) {
      this.captchaError = true;
      console.warn('CAPTCHA not completed');
      return;
    }
  
    if (form.valid) {
      this.apiService.auth.login(this.loginData).pipe(
        tap((response: any) => {
          console.log('Login API Response:', response);
  
          if (response.success) {
            console.log('Login successful:', response);
            this.router.navigate(['/dashboard']);
          } else {
            this.toast.show('Login failed. Please check your credentials.');
          }
  
          // Clear form and captcha regardless of success/failure
          this.loginData = { email: '', password: '' };
          this.captchaToken = null;
          form.resetForm();
        }),
        catchError((err) => {
          console.error('Login error:', err);
          this.toast.show('Login failed. Please try again.');
  
          this.loginData = { email: '', password: '' };
          this.captchaToken = null;
          form.resetForm();
  
          return of(null); // ensure observable doesn't break
        })
      ).subscribe();
    } else {
      console.warn('Form is invalid');
    }
  }
  
  }

