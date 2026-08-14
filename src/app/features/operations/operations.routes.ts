import { Routes } from '@angular/router';import { permissionGuard } from '../../core/guards/permission.guard';
const explorer=(path:string,title:string,endpoint:string,permission:string,columns:unknown[])=>({path,loadComponent:()=>import('../../shared/pages/data-explorer/data-explorer.page').then(m=>m.DataExplorerPage),canActivate:[permissionGuard],data:{title,endpoint,permission,columns}});
export const operationsRoutes:Routes=[
 {path:'housekeeping',loadChildren:()=>import('./housekeeping/housekeeping.routes').then(m=>m.housekeepingRoutes)},
 {path:'room-inspections',loadChildren:()=>import('./room-inspections/room-inspections.routes').then(m=>m.roomInspectionsRoutes)},
 {path:'maintenance',loadChildren:()=>import('./maintenance/maintenance.routes').then(m=>m.maintenanceRoutes)},
 ...['services','guest-requests','complaints','lost-and-found','laundry','transportation','security-incidents'].map(path=>({path,loadComponent:()=>import('../../shared/resource/resource-page.component').then(m=>m.ResourcePageComponent),canActivate:[permissionGuard],data:{resource:path,permission:`${path}.view`}})),
 explorer('restaurant','Restaurant / POS','restaurant/menu','restaurant.view',[{key:'name',label:'Menu Item'},{key:'price',label:'Price',type:'money'},{key:'isAvailable',label:'Available'},{key:'categoryId',label:'Category'}])
];
