import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PseudoauthService } from '../../../../services/pseudoauth.service';
import { filter, map, Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { Database, ref, get, set } from '@angular/fire/database';

@Component({
  selector: 'app-register-workout',
  imports: [CommonModule ],
  templateUrl: './register-workout.component.html',
  styleUrl: './register-workout.component.css'
})

export class RegisterWorkoutComponent {
  trainerUid: string | null = null;
  clientUid: string | null = null;

  private db = inject(Database);
  private routeSub!: Subscription;

  workoutsArray: any[] = [];

  constructor(private router: Router, private firebase: PseudoauthService, private authService: AuthService) {}
  
  async obtenerEjercicios(){
    const clientRef = ref(this.db, `Deporte/Workouts`);
    try {
      const snapshot = await get(clientRef);
      if (snapshot.exists()) {
        this.workoutsArray = snapshot.val();
        console.log("✅ Workouts obtenidos:", this.workoutsArray);
      } else {
        console.log("⚠️ Workouts no encontrados en la base de datos.");
      }
    } catch (error) {
      console.error("❌ Error obteniendo workouts:", error);
    }
  }

  ngOnInit(): void {
    console.log("📝 RegisterWorkout inicializado");
  
    const currentUrl = this.router.url;
    console.log("🔗 URL actual:", currentUrl);
  
    // Expresión regular para capturar ambos UID (entrenador y cliente)
    const matches = currentUrl.match(/\/register-workout\/([^/]+)\/([^/]+)/);
  
    if (matches) {
      this.trainerUid = matches[1]; // Primer UID (entrenador)
      this.clientUid = matches[2];  // Segundo UID (cliente)
    } else {
      this.trainerUid = null;
      this.clientUid = null;
    }
  
    console.log("🆔 Entrenador UID:", this.trainerUid);
    console.log("🆔 Cliente UID:", this.clientUid);
  
    if (this.trainerUid && this.clientUid) {
      console.log("📢 Consultando ejercicios en Firebase...");
      this.obtenerEjercicios();
    }
  
    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        console.log("🚀 Evento NavigationEnd detectado!");
        const updatedUrl = this.router.url;
        console.log("🔗 URL tras NavigationEnd:", updatedUrl);
  
        // Vuelve a extraer los UIDs tras la navegación
        const newMatches = updatedUrl.match(/\/register-workout\/([^/]+)\/([^/]+)/);
        return newMatches ? { trainerUid: newMatches[1], clientUid: newMatches[2] } : null;
      })
    ).subscribe(data => {
      if (data) {
        this.trainerUid = data.trainerUid;
        this.clientUid = data.clientUid;
        console.log("✅ UID Entrenador actualizado:", this.trainerUid);
        console.log("✅ UID Cliente actualizado:", this.clientUid);
        // this.clientData = this.firebase.getClientData(this.trainerUid, this.clientUid);
      }
    });
  }

}
