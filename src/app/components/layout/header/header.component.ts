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
  selectedTab: 'home' | 'clients' = 'clients'; // Estado para saber qué pestaña está seleccionada
  private routeSub!: Subscription;
  trainerName: any;
  user: any;

  constructor(private router: Router, private firebase: PseudoauthService, private authService: AuthService) {}

  ngOnInit(): void {
    console.log("🏠 Header inicializado");

    this.updateSelectedTab(this.router.url);

    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url)
    ).subscribe(url => {
      this.updateSelectedTab(url);
    });

    this.user = this.authService.getCurrentUser();
    console.log(this.user);
  }

  updateSelectedTab(url: string): void {
    this.uid = this.extractUid(url);
    this.selectedTab = url.includes('/home') ? 'home' : 'clients';
    console.log(`🔍 Pestaña seleccionada: ${this.selectedTab}`);
  }

  extractUid(url: string): string | null {
    const matches = url.match(/\/(?:home|clients|workouts|register-client|client|register-workout)\/([^/]+)/);
    return matches ? matches[1] : null;
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
