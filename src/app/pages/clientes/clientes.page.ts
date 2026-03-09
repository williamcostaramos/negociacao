import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { LayoutMenuComponent } from '../../shared/components/layout-menu/layout-menu.component';
import { LayoutTopbarComponent } from '../../shared/components/layout-topbar/layout-topbar.component';
import { CriarClienteModal } from './criar-cliente/criar-cliente.page';
import { Cliente } from '../../core/services/cliente.service';

@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    CardModule,
    ChartModule,
    TableModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    LayoutMenuComponent,
    LayoutTopbarComponent,
    CriarClienteModal,
  ],
  templateUrl: './clientes.page.html',
  styleUrl: './clientes.page.scss',
})
export class ClientesPage {
  protected readonly filtro = signal('');
  protected readonly exibirModalCriar = signal(false);

  protected readonly clientesPorMes = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Clientes acumulados',
        data: [8, 12, 17, 23, 5, 35],
        fill: false,
        tension: 0.3,
      },
    ],
  };

  protected readonly clientesPorMesOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  protected readonly clientes = signal<Cliente[]>([
    {
      nome: 'Ana Souza',
      email: 'ana.souza@empresa.com',
      telefone: '(11) 99999-1001',
      status: 'Ativo',
    },
    {
      nome: 'Bruno Lima',
      email: 'bruno.lima@empresa.com',
      telefone: '(21) 98888-2002',
      status: 'Ativo',
    },
    {
      nome: 'Carla Mendes',
      email: 'carla.mendes@empresa.com',
      telefone: '(31) 97777-3003',
      status: 'Inativo',
    },
  ]);

  constructor(private readonly router: Router) {}

  protected get clientesFiltrados(): Cliente[] {
    const termo = this.filtro().trim().toLowerCase();

    if (!termo) {
      return this.clientes();
    }

    return this.clientes().filter((cliente) => {
      return (
        cliente.nome.toLowerCase().includes(termo) ||
        cliente.email.toLowerCase().includes(termo) ||
        cliente.telefone.toLowerCase().includes(termo)
      );
    });
  }

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

  protected adicionarNovoCliente(cliente: Cliente): void {
    const novoCliente: Cliente = {
      ...cliente,
      status: (cliente.status as string) === 'Ativo' ? 'Ativo' : 'Inativo',
    };
    this.clientes.update((clientes) => [...clientes, novoCliente]);
  }
}
