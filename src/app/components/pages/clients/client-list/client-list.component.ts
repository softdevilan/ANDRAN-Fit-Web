import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { PseudoauthService } from '../../../../services/pseudoauth.service';
import { filter, map, Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { Database, ref, get, set } from '@angular/fire/database';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})

export class ClientListComponent implements OnInit, OnDestroy {
  uid: string | null = null;
  id: string | null = null;

  private db = inject(Database);
  private routeSub!: Subscription;
  
  trainerClients: any[] = [];
  allClients: any[] = [];
  user: any;

  constructor(private router: Router, private firebase: PseudoauthService, private authService: AuthService) {}

  async obtenerClientes(){
    const clientsRef = ref(this.db, 'Usuarios/Clientes');

    try {
      const snapshot = await get(clientsRef);
      if (snapshot.exists()) {
        const clientsData = snapshot.val();
        this.trainerClients = [];
        this.allClients = [];

        Object.entries(clientsData).forEach(([clientUID, clientData]: any) => {
          var client = clientData;
          var WorkoutsPendientes = [];

          if (clientData.Entrenadores && clientData.Entrenadores[this.uid!]) {          
            if(client.Workouts && client.Workouts.Pendientes){
              WorkoutsPendientes = Object.values(client.Workouts.Pendientes);
              client.Workouts.Pendientes = WorkoutsPendientes;
            }
            this.trainerClients.push({ uid: clientUID, ...client });
          } else {
            if(client.Workouts && client.Workouts.Pendientes){
              WorkoutsPendientes = Object.values(client.Workouts.Pendientes);
              client.Workouts.Pendientes = WorkoutsPendientes;
            }
            this.allClients.push({ uid: clientUID, ...client });
          }
        });

        console.log("Clientes del entrenador:", this.trainerClients);

        console.log("Todos los demás clientes:", this.allClients);
      } else {
        console.log("No hay clientes en la base de datos.");
      }
    } catch (error) {
      console.error("Error obteniendo clientes:", error);
    }
  }

  ngOnInit(): void {
    console.log("📝ClientList inicializado");
    
    const currentUrl = this.router.url;
    console.log("🔗 URL actual:", currentUrl);
  
    const matches = currentUrl.match(/\/(?:home|clients|workouts|register-client)\/([^/]+)/);
    this.uid = matches ? matches[1] : null;
    console.log("🆔 UID extraído:", this.uid);
  
    if (this.uid) {
      //this.trainerClients = this.firebase.getTrainerClients(this.uid);
      console.log("📢 Llamando a getTrainerClients() con UID:", this.uid);
    }
  
    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        console.log("🚀 Evento NavigationEnd detectado!");
        const updatedUrl = this.router.url;
        console.log("🔗 URL tras NavigationEnd:", updatedUrl);
        const newMatches = updatedUrl.match(/\/(?:home|clients|workouts|register-client)\/([^/]+)/);
        return newMatches ? newMatches[1] : null;
      })
    ).subscribe(uid => {
      this.uid = uid;
      console.log("✅ UID asignado en RegisterClientComponent:", this.uid);
      //this.trainerClients = this.firebase.getTrainerClients(this.uid);
    });

    this.user = this.authService.getCurrentUser();
    console.log(this.user);

    /* Obtenemos clientes */
    this.obtenerClientes();
    console.log("✅ Clientes obtenidos", this.trainerClients);

  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
