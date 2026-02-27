import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { LayoutMenuComponent } from '../../shared/components/layout-menu/layout-menu.component';
import { LayoutTopbarComponent } from '../../shared/components/layout-topbar/layout-topbar.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToolbarModule,
    TagModule,
    ChartModule,
    LayoutMenuComponent,
    LayoutTopbarComponent,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  private readonly router = inject(Router);

  readonly metrics = [
    { title: 'Negociações hoje', value: '18', severity: 'success' as const },
    { title: 'Pendentes', value: '6', severity: 'warn' as const },
    { title: 'Conversão', value: '42%', severity: 'info' as const },
  ];

  readonly percentualInadimplencia = {
    labels: ['Não pagos após vencimento', 'Pagos no prazo'],
    datasets: [
      {
        data: [22, 78],
      },
    ],
  };

  readonly percentualInadimplenciaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context: { label: string; parsed: number }) => {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  logout(): void {
    void this.router.navigate(['/login']);
  }
}
