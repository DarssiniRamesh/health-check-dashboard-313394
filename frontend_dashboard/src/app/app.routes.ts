import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { CustomersComponent } from './customers/customers.component';
import { CategoriesComponent } from './categories/categories.component';
import { HoursComponent } from './hours/hours.component';
import { ReportsComponent } from './reports/reports.component';
import { HealthComponent } from './health/health.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'hours', component: HoursComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'health', component: HealthComponent },
];
