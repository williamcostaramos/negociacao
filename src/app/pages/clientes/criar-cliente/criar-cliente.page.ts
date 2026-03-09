import { CommonModule } from '@angular/common';
import { Component, signal, Output, EventEmitter, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ClienteService, Cliente } from '../../../core/services/cliente.service';

@Component({
  selector: 'app-criar-cliente-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputMaskModule,
    SelectModule,
    ToastModule,
  ],
  templateUrl: './criar-cliente.page.html',
  styleUrl: './criar-cliente.page.scss',
  providers: [MessageService],
})
export class CriarClienteModal implements OnChanges {
  @Input() exibirModal = false;
  @Output() fechar = new EventEmitter<void>();
  @Output() clienteCriado = new EventEmitter<Cliente>();

  formulario!: FormGroup;
  carregando = signal(false);
  visivel = signal(false);

  readonly statusOptions = [
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Inativo', value: 'Inativo' },
  ];

  readonly fb = inject(FormBuilder);
  readonly clienteService = inject(ClienteService);
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
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      endereco: [''],
      cidade: [''],
      estado: [''],
      cep: [''],
      status: ['Ativo', Validators.required],
    });
  }

  salvarCliente(): void {
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
      const novoCliente: Cliente = this.formulario.value;
      const sucesso = this.clienteService.adicionarCliente(novoCliente);

      if (sucesso) {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cliente cadastrado com sucesso!',
          life: 3000,
        });

        this.clienteCriado.emit(novoCliente);

        setTimeout(() => {
          this.fecharModal();
        }, 1000);
      } else {
        throw new Error('Falha ao adicionar cliente');
      }
    } catch (erro) {
      console.error(erro);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao cadastrar cliente. Tente novamente.',
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

    if (controle.errors['email']) {
      return 'Email inválido';
    }

    return 'Campo inválido';
  }

  private obterLabelCampo(nomeCampo: string): string {
    const labels: Record<string, string> = {
      nome: 'Nome',
      email: 'Email',
      telefone: 'Telefone',
      endereco: 'Endereço',
      cidade: 'Cidade',
      estado: 'Estado',
      cep: 'CEP',
      status: 'Status',
    };
    return labels[nomeCampo] || nomeCampo;
  }

  verificarCampoInvalido(nomeCampo: string): boolean {
    const controle = this.formulario.get(nomeCampo);
    return !!(controle && controle.invalid && controle.touched);
  }
}
