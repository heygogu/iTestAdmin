import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UserService } from '../services/user-service.service';

@Component({
  selector: 'app-shared-layout',
  templateUrl: './shared-layout.component.html',
  styleUrls: ['./shared-layout.component.css']
})
export class SharedLayoutComponent {
  pageTitle: string = '';
  isScreenSmall: boolean = false;

  constructor(private router: Router, private breakpointObserver: BreakpointObserver,private userService:UserService) {
    // Watch for screen size
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isScreenSmall = result.matches;
      });

      
    // Watch for route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        this.setPageTitle(url);
      });
  }

  logOut(){
      this.userService.removeUser();
      this.router.navigate(["/admin-login"])
  }


  setPageTitle(url: string) {
    if (url.includes('/dashboard')) {
      this.pageTitle = 'Dashboard';
    } else if (url.includes('/users')) {
      this.pageTitle = 'Users';
    } else if (url.includes('/quizzes')) {
      this.pageTitle = 'Quizzes';
    } else if (url.includes('/question-bank')) {
      this.pageTitle = 'Question Bank';
    } else if (url.includes('/edit-profile')) {
      this.pageTitle = 'Edit Profile';
    } else if (url.includes('/schedule-quiz')) {
      this.pageTitle = 'Schedule Quiz';
    } else if (url.includes('/create-quiz')) {
      this.pageTitle = 'Create Quiz';
    } else if(url.includes('/questionbank/add/')){
      this.pageTitle = 'Question Bank';
    } else if(url.includes('questionbank/view')){
      this.pageTitle = 'Question Bank'
    } else {
      this.pageTitle = 'Admin Panel';
    }
  }
}
