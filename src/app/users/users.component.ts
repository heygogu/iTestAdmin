import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { AppToasterService } from '../services/toaster.service';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

   users: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  searchText = '';

  constructor(
    private api: ApiService,
    private toast: AppToasterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currentPage = parseInt(params.get('page') || '1', 10);
      this.loadUsers(); 
    });
  }


  loadUsers(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const searchParam = queryParams.get('search') || '';
      this.searchText = searchParam;

      this.api.user.getAllUsers(this.currentPage, this.pageSize, this.searchText).pipe(
        tap(res => {
          if (res.success) {
            this.users = res.data;
            this.totalPages = Math.ceil(res.total / res.pageSize);
          }
        }),
        catchError(err => {
          this.toast.error('Failed to load users');
          return of(null);
        })
      ).subscribe();
    });
  }


  search(): void {
    this.router.navigate(['/users/page', 1], {
      queryParams: { search: this.searchText }
    });
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.router.navigate(['/users/page', this.currentPage + 1], {
        queryParams: { search: this.searchText }
      });
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.router.navigate(['/users/page', this.currentPage - 1], {
        queryParams: { search: this.searchText }
      });
    }
  }

  goToUserDetails(id: number): void {
    this.router.navigate(['/user-details', id]);
  }
}
