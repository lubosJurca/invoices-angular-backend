import { StatusCodes } from 'http-status-codes';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../../shared/models/models';
import { environment } from '../../environments/enviroment';

interface AuthResponse {
  user: User;
  message?: string;
}

interface LogoutResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  //cancel_2y

  // Initialize authentication by verifying the token with the backend
  // This method will be called during app initialization
  // and will set the current user if the token is valid
  // or null if the token is invalid or expired
  // pipe is used because this function must return an Observable or Promise
  // subscribe to this would stop streaming data and thus this would not work
  // map is used to transform the response to a boolean indicating success
  // catchError is used to handle errors and return false if the token verification fails
  public initializeAuth(): Observable<boolean> {
    return this.http
      .get<AuthResponse>(environment.apiUrl + '/users/current-user', {
        withCredentials: true,
      })
      .pipe(
        tap({
          next: (response) => {
            this.currentUserSubject.next(response.user);
            console.log('Token verified successfully:', response.message);
          },
          error: (error) => {
            console.error('Token verification failed:', error);
            this.currentUserSubject.next(null);

            if (error.status === 401 || error.status === 403) {
              this.logout();
            }
          },
        }),
        map(() => true),
        catchError(() => of(false))
      );
  }

  registerUser(user: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post<AuthResponse>(environment.apiUrl + '/users/register', user, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.user) {
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  loginUser(user: { email: string; password: string }): Observable<any> {
    return this.http
      .post<AuthResponse>(environment.apiUrl + '/auth/login', user, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.user) {
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(map((user) => user !== null));
  }

  logout(): Observable<LogoutResponse> {
    return this.http
      .post<LogoutResponse>(
        environment.apiUrl + '/auth/logout',
        {},
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          // Clear the current user on successful logout
          // Only clear if response is successful
          //tap is used to perform side effects without altering the response
          this.currentUserSubject.next(null);
        }),
        catchError((error) => {
          console.log(error.message);
          // If the error is 401 Unauthorized, also clear the current user
          // This likely means the user was already logged out server-side
          if (error.status === 401) {
            this.currentUserSubject.next(null);
          }
          return throwError(() => error);
        })
      );
  }
}
