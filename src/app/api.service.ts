import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly API_ROOT = 'https://vtjf237h-5274.inc1.devtunnels.ms/api/';
  

  constructor(private http: HttpClient) {}

  private get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.API_ROOT}${url}`, {
      params,
      withCredentials: true 
    });
  }

  private post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.API_ROOT}${url}`, body, {
      withCredentials: true 
    });
  }

  private put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.API_ROOT}${url}`, body, {
      withCredentials: true
    });
  }

  private patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.API_ROOT}${url}`, body, {
      withCredentials: true
    });
  }

  private delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.API_ROOT}${url}`, {
      withCredentials: true
    });
  }

  auth = {
    register: (userData: {
      email: string;
      password: string;
      fullName: string;
      role: number; 
    }): Observable<any> => {
      return this.post('Auth/admin/register', userData);
    },
  
    login: (credentials: {
      email: string;
      password: string;
    }): Observable<any> => {
      return this.post('Auth/admin/login', credentials);
    },
    forgotPassword: (emailPayload: { 
      email: string;
     }): Observable<any> => {
      return this.post('Auth/forgot-password', emailPayload);
    },
    resetPassword: (data: {
      token: string;
      newPassword: string;
    }): Observable<any> => {
      return this.post('Auth/reset-password', data);
    },        
  };

  admin = {
    addQuestionsToBank: (
      questionList: {
        text: string;
        optionA: string;
        optionB: string;
        optionC: string;
        optionD: string;
        correctOption: string;
        category: number;
      }[]
    ): Observable<any> => {
      return this.post('AdminQuiz/question-bank', questionList); 
    },



    getCategoryStats: (): Observable<{
      success: boolean;
      data: { index: number; name: string; totalQuestions: number }[];
    }> => {
      return this.get('AdminQuiz/question-categories');
    },

    getQuestionsByCategory: (
      categoryIndex: number,
      page: number,
      limit: number = 10,
      search: string = ''
    ): Observable<{
      success: boolean;
      page: number;
      limit: number;
      total: number;
      data: any[];
    }> => {
      const params = new HttpParams()
        .set('limit', limit.toString())
        .set('search', search);

      return this.get(
        `AdminQuiz/question-bank/category/${categoryIndex}/page/${page}`,
        params
      );
    },

    getQuestionById: (id: number): Observable<{
      success: boolean;
      data: {
        text: string;
        optionA: string;
        optionB: string;
        optionC: string;
        optionD: string;
        correctOption: string;
        category: number;
      };
    }> => {
      return this.get(`AdminQuiz/question-bank/${id}`);
    },


    updateQuestionById: (
      id: number,
      payload: {
        text: string;
        optionA: string;
        optionB: string;
        optionC: string;
        optionD: string;
        correctOption: string;
        category: number;
      }
    ): Observable<any> => {
      return this.patch(`AdminQuiz/question-bank/${id}`, payload);
    },

    deleteQuestionFromBank: (questionId: number): Observable<any> => {
      return this.delete(`AdminQuiz/question-bank/${questionId}`);
    },

    getRandomQuestions: (
      categoryIndex: number,
      limit: number
    ): Observable<{
      success: boolean;
      data: {
        id: number;
        text: string;
        optionA: string;
        optionB: string;
        optionC: string;
        optionD: string;
        correctOption: string;
        category: number;
      }[];
    }> => {
      return this.get(
        `AdminQuiz/question-bank/random-pick?category=${categoryIndex}&limit=${limit}`
      );
    },

    saveRandomQuiz: (quizData: {
      title: string;
      description: string;
      category: number;
      scoreToPass: number;
      selectedQuestionIds: number[];
      scheduledAt: string | null;
    }): Observable<any> => {
      return this.post('AdminQuiz/random-from-selected', quizData);
    },

    saveCustomQuiz: (quizData: {
      title: string;
      description: string;
      category: number;
      scoreToPass: number;
      scheduledAt: string | null;
      questions: {
        text: string;
        optionA: string;
        optionB: string;
        optionC: string;
        optionD: string;
        correctOption: 'A' | 'B' | 'C' | 'D';
      }[];
    }): Observable<any> => {
      return this.post('AdminQuiz/custom', quizData);
    },

    getQuizById: (quizId: number) => {
        return this.get<{ success: boolean; data: any }>(`AdminQuiz/${quizId}/details`);
    },

    updateQuizById: (
      quizId: number,
      data: {
        title: string;
        description: string;
        scoreToPass: number;
        questions: {
          text: string;
          optionA: string;
          optionB: string;
          optionC: string;
          optionD: string;
          correctOption: string;
        }[];
      }
    ): Observable<any> => {
      return this.patch(`AdminQuiz/${quizId}/edit-quiz`, data);
    },


    deleteQuestionFromQuiz: (quizId: number, questionId: number): Observable<any> => {
      return this.delete(`AdminQuiz/${quizId}/remove-question/${questionId}`);
    },

    getUnscheduledQuizzes: (
      page: number,
      limit: number = 10,
      category: number | null = null,
      search: string = ''
    ): Observable<{
        success: boolean;
        data: {
          page: number;
          limit: number;
          totalCount: number;
          quizzes: any[];
        };
    }> => {
      let params = new HttpParams().set('limit', limit.toString());

      if (category !== null && category !== undefined) {
        params = params.set('category', category.toString());
      }

      if (search) {
        params = params.set('search', search);
      }

      return this.get(`AdminQuiz/admin/unscheduled-quizzes/${page}`, params);
    },

    getAllQuizzes: (
      page: number,
      limit: number = 10,
      category: number | null = null,
      search: string = '',
      status:string=''
    ): Observable<{
        success: boolean;
        data: {
          page: number;
          limit: number;
          totalCount: number;
          quizzes: any[];
        };
    }> => {
      let params = new HttpParams().set('limit', limit.toString());

      if (category !== null && category !== undefined) {
        params = params.set('category', category.toString());
      }

      if (search) {
        params = params.set('search', search);
      }
      if(status){
        params=params.set('status',status)
      }

      return this.get(`AdminQuiz/admin/quizzes/${page}`, params);
    },

    scheduleQuizById: (
      quizId: number,
      newTime: string
    ): Observable<any> => {
      return this.put(`AdminQuiz/${quizId}/schedule`, { newTime });
    },
    rescheduleQuizById: (
      quizId: number,
      newTime: string
    ): Observable<any> => {
      return this.put(`AdminQuiz/${quizId}/reschedule`, { newTime });
    },


    deleteQuizById: (quizId: number): Observable<any> => {
      return this.delete(`AdminQuiz/${quizId}`);
    },

    exportQuizResultsById: (quizId: number): Observable<Blob> => {
      return this.http.get(`${this.API_ROOT}Export/quiz-results/${quizId}`, {
        responseType: 'blob',
        withCredentials: true
      });
    },

  };

  user = {
    getProfile: (id: number) => {
      return this.get<{ success: boolean, data: any }>(`User/${id}/profile`);
    },
    updateProfile: (id: number, body: any) => {
      return this.patch<{ success: boolean }>(`User/${id}/profile`, body);
    },
    getRecentUsers:(page: number, limit: number)=>{
      return this.get<{ success: boolean, data: any[], total: number, page: number, limit: number }>(`AdminQuiz/dashboard-recent/page/${page}?limit=${limit}`);
    },
    getAllUsers: (page: number, limit: number, search: string = '') => {
      return this.get<{ success: boolean; page: number; pageSize: number; total: number; data: any[] }>(`AdminQuiz/users/all/${page}?limit=${limit}&search=${search}`);
    },
    getUserStats: (userId: number): Observable<{ success: boolean; data: any }> => {
      return this.get<{ success: boolean; data: any }>(`User/${userId}/stats`);
    },
    getUserHistory: ( userId: number, page: number, limit: number = 10): Observable<{
      success: boolean;
      totalPages: number;
      data: {
        quizTitle: string;
        score: number;
        totalMarks: number;
        passed: boolean;
        attemptedAt: string;
      }[];
    }> => {
      const params = new HttpParams().set('limit', limit.toString());
      return this.get<{
        success: boolean;
        totalPages: number;
        data: {
          quizTitle: string;
          score: number;
          totalMarks: number;
          passed: boolean;
          attemptedAt: string;
        }[];
      }>(`User/user-history/${userId}/page/${page}`, params);
    },

  };

}
