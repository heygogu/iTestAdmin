import {  Inject } from '@angular/core';
import { Component,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AppToasterService } from '../services/toaster.service';
import { LOCAL_STORAGE } from '../local-storage.token';
import { UserService } from '../services/user-service.service';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private apiService: ApiService, private router: Router, private toast: AppToasterService,@Inject(LOCAL_STORAGE)private localStorage:Storage,private userService:UserService) {
     if(this.localStorage.getItem('user')!==null){
      const user = JSON.parse(this.localStorage.getItem('user') || '{}');
      this.userService.saveUser(user)
      router.navigate(["/dashboard"])
    }
  }

  registerData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  captchaToken: string | null = null;
  passwordsMatch: boolean = true;
  loading = false;
  hidePassword=true;
  confirmHidePassword=true;

  @ViewChild('captchaRef') captchaComponent!: RecaptchaComponent;


  checkPasswordsMatch() {
    this.passwordsMatch =
      this.registerData.password === this.registerData.confirmPassword;
  }

  onCaptchaResolved(token: string) {
    this.captchaToken = token;
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
          if (response.success) {
            console.log('Register response:', response);
            this.toast.success(response.message || 'Registration successful!');
            this.router.navigate(['/admin-login']);
          } else {
            this.toast.error(response.message || 'Registration failed.');
          }

          this.resetFormData(form);
        }),
        catchError((error) => {
          console.error('Registration failed:', error);
          this.toast.error(error?.error?.message || 'Registration failed. Please try again.');
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

    if (this.captchaComponent) {
      this.captchaComponent.reset();
    }
  }
}