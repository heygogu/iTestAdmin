import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE } from '../local-storage.token';


export interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly USER_KEY = 'user';

  constructor(@Inject(LOCAL_STORAGE) private localStorage: Storage) {}

  saveUser(user: User): void {
    this.localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const data = this.localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) as User : null;
  }

  removeUser(): void {
    this.localStorage.removeItem(this.USER_KEY);
  }
   isLoggedIn(): boolean {
    return !!this.getUser();
  }
}
