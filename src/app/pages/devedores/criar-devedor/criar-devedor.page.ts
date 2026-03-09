import { CommonModule } from '@angular/common';
import { Component, signal, Output, EventEmitter, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DevedorService, Devedor } from '../../../core/services/devedor.service';

@Component({
  selector: 'app-criar-devedor-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputMaskModule,
    InputNumberModule,
    SelectModule,
    ToastModule,
  ],
  templateUrl: './criar-devedor.page.html',
  styleUrl: './criar-devedor.page.scss',
  providers: [MessageService],
})
export class CriarDevedorModal implements OnChanges {
  @Input() exibirModal = false;
  @Output() fechar = new EventEmitter<void>();
  @Output() devedorCriado = new EventEmitter<Devedor>();

  formulario!: FormGroup;
  carregando = signal(false);
  visivel = signal(false);

  readonly statusOptions = [
    { label: 'Em atraso', value: 'Em atraso' },
    { label: 'Negociando', value: 'Negociando' },
    { label: 'Quitado', value: 'Quitado' },
  ];

  readonly fb = inject(FormBuilder);
  readonly devedorService = inject(DevedorService);
  readonly messageService = inject(MessageService);

  constructor() {
    this.inicializarFormulario();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exibirModal'] && changes['exibirModal'].currentValue) {
      this.visivel.set(true);
      this.inicializarFormulario();
    }
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      documento: ['', [Validators.required]],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      vencimento: ['', [Validators.required]],
      status: ['Em atraso', Validators.required],
      observacoes: [''],
    });
  }

  salvarDevedor(): void {
    if (this.formulario.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulário Inválido',
        detail: 'Preencha todos os campos obrigatórios corretamente.',
        life: 3000,
      });
      return;
    }

    this.carregando.set(true);

    try {
      const novoDevedor: Devedor = this.formulario.value;
      const sucesso = this.devedorService.adicionarDevedor(novoDevedor);

      if (sucesso) {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Devedor cadastrado com sucesso!',
          life: 3000,
        });

        this.devedorCriado.emit(novoDevedor);

        setTimeout(() => {
          this.fecharModal();
        }, 1000);
      } else {
        throw new Error('Falha ao adicionar devedor');
      }
    } catch (erro) {
      console.error(erro);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao cadastrar devedor. Tente novamente.',
        life: 3000,
      });
    } finally {
      this.carregando.set(false);
    }
  }

  cancelar(): void {
    this.fecharModal();
  }

  private fecharModal(): void {
    this.visivel.set(false);
    this.fechar.emit();
  }

  obterMensagemErro(nomeCampo: string): string {
    const controle = this.formulario.get(nomeCampo);

    if (!controle || !controle.errors || !controle.touched) {
      return '';
    }

    if (controle.errors['required']) {
      return `${this.obterLabelCampo(nomeCampo)} é obrigatório`;
    }

    if (controle.errors['minlength']) {
      return `${this.obterLabelCampo(nomeCampo)} deve ter no mínimo ${controle.errors['minlength'].requiredLength} caracteres`;
    }

    if (controle.errors['min']) {
      return `${this.obterLabelCampo(nomeCampo)} deve ser maior que 0`;
    }

    return 'Campo inválido';
  }

  private obterLabelCampo(nomeCampo: string): string {
    const labels: Record<string, string> = {
      nome: 'Nome',
      documento: 'Documento',
      valor: 'Valor',
      vencimento: 'Vencimento',
      status: 'Status',
      observacoes: 'Observações',
    };
    return labels[nomeCampo] || nomeCampo;
  }

  verificarCampoInvalido(nomeCampo: string): boolean {
    const controle = this.formulario.get(nomeCampo);
    return !!(controle && controle.invalid && controle.touched);
  }
}
