import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit, OnDestroy {
  uid: string | null = null;
  private routeSub!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        // Pilla el uid directamente de la URL
        const currentUrl = this.router.url;
        const matches = currentUrl.match(/\/(?:home|clients|workouts)\/([^/]+)/);
        return matches ? matches[1] : null;
      })
    ).subscribe(uid => {
      this.uid = uid;
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
