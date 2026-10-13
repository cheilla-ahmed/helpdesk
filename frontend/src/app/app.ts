
import { Component, inject } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { AuthService, CurrentUser } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  router = inject(Router);
  currentUser: CurrentUser | null = null;
  private authService = inject(AuthService);
  

  constructor() {

    if (this.authService.getToken()) {
  this.authService.getCurrentUser().subscribe({
    next: (user) => {
  
  this.currentUser = user;
  
},
    error: () => {
      this.currentUser = null;
    }
  });
}
    this.authService.onLogout(() => {
      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    });
  }
  

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}
