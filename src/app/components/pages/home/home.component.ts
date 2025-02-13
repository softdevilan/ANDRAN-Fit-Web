import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { ClientListComponent } from '../clients/client-list/client-list.component';
import { YourClientListComponent } from '../clients/your-client-list/your-client-list.component';
import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { PseudoauthService } from '../../../services/pseudoauth.service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, YourClientListComponent, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit, OnDestroy {
  uid: string | null = null;
  private routeSub!: Subscription;
  trainerName: any;
  user: any;

  constructor(private router: Router, private firebase: PseudoauthService, private authService: AuthService) {}

  ngOnInit(): void {
    console.log("🏠 HomeComponent inicializado");
    
    const currentUrl = this.router.url;
    console.log("🔗 URL actual:", currentUrl);
  
    const matches = currentUrl.match(/\/(?:home|clients|workouts|register-client)\/([^/]+)/);
    this.uid = matches ? matches[1] : null;
    console.log("🆔 UID extraído:", this.uid);
  
    if (this.uid) {
      this.trainerName = this.firebase.getTrainerName(this.uid);
      console.log("📢 Llamando a getTrainerName() con UID:", this.uid);
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
      console.log("✅ UID asignado en HomeComponent:", this.uid);
      this.trainerName = this.firebase.getTrainerName(this.uid);
    });

    this.user = this.authService.getCurrentUser();
    console.log(this.user);
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
