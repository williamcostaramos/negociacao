import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { CriarDevedorModal } from './criar-devedor/criar-devedor.page';
import { Devedor } from '../../core/services/devedor.service';

@Component({
  selector: 'app-devedores-page',
  standalone: true,
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
    CurrencyPipe,
    CriarDevedorModal,
  ],
  templateUrl: './devedores.page.html',
  styleUrl: './devedores.page.scss',
})
export class DevedoresPage {
  private readonly router = inject(Router);

  protected readonly filtro = signal('');
  protected readonly exibirModalCriar = signal(false);

  protected readonly devedores = signal<Devedor[]>([
    {
      nome: 'Carlos Andrade',
      documento: 'CPF 123.456.789-10',
      valor: 3250.9,
      vencimento: '12/01/2026',
      status: 'Em atraso',
    },
    {
      nome: 'Fernanda Rocha',
      documento: 'CNPJ 12.345.678/0001-99',
      valor: 18400,
      vencimento: '03/02/2026',
      status: 'Negociando',
    },
    {
      nome: 'Marcos Silva',
      documento: 'CPF 987.654.321-00',
      valor: 950,
      vencimento: '20/12/2025',
      status: 'Quitado',
    },
  ]);

  protected readonly devedoresFiltrados = computed(() => {
    const termo = this.filtro().trim().toLowerCase();

    if (!termo) {
      return this.devedores();
    }

    return this.devedores().filter((devedor) => {
      return (
        devedor.nome.toLowerCase().includes(termo) ||
        devedor.documento.toLowerCase().includes(termo) ||
        devedor.status.toLowerCase().includes(termo)
      );
    });
  });

  protected readonly totalEmAtraso = computed(() => {
    return this.devedores()
      .filter((devedor) => devedor.status === 'Em atraso')
      .reduce((total, devedor) => total + devedor.valor, 0);
  });

   protected readonly totalMontante = computed(() => {
    return this.devedores()
      .reduce((total, devedor) => total + devedor.valor, 0);
  });

  protected readonly totalRegistros = computed(() => this.devedores().length);

  protected atualizarFiltro(valor: string): void {
    this.filtro.set(valor);
  }

  protected voltarDashboard(): void {
    void this.router.navigate(['/dashboard']);
  }

  protected abrirModalCriar(): void {
    this.exibirModalCriar.set(true);
  }

  protected fecharModalCriar(): void {
    this.exibirModalCriar.set(false);
  }

  protected adicionarNovoDevedor(devedor: Devedor): void {
    const novoDevedor: Devedor = {
      ...devedor,
      status: (devedor.status as string) as 'Em atraso' | 'Negociando' | 'Quitado',
    };
    this.devedores.update((devedores) => [...devedores, novoDevedor]);
  }

  protected severityPorStatus(status: Devedor['status']): 'danger' | 'warn' | 'success' {
    if (status === 'Em atraso') {
      return 'danger';
    }

    if (status === 'Negociando') {
      return 'warn';
    }

    return 'success';
  }
}
