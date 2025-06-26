import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartOptions, TooltipItem } from 'chart.js';
import { HttpParams } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { ApiService } from '../api.service';
import { AppToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit{

  quizHistory: any[] = [];
  stats: any;
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  userId!: number;
  user: any;

  lineChartData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        label: 'Score',
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63,81,181,0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
      tooltip: {
         callbacks: {
          title: () => '',
          label: (tooltipItem: TooltipItem<'line'>) => {
          const score = tooltipItem.parsed.y;
          const quizTitle = this.stats?.lineGraph[tooltipItem.dataIndex]?.quizTitle || '';
          return `${quizTitle}: ${score}`;
        
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Attempted Date' },
        ticks: {
          callback: function (val: any) {
            const label = this.getLabelForValue(val);
            const date = new Date(label);
            return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
          }
        }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Score' }
      }
    }
  };

  pieChartLabels = ['Passed', 'Failed'];
  pieChartData: number[] = [];
  pieChartColors = ['#4caf50', '#f44336'];

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' }
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private toast: AppToasterService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    this.userId = +idParam;
    this.loadUserProfile();
    this.loadStats();
    this.route.paramMap.subscribe(paramMap => {
      const pageParam = paramMap.get('page');
      this.currentPage = pageParam ? parseInt(pageParam, 10) : 1;
      this.loadQuizHistory(this.currentPage);
    });
  }



  loadUserProfile(): void {
    this.api.user.getProfile(this.userId).pipe(
      tap(res => {
        if (res.success) {
          this.user = res.data;
        }
      }),
      catchError(() => {
        this.toast.error('Failed to load user profile', 'Close');
        return of(null);
      })
    ).subscribe();
  }



  loadStats(): void {
    this.api.user.getUserStats(this.userId).pipe(
      tap(res => {
        if (res.success) {
          this.stats = res.data;
          const line = res.data.lineGraph;
          this.lineChartData.labels = line.map((d: any) => d.attemptedAt);
          this.lineChartData.datasets[0].data = line.map((d: any) => d.score);
          this.pieChartData = [res.data.pieChart.passed, res.data.pieChart.failed];
        }
      }),
      catchError(() => {
        this.toast.error('Failed to load user stats', 'Close');
        return of(null);
      })
    ).subscribe();
  }

  loadQuizHistory(page: number): void {
    const params = new HttpParams().set('limit', this.limit.toString());

    this.api.user.getUserHistory(this.userId, page, this.limit).pipe(
      tap(res => {
        if (res.success) {
          this.quizHistory = res.data.map((item: any) => ({
            name: item.quizTitle,
            marks: item.score,
            total: item.totalMarks,
            passed: item.passed
          }));
          this.totalPages = res.totalPages;
        }
      }),
      catchError(() => {
        this.toast.error('Failed to load quiz history', 'Close');
        return of(null);
      })
    ).subscribe();
  }

  changePage(delta: number): void {
    const nextPage = this.currentPage + delta;
    if (nextPage >= 1 && nextPage <= this.totalPages) {
      this.currentPage = nextPage;
      this.router.navigate(['/user-details', this.userId, nextPage], {
        replaceUrl: true
      });
      this.loadQuizHistory(nextPage);
      window.scrollTo(0, 0);
    }
  }



}
