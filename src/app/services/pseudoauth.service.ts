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

  async getTrainerName(uid: string | null): Promise<string | null> {
    if (!uid) {
      console.log("❌ getTrainerName: UID es null");
      return null;
    }
  
    console.log("🔍 Buscando nombre del entrenador para UID:", uid);
    
    try {
      const nameRef = ref(this.db, `Usuarios/Entrenadores/${uid}/Nombre`);
      const snapshot = await get(nameRef);
  
      if (snapshot.exists()) {
        const nombreData = snapshot.val();
        console.log("✅ Nombre obtenido:", nombreData);
        return `${nombreData.Nombre} ${nombreData.Apellido1}`;
      } else {
        console.log("❌ No se encontró nombre para UID:", uid);
        return null;
      }
    } catch (error) {
      console.error("🔥 Error en getTrainerName:", error);
      return null;
    }
  }  

  async getTrainerClients(uid: string | null): Promise<string[] | null> {
    try {
      const clientesRef = ref(this.db, `Usuarios/Entrenadores/${uid}/Clientes`);
      const snapshot = await get(clientesRef);
      if (snapshot.exists()) {
        return Object.keys(snapshot.val()); // Devuelve una lista de UIDs de clientes
      }
      return null;
    } catch (error) {
      console.error('Error al obtener los clientes del entrenador:', error);
      return null;
    }
  }

  // Devuelve si está loggeado o no
  isLoggedIn() {
    this.isLogged = this.trainerUID !== undefined;
    return this.isLogged;
  }

  getUID() { 
    return this.trainerUID;
  }
}
