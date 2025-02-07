import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {

    return this.firebaseService.isAuthenticated().pipe(

      switchMap(isAuthenticated => {

        if (isAuthenticated) {
          if (this.router.url === '/login') {
            return of(false).pipe(
              switchMap(() => this.router.navigate(['/home']))
            );
          }
          return of(true);
        }
        
        if (this.router.url !== '/login') {
          return of(false).pipe(
            switchMap(() => this.router.navigate(['/login']))
          );
        }
        
        return of(false);
      }),

      catchError(error => {
        console.error('Error en AuthGuard:', error);
        return of(false).pipe(
          switchMap(() => this.router.navigate(['/login']))
        );
      })

    );

  }
}