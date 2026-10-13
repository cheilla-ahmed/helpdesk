import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, CurrentUser } from '../../services/auth';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  currentUser: CurrentUser | null = null;
  tickets: any[] = [];
  totalTickets = 0;
  openTickets = 0;
  inProgressTickets = 0;
  resolvedTickets = 0;

  constructor(
  private authService: AuthService,
  private ticketService: TicketService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        
      },
      error: (error) => {
        console.error('Erreur de chargement du profil :', error);
      }
    });

 this.ticketService.getTickets().subscribe({
  next: (response: any) => {
    this.tickets = response?.tickets ?? response ?? [];
    this.calculateStatistics();
    this.cdr.detectChanges();
    
  },
  error: (error) => {
    console.error('Erreur de chargement des tickets :', error);
  }
});
  }


 calculateStatistics(): void {
  this.totalTickets = this.tickets.length;

  this.openTickets = this.tickets.filter(
    ticket => ticket.status === 'OPEN'
  ).length;

  this.inProgressTickets = this.tickets.filter(
    ticket => ticket.status === 'IN_PROGRESS'
  ).length;

  this.resolvedTickets = this.tickets.filter(
    ticket => ticket.status === 'RESOLVED'
  ).length;

}


}