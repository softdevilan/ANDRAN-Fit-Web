import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Database, ref, set, get, update } from '@angular/fire/database';
import { Observable, from, of } from 'rxjs';
import { signal } from '@angular/core';

/* USER PROFILE INTERFACES */

/* -Trainer User Profile- */
export interface TrainerProfile {
  uid?: string;
  email: string | null;
  firstName?: string;
  surname?: string;
  trato?: string;
  fullName?: string;
  createdAt?: number;
  clientes?: { [key: string]: { Desde: number } }; // Relación con clientes
}

/* -Client User Profile- */
export interface ClientProfile {
  uid?: string;
  active: boolean;
  birthday: number;
  email: string | null;
  firstName?: string;
  surname?: string;
  trato?: string;
  fullName?: string;
  createdAt?: number;
  objetivos?: { // Objetivos específicos para el cliente
    deportivos: {
      entrenamientosPorSemana: number;
    };
    fisicos: {
      grasa: number;
      peso: number;
    };
    nutricionales: {
      carbohidratos: number;
      grasas: number;
      kcal: number;
      proteinas: number;
      restricciones: {
        glutenFree: string;
        lowCarb: string;
      };
    };
    plan: string;
  };
  workouts: {
    completados: { [key: string]: any };
    pendientes: Array<any>;
  };
  entrenadores?: { [key: string]: { desde: number } }; // Relación con entrenadores
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private auth = inject(Auth);
  private database = inject(Database);

  public trainer = signal<TrainerProfile | null>(null);
  public client = signal<ClientProfile | null>(null);

  /* REGISTERS */

  /* -Register Trainer- */
  registerTrainer(email: string, password: string, profile: TrainerProfile): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(async (credentials) => {
          const createdAt = Date.now(); // Fecha en formato UNIX
          
          const userProfile = {
            Nombre: {
              Nombre: profile.firstName || '',
              Apellido1: profile.surname || '',
            },
            Trato: profile.trato || '',
            Login: {
              'e-mail': email
            },
            Clientes: {}, // Inicialmente sin clientes
            createdAt
          };
  
          // 📌 Guarda el usuario en la ruta `Usuarios/Entrenadores/{uid}`
          const userRef = ref(this.database, `Usuarios/Entrenadores/${credentials.user.uid}`);
          await set(userRef, userProfile);
  
          // 🔄 Actualiza la señal con los datos guardados
          this.trainer.set({
            uid: credentials.user.uid,
            email,
            firstName: profile.firstName,
            surname: profile.surname,
            trato: profile.trato,
            fullName: profile.fullName,
            createdAt
          });
  
          return credentials.user;
        })
    );
  }

  /* -Register Client- */
  registerClient(email: string, password: string, profile: ClientProfile): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(async (credentials) => {
          const createdAt = Date.now(); // Fecha en formato UNIX
          
          const userProfile = {
            Nombre: {
              Nombre: profile.firstName || '',
              Apellido1: profile.surname || '',
            },
            Trato: profile.trato || '',
            Login: {
              'e-mail': email
            },
            Activo: profile.active,
            FechaNacimiento: profile.birthday,
            Objetivos: profile.objetivos || {},
            Workouts: profile.workouts || { completados: {}, pendientes: [] },
            createdAt
          };
  
          // 📌 Guarda el usuario en la ruta `Usuarios/Clientes/{uid}`
          const userRef = ref(this.database, `Usuarios/Clientes/${credentials.user.uid}`);
          await set(userRef, userProfile);
  
          // 🔄 Actualiza la señal con los datos guardados
          this.client.set({
            uid: credentials.user.uid,
            email,
            firstName: profile.firstName,
            surname: profile.surname,
            active: profile.active,
            fullName: profile.fullName,
            createdAt,
            birthday: 0,
            workouts: {
              completados: {},
              pendientes: []
            }
          });
  
          return credentials.user;
        })
    );
  }
  
  /* -Login Trainer- */
  login(email: string, password: string): Observable<any> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
        .then(async (credentials) => {
          const userRef = ref(this.database, `Usuarios/Entrenadores/${credentials.user.uid}`);
          const snapshot = await get(userRef);
         
          if (snapshot.exists()) {
            const dbUser = snapshot.val();
            const userProfile: TrainerProfile = {
              uid: credentials.user.uid,
              email: dbUser.Login?.['e-mail'] || '',
              firstName: dbUser.Nombre?.Nombre || '',
              surname: dbUser.Nombre?.Apellido1 || '',
              trato: dbUser.Trato || '',
              fullName: `${dbUser.Nombre?.Nombre || ''} ${dbUser.Nombre?.Apellido1 || ''}`.trim(),
              createdAt: dbUser.createdAt || 0
            };
            this.trainer.set(userProfile); // Solo actualiza la señal de entrenadores
          } else {
            this.trainer.set(null); // No existe el usuario como entrenador
          }

          return credentials.user;
        })
    );
  }

  /* -Update Profile- */
  updateProfile(updates: Partial<TrainerProfile>): Observable<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      return of(undefined);
    }

    const userRef = ref(this.database, `Usuarios/Entrenadores/${currentUser.uid}`);
    return from(update(userRef, updates));
  }

  logout(): Observable<void> {
    this.trainer.set(null); // Restablece la señal de entrenadores
    return from(signOut(this.auth));
  }

/* -Get Current User- */
getCurrentUser(): Observable<TrainerProfile | null> {
  return new Observable(subscriber => {
    const unsubscribe = this.auth.onAuthStateChanged(
      async user => {
        if (user) {
          const userRef = ref(this.database, `Usuarios/Entrenadores/${user.uid}`);
          const snapshot = await get(userRef);
         
          if (snapshot.exists()) {
            const dbUser = snapshot.val();
            const currentUserWithId: TrainerProfile = {
              uid: user.uid,
              email: dbUser.Login?.['e-mail'] || '',
              firstName: dbUser.Nombre?.Nombre || '',
              surname: dbUser.Nombre?.Apellido1 || '',
              trato: dbUser.Trato || '',
              fullName: `${dbUser.Nombre?.Nombre || ''} ${dbUser.Nombre?.Apellido1 || ''}`.trim(),
              createdAt: dbUser.createdAt || 0
            };
            this.trainer.set(currentUserWithId); // Actualiza con los datos del entrenador
            subscriber.next(currentUserWithId);
          } else {
            this.trainer.set(null); // Si no existe como entrenador
            subscriber.next(null);
          }
        } else {
          this.trainer.set(null); // Si no hay usuario autenticado
          subscriber.next(null);
        }
        subscriber.complete();
      },
      error => subscriber.error(error)
    );
    return { unsubscribe };
  });
}
}
