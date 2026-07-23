import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    @if (auth.isLoggedIn()) {
      <nav class="topbar">
        <div>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Dashboard</a>
          <a routerLink="/cursos" routerLinkActive="active">Cursos</a>
          <a routerLink="/usuarios" routerLinkActive="active">Usuarios</a>
        </div>
        <div>
          <span style="margin-right:16px">{{ auth.getName() }}</span>
          <button class="secondary" (click)="logout()">Salir</button>
        </div>
      </nav>
    }
    <router-outlet></router-outlet>
    `
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
