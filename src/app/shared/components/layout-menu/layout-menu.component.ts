import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

interface LayoutMenuItem {
  label: string;
  icon: string;
  route: string;
}

interface LayoutMenuSection {
  label: string;
  items: LayoutMenuItem[];
}

@Component({
  selector: 'app-layout-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './layout-menu.component.html',
  styleUrl: './layout-menu.component.scss',
})
export class LayoutMenuComponent {
  private readonly router = inject(Router);
  protected readonly mobileMenuOpen = signal(false);

  readonly sections: LayoutMenuSection[] = [
    {
      label: 'DASHBOARDS',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-chart-line',
          route: '/dashboard',
        },
      ],
    },
    {
      label: 'APPS',
      items: [
        {
          label: 'Clientes',
          icon: 'pi pi-users',
          route: '/clientes',
        },
        {
          label: 'Usuários',
          icon: 'pi pi-user',
          route: '/usuarios',
        },
        {
          label: 'Devedores',
          icon: 'pi pi-wallet',
          route: '/devedores',
        },
        {
          label: 'Configurações',
          icon: 'pi pi-cog',
          route: '/configuracoes',
        },
        {
          label: 'Sair',
          icon: 'pi pi-sign-out',
          route: '/login',
        },
      ],
    },
  ];

  protected navigate(route: string): void {
    void this.router.navigate([route]);
    this.mobileMenuOpen.set(false);
  }

  protected isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(`${route}/`);
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
