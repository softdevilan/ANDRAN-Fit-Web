import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { PseudoauthService } from '../../../services/pseudoauth.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit, OnDestroy {
  uid: string | null = null;
  private routeSub!: Subscription;
  trainerName: any;
  user: any;

  constructor(private router: Router, private firebase: PseudoauthService, private authService: AuthService) {}

  ngOnInit(): void {
    console.log("🏠 Header inicializado");
    
    const currentUrl = this.router.url;
    console.log("🔗 URL actual:", currentUrl);
  
    const matches = currentUrl.match(/\/(?:home|clients|workouts|register-client|client|register-workout)\/([^/]+)/);
    this.uid = matches ? matches[1] : null;
    console.log("🆔 UID extraído:", this.uid);
  
    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        console.log("🚀 Evento NavigationEnd detectado!");
        const updatedUrl = this.router.url;
        console.log("🔗 URL tras NavigationEnd:", updatedUrl);
        const newMatches = updatedUrl.match(/\/(?:home|clients|workouts|register-client|client|register-workout)\/([^/]+)/);
        return newMatches ? newMatches[1] : null;
      })
    ).subscribe(uid => {
      this.uid = uid;
      console.log("✅ UID asignado en HeaderComponent:", this.uid);
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
