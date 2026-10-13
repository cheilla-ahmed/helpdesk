
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink ,CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  message = '';
  errorMessage = '';
  loading = false;

  onSubmit(): void {
    this.message = '';
    this.errorMessage = '';

    if (this.password.length < 8) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères.';
      return;
    }

    this.loading = true;

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.message = response.message;
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Impossible de créer le compte.';
        this.loading = false;
      }
    });
  }
}
