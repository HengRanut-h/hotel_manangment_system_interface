import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';
export const frontOfficeRoutes:Routes=[
 {path:'availability',loadComponent:()=>import('./pages/availability/availability.page').then(m=>m.AvailabilityPage),canActivate:[permissionGuard],data:{permission:'availability.view'}},
 {path:'reservations',loadComponent:()=>import('./pages/reservations/reservations.page').then(m=>m.ReservationsPage),canActivate:[permissionGuard],data:{permission:'reservations.view'}},
 {path:'check-ins',loadComponent:()=>import('./pages/check-in-out/check-in-out.page').then(m=>m.CheckInOutPage),canActivate:[permissionGuard],data:{permission:'reservations.check-in',mode:'check-in'}},
 {path:'check-outs',loadComponent:()=>import('./pages/check-in-out/check-in-out.page').then(m=>m.CheckInOutPage),canActivate:[permissionGuard],data:{permission:'reservations.check-out',mode:'check-out'}},
 {path:'guests',loadComponent:()=>import('./pages/guests/guests.page').then(m=>m.GuestsPage),canActivate:[permissionGuard],data:{permission:'guests.view'}},
 ...['room-assignments','room-changes','stay-extensions'].map(path=>({path,loadComponent:()=>import('../../shared/resource/resource-page.component').then(m=>m.ResourcePageComponent),canActivate:[permissionGuard],data:{resource:path,permission:`${path}.view`}}))
];
