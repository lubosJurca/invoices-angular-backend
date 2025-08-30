import { Routes } from '@angular/router';
import { HomePage } from './features/home-page/home-page';
import { LoginPage } from './features/login-page/login-page';
import { SignUpPage } from './features/sign-up-page/sign-up-page';
import { Dashboard } from './features/dashboard/dashboard';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'Home',
  },
  {
    path: 'login',
    component: LoginPage,
    title: 'Login',
  },
  {
    path: 'sign-up',
    component: SignUpPage,
    title: 'Sign Up',
  },
  {
    path: 'dashboard',
    component: Dashboard,
    title: 'Dashboard',
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: HomePage,
    title: 'Home',
  },
];
