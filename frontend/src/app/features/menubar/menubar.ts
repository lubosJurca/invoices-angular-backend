import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Menubar } from 'primeng/menubar';

import { AvatarModule } from 'primeng/avatar';
import { Router, RouterModule } from '@angular/router';
import { Popover, PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../shared/services/toast';

@Component({
  selector: 'app-menubar',
  imports: [Menubar, AvatarModule, RouterModule, PopoverModule, ButtonModule],
  templateUrl: './menubar.html',
  styleUrl: './menubar.css',
})
export class MenubarTemplate {
  @ViewChild('op') op!: Popover;
  authService = inject(AuthService);
  router = inject(Router);
  toastService = inject(ToastService);

  toggle(event: Event) {
    this.op.toggle(event);
  }

  logoutUser() {
    this.authService.logout().subscribe({
      next: (res) => {
        this.toastService.success(res.message);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.router.navigate(['/login']);
      },
    });
  }
}
