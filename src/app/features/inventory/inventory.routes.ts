import { Routes } from '@angular/router';import { permissionGuard } from '../../core/guards/permission.guard';
export const inventoryRoutes:Routes=[
 {path:'items',loadComponent:()=>import('./pages/inventory/inventory.page').then(m=>m.InventoryPage),canActivate:[permissionGuard],data:{permission:'inventory.view'}},
 ...['warehouses','stock-transactions','suppliers','purchase-requests','purchase-orders','goods-receipts'].map(path=>({path,loadComponent:()=>import('../../shared/resource/resource-page.component').then(m=>m.ResourcePageComponent),canActivate:[permissionGuard],data:{resource:path,permission:`${path}.view`}}))
];
