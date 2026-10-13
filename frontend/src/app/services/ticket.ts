import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

export interface TicketData {
  title: string;
  category: string;
  priority: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private apiUrl = 'http://localhost:3000/api/tickets';

  createTicket(ticket: TicketData): Observable<unknown> {
    const token = this.authService.getToken();

    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.post<unknown>(this.apiUrl, ticket, { headers });
  }

  getTickets(): Observable<unknown> {
  const token = this.authService.getToken();

  const headers = token
    ? new HttpHeaders({ Authorization: `Bearer ${token}` })
    : new HttpHeaders();

  return this.http.get<unknown>(this.apiUrl, { headers });
}


getTicketById(id: number): Observable<unknown> {
  const token = this.authService.getToken();

  const headers = token
    ? new HttpHeaders({ Authorization: `Bearer ${token}` })
    : new HttpHeaders();

  return this.http.get<unknown>(`${this.apiUrl}/${id}`, { headers });
}


updateTicketStatus(id: number, status: string): Observable<unknown> {
  const token = this.authService.getToken();
  const headers = token
    ? new HttpHeaders({ Authorization: `Bearer ${token}` })
    : new HttpHeaders();

  return this.http.patch<unknown>(
    `${this.apiUrl}/${id}/status`,
    { status },
    { headers }
  );
}


}