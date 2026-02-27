import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ThemeMode, ThemeService } from '../../core/theme.service';
import { LayoutMenuComponent } from '../../shared/components/layout-menu/layout-menu.component';
import { LayoutTopbarComponent } from '../../shared/components/layout-topbar/layout-topbar.component';

@Component({
  selector: 'app-configuracoes-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToolbarModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    LayoutMenuComponent,
    LayoutTopbarComponent,
  ],
  templateUrl: './configuracoes.page.html',
  styleUrl: './configuracoes.page.scss',
})
export class ConfiguracoesPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);

  protected readonly salvoComSucesso = signal(false);
  protected readonly modosTema: Array<{ label: string; value: ThemeMode }> = [
    { label: 'Claro', value: 'light' },
    { label: 'Escuro', value: 'dark' },
  ];

  protected readonly form = this.formBuilder.nonNullable.group({
    nomeEmpresa: ['Negociation', [Validators.required, Validators.minLength(2)]],
    emailSuporte: ['suporte@negociation.com', [Validators.required, Validators.email]],
    idiomaPadrao: ['Português (Brasil)', [Validators.required]],
    moedaPadrao: ['BRL', [Validators.required]],
    temaSistema: [this.themeService.getThemeMode() as ThemeMode, [Validators.required]],
  });

  protected salvar(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.salvoComSucesso.set(false);
      return;
    }

    this.themeService.setThemeMode(this.form.controls.temaSistema.value);

    this.salvoComSucesso.set(true);
  }

  protected atualizarTema(valor: string): void {
    const modo = valor === 'dark' ? 'dark' : 'light';
    this.form.controls.temaSistema.setValue(modo);
    this.themeService.setThemeMode(modo);
  }

  protected voltarDashboard(): void {
    void this.router.navigate(['/dashboard']);
  }

  protected get nomeEmpresaInvalido(): boolean {
    const control = this.form.controls.nomeEmpresa;
    return control.invalid && (control.dirty || control.touched);
  }

  protected get emailSuporteInvalido(): boolean {
    const control = this.form.controls.emailSuporte;
    return control.invalid && (control.dirty || control.touched);
  }
}
