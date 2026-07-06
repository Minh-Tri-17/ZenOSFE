import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected themeService = inject(ThemeService);
  protected authService = inject(AuthService);
  private router = inject(Router);

  handleToggleTheme() {
    this.themeService.toggleTheme();
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
