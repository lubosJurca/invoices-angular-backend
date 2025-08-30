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
import { distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../shared/services/toast';

@Component({
  selector: 'app-sign-up-page',
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
  templateUrl: './sign-up-page.html',
})
export class SignUpPage {
  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  registerForm = this.formBuilder.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    },
    { validators: this.passwordMatch }
  );

  passwordMatch(form: any) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.getRawValue();

      this.authService
        .registerUser({ name, email, password })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            console.log('Registered:', res.message);
            this.toastService.success(res.message);
            this.registerForm.reset();
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
    const control = this.registerForm?.get(controlName);
    return !!(control?.touched && control?.invalid);
  }
}
