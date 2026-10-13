import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule ,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Veuillez saisir votre e-mail et votre mot de passe.';
      return;
    }

    this.isLoading = true;

    this.authService.login({
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (!this.authService.getToken()) {
          this.errorMessage =
            response.message || 'Connexion reçue, mais aucun jeton JWT n’a été enregistré.';
          return;
        }

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.status === 401
            ? 'E-mail ou mot de passe incorrect.'
            : 'Connexion impossible. Vérifiez que le backend fonctionne.';
      }
    });
  }
}