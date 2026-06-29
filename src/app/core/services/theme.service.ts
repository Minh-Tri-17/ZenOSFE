import { effect, Injectable, signal } from '@angular/core';
import { BASE_CONSTANTS } from '../constants/base.constant';

export type Theme = typeof BASE_CONSTANTS.lightTheme | typeof BASE_CONSTANTS.darkTheme;

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme = signal<Theme>(
    (localStorage.getItem(BASE_CONSTANTS.themeStorageKey) as Theme) || BASE_CONSTANTS.lightTheme,
  );

  constructor() {
    effect(() => {
      const theme = this.currentTheme();
      const root = document.documentElement;

      if (theme === BASE_CONSTANTS.darkTheme)
        root.setAttribute('data-theme', BASE_CONSTANTS.darkTheme);
      else root.removeAttribute('data-theme');

      localStorage.setItem(BASE_CONSTANTS.themeStorageKey, theme);
    });
  }

  toggleTheme() {
    this.currentTheme.update((theme) =>
      theme === BASE_CONSTANTS.lightTheme ? BASE_CONSTANTS.darkTheme : BASE_CONSTANTS.lightTheme,
    );
  }

  isDark(): boolean {
    return this.currentTheme() === BASE_CONSTANTS.darkTheme;
  }
}
