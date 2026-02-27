import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'app-theme-mode';

  readonly isDarkMode = signal(false);

  constructor() {
    this.initializeTheme();
  }

  toggleTheme(): void {
    this.setThemeMode(this.isDarkMode() ? 'light' : 'dark');
  }

  setThemeMode(mode: ThemeMode): void {
    this.applyTheme(mode === 'dark');
  }

  getThemeMode(): ThemeMode {
    return this.isDarkMode() ? 'dark' : 'light';
  }

  private initializeTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedMode = localStorage.getItem(this.storageKey);

    if (savedMode === 'dark' || savedMode === 'light') {
      this.setThemeMode(savedMode);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(prefersDark);
  }

  private applyTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.documentElement.classList.toggle('app-dark', isDark);
    this.document.body.classList.toggle('app-dark', isDark);
    this.document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
  }
}
