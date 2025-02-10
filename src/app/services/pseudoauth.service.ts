import { Injectable, inject } from '@angular/core';
import { Database, ref, get } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})

export class PseudoauthService {
  private db = inject(Database); // Inyección segura dentro del contexto de Angular
  private trainerUID: string | undefined;
  private isLogged: boolean = false;

  async login(email: string, pass: string): Promise<boolean> {
    // Accede a Usuarios/Entrenadores en Firebase
    const entrenadoresRef = ref(this.db, 'Usuarios/Entrenadores');

    try {
      const snapshot = await get(entrenadoresRef);
      if (snapshot.exists()) {
        const entrenadores = snapshot.val();
        for (const uid in entrenadores) {
          const loginData = entrenadores[uid].Login;
          // Busca que el e-mail coincida con el e-mail de algún entrenador
          if (loginData && loginData['e-mail'] === email) {
            
            // Compara que la contraseña decodificada en base64 coincida con la introducida
            if (atob(loginData.pass) === pass) {
              this.trainerUID = uid;
              return true;
            } else {
              return false;
            }
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  }

  // Devuelve el UID
  getUID() {
    return this.trainerUID;
  }

  // Devuelve si está loggeado o no
  isLoggedIn() {
    this.isLogged = this.trainerUID !== undefined;
    return this.isLogged;
  }
}
