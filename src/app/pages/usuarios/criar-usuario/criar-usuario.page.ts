import { CommonModule } from '@angular/common';
import { Component, signal, Output, EventEmitter, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UsuarioService, Usuario } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-criar-usuario-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    ToastModule,
  ],
  templateUrl: './criar-usuario.page.html',
  styleUrl: './criar-usuario.page.scss',
  providers: [MessageService],
})
export class CriarUsuarioModal implements OnChanges {
  @Input() exibirModal = false;
  @Output() fechar = new EventEmitter<void>();
  @Output() usuarioCriado = new EventEmitter<Usuario>();

  formulario!: FormGroup;
  carregando = signal(false);
  visivel = signal(false);

  readonly perfilOptions = [
    { label: 'Administrador', value: 'Administrador' },
    { label: 'Operador', value: 'Operador' },
    { label: 'Leitura', value: 'Leitura' },
  ];

  readonly statusOptions = [
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Inativo', value: 'Inativo' },
  ];

  readonly fb = inject(FormBuilder);
  readonly usuarioService = inject(UsuarioService);
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
      senha: ['', [Validators.required, Validators.minLength(6)]],
      perfil: ['Operador', Validators.required],
      status: ['Ativo', Validators.required],
    });
  }

  salvarUsuario(): void {
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
      const novoUsuario: Usuario = this.formulario.value;
      const sucesso = this.usuarioService.adicionarUsuario(novoUsuario);

      if (sucesso) {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário cadastrado com sucesso!',
          life: 3000,
        });

        this.usuarioCriado.emit(novoUsuario);

        setTimeout(() => {
          this.fecharModal();
        }, 1000);
      } else {
        throw new Error('Falha ao adicionar usuário');
      }
    } catch (erro) {
      console.error(erro);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao cadastrar usuário. Tente novamente.',
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
      senha: 'Senha',
      perfil: 'Perfil',
      status: 'Status',
    };
    return labels[nomeCampo] || nomeCampo;
  }

  verificarCampoInvalido(nomeCampo: string): boolean {
    const controle = this.formulario.get(nomeCampo);
    return !!(controle && controle.invalid && controle.touched);
  }
}
