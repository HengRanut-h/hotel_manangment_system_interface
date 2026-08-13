import { Routes } from '@angular/router';
export const guestRoutes:Routes=[
 {path:'dashboard',loadComponent:()=>import('./pages/dashboard/guest-dashboard.page').then(m=>m.GuestDashboardPage)},
 {path:'profile',loadComponent:()=>import('../profile/pages/profile/profile.page').then(m=>m.ProfilePage)},
 {path:'notifications',loadComponent:()=>import('../administration/pages/notifications/notifications.page').then(m=>m.NotificationsPage)},
 {path:'',pathMatch:'full',redirectTo:'dashboard'}
];
