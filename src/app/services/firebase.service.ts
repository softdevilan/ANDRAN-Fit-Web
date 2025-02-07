import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  private app;
  private auth;
  private db;

  constructor(private router: Router) {
    this.app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getDatabase(this.app);
  }

  // Autenticación
  login(email: string, password: string): Observable<void> {
    return new Observable(subscriber => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then(cred => {
          const trainerRef = ref(this.db, `Usuarios/Entrenadores/${cred.user.uid}`);
          onValue(trainerRef, snapshot => {
            if (snapshot.exists()) {
              subscriber.next();
              subscriber.complete();
            } else {
              this.logout();
              subscriber.error(new Error('No tienes permisos para acceder.'));
            }
          }, error => {
            subscriber.error(error);
          });
        })
        .catch(error => subscriber.error(error));
    });
  }

  logout(): void {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable(subscriber => {
      const unsubscribe = onAuthStateChanged(this.auth, user => {
        if (!user) {
          subscriber.next(false);
          return;
        }
        
        const trainerRef = ref(this.db, `Usuarios/Entrenadores/${user.uid}`);
        onValue(trainerRef, snapshot => {
          subscriber.next(!!snapshot.exists());
        });
      });

      subscriber.add(() => {
        unsubscribe();
      });
    });
  }

  // Operaciones de base de datos
  getTrainerData(uid: string): Observable<any> {
    const trainerRef = ref(this.db, `Usuarios/Entrenadores/${uid}`);
    return new Observable(subscriber => {
      const unsubscribe = onValue(trainerRef, snapshot => {
        subscriber.next(snapshot.val());
      });

      subscriber.add(() => {
        unsubscribe();
      });
    });
  }
}