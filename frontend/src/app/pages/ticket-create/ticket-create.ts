
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './ticket-create.html',
  styleUrl: './ticket-create.css'
})
export class TicketCreate {
  private ticketService = inject(TicketService);
  private router = inject(Router);

  title = '';
  category = '';
  priority = 'MEDIUM';
  description = '';

  message = '';
  errorMessage = '';
  isLoading = false;

  onSubmit(): void {
    this.message = '';
    this.errorMessage = '';

    if (!this.title.trim() || !this.category || !this.priority || !this.description.trim()) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.isLoading = true;

    this.ticketService.createTicket({
      title: this.title.trim(),
      category: this.category,
      priority: this.priority,
      description: this.description.trim()
    }).subscribe({
      next: () => {
        this.message = 'Ticket créé avec succès !';
        this.isLoading = false;
        this.router.navigate(['/tickets']);
      },
      error: (error) => {
        console.error('Erreur lors de la création du ticket :', error);
        this.errorMessage =
          error.status === 401 || error.status === 403
            ? 'Vous devez être connecté pour créer un ticket.'
            : 'Impossible de créer le ticket. Vérifiez que le backend fonctionne.';
        this.isLoading = false;
      }
    });
  }
}
