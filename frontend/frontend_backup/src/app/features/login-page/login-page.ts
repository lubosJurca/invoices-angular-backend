import { Component, DestroyRef, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../shared/services/toast';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FloatLabel,
    PasswordModule,
    RouterLink,
    ToastModule,
  ],

  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.getRawValue();
      this.authService
        .loginUser({ email, password })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            console.log('Successfully logged in');
            this.toastService.success(res.message);
            this.loginForm.reset();
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Error:', err.error.message);
            this.toastService.error(err.error.message || 'Unknown error');
          },
        });
    }
  }

  hasError(controlName: string): boolean {
    const control = this.loginForm?.get(controlName);
    return !!(control?.touched && control?.invalid);
  }
}
