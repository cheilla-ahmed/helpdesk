import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { TicketList } from './pages/ticket-list/ticket-list';
import { TicketCreate } from './pages/ticket-create/ticket-create';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { Register } from './pages/register/register';
import { TicketDetail } from './pages/ticket-detail/ticket-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'tickets', component: TicketList, canActivate: [authGuard] },
  { path: 'tickets/new', component: TicketCreate, canActivate: [authGuard] },
  { path: 'tickets/:id', component: TicketDetail, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];