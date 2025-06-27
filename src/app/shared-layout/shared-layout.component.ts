import { Component} from '@angular/core';
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
  get userName(): string {
    return this.userService.getUser()?.fullName || 'Admin';
  }
    
  logOut(){
      this.userService.removeUser();
      this.router.navigate(["/admin-login"])
  }


  setPageTitle(url: string): void {
    switch (true) {
      case url.includes('/dashboard'):
        this.pageTitle = 'Dashboard';
        break;
      case url.includes('/users'):
        this.pageTitle = 'Users';
        break;
      case url.includes('/quizzes'):
        this.pageTitle = 'Quizzes';
        break;
      case url.includes('/question-bank'):
      case url.includes('/questionbank/add/'):
      case url.includes('questionbank/view'):
        this.pageTitle = 'Question Bank';
        break;
      case url.includes('/edit-profile'):
        this.pageTitle = 'Edit Profile';
        break;
      case url.includes('/schedule-quiz'):
        this.pageTitle = 'Schedule Quiz';
        break;
      case url.includes('/create-quiz'):
        this.pageTitle = 'Create Quiz';
        break;
      case url.includes('/user-details'):
        this.pageTitle = 'User Details';
        break;
      case url.includes('/edit-quiz'):
        this.pageTitle = 'Edit Quiz';
        break;
      default:
        this.pageTitle = 'Admin Panel';
        break;
    }
  }

}
