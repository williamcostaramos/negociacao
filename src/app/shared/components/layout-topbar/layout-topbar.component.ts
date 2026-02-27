import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../../core/theme.service';

@Component({
  selector: 'app-layout-topbar',
  imports: [ButtonModule],
  templateUrl: './layout-topbar.component.html',
  styleUrl: './layout-topbar.component.scss',
})
export class LayoutTopbarComponent {
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);

  protected readonly isDarkMode = this.themeService.isDarkMode;

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected getPageTitle(): string {
    const path = this.router.url.split('?')[0];

    if (path.startsWith('/dashboard')) {
      return 'Dashboard';
    }

    if (path.startsWith('/clientes')) {
      return 'Gestão de clientes';
    }

    if (path.startsWith('/usuarios')) {
      return 'Gestão de usuários';
    }

    if (path.startsWith('/devedores')) {
      return 'Gestão de devedores';
    }

    if (path.startsWith('/configuracoes')) {
      return 'Configurações da aplicação';
    }

    return 'Negociation';
  }
}
