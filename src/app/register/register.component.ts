import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ToastServiceService } from '../toast-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private apiService: ApiService, private router: Router, private toast: ToastServiceService) {}

  hidePassword=false;
  registerData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  captchaToken: string | null = null;
  captchaError: boolean = false;

  passwordsMatch: boolean = true;
  loading = false;

  checkPasswordsMatch() {
    this.passwordsMatch =
      this.registerData.password === this.registerData.confirmPassword;
  }

  // Triggered when CAPTCHA is solved
  onCaptchaResolved(token: string) {
    this.captchaToken = token;
    this.captchaError = false;
    console.log('CAPTCHA Token:', token);
  }

  onSubmit(form: any) {
    if (form.valid && this.passwordsMatch) {
      const payload = {
        email: this.registerData.email,
        password: this.registerData.password,
        fullName: this.registerData.fullName,
        role: 1
      };
  
      this.loading = true;
  
      this.apiService.auth.register(payload).pipe(
        tap((response: any) => {
          console.log('Register response:', response);
          this.toast.show(response.message || 'Registration successful!');
          this.router.navigate(['/admin-login']);
          this.resetFormData(form);
        }),
        catchError((error) => {
          console.error('Registration failed:', error);
          this.toast.show(error?.error?.message || 'Registration failed. Please try again.');
          this.resetFormData(form);
          return of(null);
        })
      ).subscribe(() => {
        this.loading = false;
      });
  
    } else {
      console.warn('Form is invalid or passwords do not match');
    }
  }
  
  resetFormData(form: any) {
  this.registerData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  this.captchaToken = null;
  this.passwordsMatch = true;
  form.resetForm();
  }
}