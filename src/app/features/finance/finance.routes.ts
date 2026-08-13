import { Routes } from '@angular/router';import { permissionGuard } from '../../core/guards/permission.guard';
const explorer=(path:string,title:string,endpoint:string,permission:string,columns:unknown[])=>({path,loadComponent:()=>import('../../shared/pages/data-explorer/data-explorer.page').then(m=>m.DataExplorerPage),canActivate:[permissionGuard],data:{title,endpoint,permission,columns}});
export const financeRoutes:Routes=[
 {path:'folios',loadComponent:()=>import('./pages/folios/folios.page').then(m=>m.FoliosPage),canActivate:[permissionGuard],data:{permission:'folios.view'}},
 explorer('invoices','Invoices','invoices','invoices.view',[{key:'invoiceNumber',label:'Invoice'},{key:'guestName',label:'Guest'},{key:'invoiceDate',label:'Date'},{key:'totalAmount',label:'Total',type:'money'},{key:'balanceAmount',label:'Balance',type:'money'},{key:'status',label:'Status',type:'status'}]),
 explorer('payments','Payments','payments','payments.view',[{key:'paymentNumber',label:'Payment'},{key:'amount',label:'Amount',type:'money'},{key:'method',label:'Method'},{key:'referenceNumber',label:'Reference'},{key:'paidAtUtc',label:'Paid At',type:'date'}]),
 ...['deposits','refunds','taxes','discounts','utility-rates'].map(path=>({path,loadComponent:()=>import('../../shared/resource/resource-page.component').then(m=>m.ResourcePageComponent),canActivate:[permissionGuard],data:{resource:path,permission:`${path}.view`}})),
 {path:'utilities',loadComponent:()=>import('./pages/utilities/utilities.page').then(m=>m.UtilitiesPage),canActivate:[permissionGuard],data:{permission:'utilities.view'}},
 {path:'utility-meters',loadComponent:()=>import('./pages/utilities/utilities.page').then(m=>m.UtilitiesPage),canActivate:[permissionGuard],data:{permission:'utilities.view'}},
 {path:'meter-readings',loadComponent:()=>import('./pages/utilities/utilities.page').then(m=>m.UtilitiesPage),canActivate:[permissionGuard],data:{permission:'utilities.view'}}
];
