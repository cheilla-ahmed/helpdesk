import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css'
})
export class TicketList implements OnInit {
  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);

  tickets: any[] = [];
  searchTerm = '';
  selectedStatus = 'ALL';
  isLoading = false;
  errorMessage = '';

  

get filteredTickets(): any[] {
  const term = this.searchTerm.trim().toLowerCase();

  return this.tickets.filter(ticket => {
    const matchesSearch =
      (ticket.title || '').toLowerCase().includes(term) ||
      (ticket.description || '').toLowerCase().includes(term);

    const matchesStatus =
      this.selectedStatus === 'ALL' ||
      ticket.status === this.selectedStatus;

    return matchesSearch && matchesStatus;
  });
}


  

  ngOnInit(): void {
    this.loadTickets();
  }

  
loadTickets(): void {
  this.isLoading = true;
  this.errorMessage = '';
  

  this.ticketService.getTickets().subscribe({
    next: (response: any) => {
     

      this.tickets = Array.isArray(response)
        ? response
        : Array.isArray(response?.tickets)
          ? response.tickets
          : [];

      this.isLoading = false;
      this.cdr.detectChanges();
      
    },
    error: (error) => {
      console.error('Erreur :', error);
      this.errorMessage = 'Impossible de charger les tickets.';
      this.isLoading = false;
    }
  });
}

}