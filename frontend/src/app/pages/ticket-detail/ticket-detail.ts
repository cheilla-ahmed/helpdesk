
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.css',
})
export class TicketDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);

  ticket: any = null;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  isUpdatingStatus = false;

  ngOnInit(): void {

    this.successMessage = '';
    this.errorMessage = '';
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || Number.isNaN(id)) {
      this.errorMessage = 'Identifiant de ticket invalide.';
      this.isLoading = false;
      return;
    }

   this.ticketService.getTicketById(id).subscribe({
  next: (response: any) => {
    this.ticket = response?.ticket ?? response;
    this.isLoading = false;
    this.cdr.detectChanges();
  },
      error: (error) => {
        console.error('Erreur de chargement du ticket :', error);
        this.errorMessage = 'Impossible de charger ce ticket.';
        this.isLoading = false;
         this.cdr.detectChanges();
      }
    });
  }

  
changeStatus(status: string): void {
  if (!this.ticket) {
    return;
  }

  this.ticketService.updateTicketStatus(this.ticket.id, status).subscribe({
   next: (response: any) => {
  this.ticket = response?.ticket ?? response ?? this.ticket;
  this.ticket.status = status;
  this.successMessage = 'Le statut du ticket a été modifié avec succès.';
  this.errorMessage = '';
  this.cdr.detectChanges();
},
    error: (error) => {
      console.error('Erreur lors du changement de statut :', error);
      this.errorMessage = 'Impossible de modifier le statut du ticket.';
      this.isUpdatingStatus = false;
      this.cdr.detectChanges();
    }
  });
}

}
