import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { PseudoauthService } from '../../../../services/pseudoauth.service';
import { filter, map, Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { Database, ref, get, set } from '@angular/fire/database';

@Component({
  selector: 'app-client-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css'
})

export class ClientDetailsComponent {
  
  trainerUid: string | null = null;
  clientUid: string | null = null;

  private db = inject(Database);
  private routeSub!: Subscription;

  client: any = null;

  constructor(private router: Router, private firebase: PseudoauthService, private authService: AuthService) {}
  
  async obtenerCliente(){
    const clientRef = ref(this.db, `Usuarios/Clientes/${this.clientUid}`);
    try {
      const snapshot = await get(clientRef);
      if (snapshot.exists()) {
        this.client = snapshot.val();
        console.log("✅ Datos del cliente obtenidos:", this.client);
      } else {
        console.log("⚠️ Cliente no encontrado en la base de datos.");
      }
    } catch (error) {
      console.error("❌ Error obteniendo datos del cliente:", error);
    }
  }

  ngOnInit(): void {
    console.log("📝 ClientInfo inicializado");
  
    const currentUrl = this.router.url;
    console.log("🔗 URL actual:", currentUrl);
  
    // Expresión regular para capturar ambos UID (entrenador y cliente)
    const matches = currentUrl.match(/\/client\/([^/]+)\/([^/]+)/);
  
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
      console.log("📢 Consultando datos del cliente en Firebase...");
      this.obtenerCliente();
    }
  
    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        console.log("🚀 Evento NavigationEnd detectado!");
        const updatedUrl = this.router.url;
        console.log("🔗 URL tras NavigationEnd:", updatedUrl);
  
        // Vuelve a extraer los UIDs tras la navegación
        const newMatches = updatedUrl.match(/\/client-info\/([^/]+)\/([^/]+)/);
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
