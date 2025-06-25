import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly API_ROOT = 'https://vtjf237h-5274.inc1.devtunnels.ms/api/';
  

  constructor(private http: HttpClient) {}

  // Simple HTTP methods without token management
  private get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.API_ROOT}${url}`, {
      params,
      withCredentials: true // Important for session-based auth
    });
  }

  private post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.API_ROOT}${url}`, body, {
      withCredentials: true // Important for session-based auth
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
      role: number; // 0 = user, 1 = admin
    }): Observable<any> => {
      return this.post('Auth/register', userData);
    },
  
    login: (credentials: {
      email: string;
      password: string;
    }): Observable<any> => {
      return this.post('Auth/login', credentials);
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
    addQuestionToBank: (questionData: {
      text: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctOption: string;
      category: number;
    }): Observable<any> => {
      return this.post('AdminQuiz/question-bank', questionData);
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
  };

}
