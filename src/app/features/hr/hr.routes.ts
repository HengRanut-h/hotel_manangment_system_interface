import { Routes } from '@angular/router';import { permissionGuard } from '../../core/guards/permission.guard';
export const hrRoutes:Routes=[
 {path:'employees',loadComponent:()=>import('./pages/employees/employees.page').then(m=>m.EmployeesPage),canActivate:[permissionGuard],data:{permission:'employees.view'}},
 ...['departments','positions','shifts','attendance','leave-requests'].map(path=>({path,loadComponent:()=>import('../../shared/resource/resource-page.component').then(m=>m.ResourcePageComponent),canActivate:[permissionGuard],data:{resource:path,permission:`${path}.view`}}))
];
