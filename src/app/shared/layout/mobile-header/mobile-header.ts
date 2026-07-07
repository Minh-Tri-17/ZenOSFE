import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-mobile-header',
  imports: [],
  templateUrl: './mobile-header.html',
  styleUrl: './mobile-header.scss',
})
export class MobileHeader {
  protected themeService = inject(ThemeService);
  private router = inject(Router);

  //#region //@ METHODS

  handleToggleTheme() {
    this.themeService.toggleTheme();
  }

  handleLogout() {
    this.router.navigate(['/login']);
  }

  //#endregion
}
