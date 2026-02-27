import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { LayoutMenuComponent } from '../../shared/components/layout-menu/layout-menu.component';
import { LayoutTopbarComponent } from '../../shared/components/layout-topbar/layout-topbar.component';

interface Usuario {
  nome: string;
  email: string;
  perfil: 'Administrador' | 'Operador' | 'Leitura';
  status: 'Ativo' | 'Inativo';
}

@Component({
  selector: 'app-usuarios-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ToolbarModule,
    CardModule,
    TableModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    LayoutMenuComponent,
    LayoutTopbarComponent,
  ],
  templateUrl: './usuarios.page.html',
  styleUrl: './usuarios.page.scss',
})
export class UsuariosPage {
  private readonly router = inject(Router);

  protected readonly filtro = signal('');

  protected readonly usuarios = signal<Usuario[]>([
    {
      nome: 'João Martins',
      email: 'joao.martins@negociation.com',
      perfil: 'Administrador',
      status: 'Ativo',
    },
    {
      nome: 'Patrícia Almeida',
      email: 'patricia.almeida@negociation.com',
      perfil: 'Operador',
      status: 'Ativo',
    },
    {
      nome: 'Rafael Gomes',
      email: 'rafael.gomes@negociation.com',
      perfil: 'Leitura',
      status: 'Inativo',
    },
  ]);

  protected readonly usuariosFiltrados = computed(() => {
    const termo = this.filtro().trim().toLowerCase();

    if (!termo) {
      return this.usuarios();
    }

    return this.usuarios().filter((usuario) => {
      return (
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo) ||
        usuario.perfil.toLowerCase().includes(termo) ||
        usuario.status.toLowerCase().includes(termo)
      );
    });
  });

  protected readonly totalUsuarios = computed(() => this.usuarios().length);

  protected readonly totalAtivos = computed(() => {
    return this.usuarios().filter((usuario) => usuario.status === 'Ativo').length;
  });

  protected atualizarFiltro(valor: string): void {
    this.filtro.set(valor);
  }

  protected voltarDashboard(): void {
    void this.router.navigate(['/dashboard']);
  }

  protected severityPorStatus(status: Usuario['status']): 'success' | 'contrast' {
    return status === 'Ativo' ? 'success' : 'contrast';
  }
}
