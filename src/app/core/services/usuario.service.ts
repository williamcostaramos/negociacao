import { Injectable } from '@angular/core';

export interface Usuario {
  id?: string;
  nome: string;
  email: string;
  perfil: 'Administrador' | 'Operador' | 'Leitura';
  status: 'Ativo' | 'Inativo';
  senha?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor() {}

  adicionarUsuario(usuario: Usuario): boolean {
    // TODO: Implementar lógica de adição de usuário (integração com API)
    console.log('Usuário adicionado:', usuario);
    return true;
  }

  obterUsuarios(): Usuario[] {
    // TODO: Implementar lógica para buscar usuários da API
    return [];
  }

  obterUsuarioPorId(id: string): Usuario | null {
    // TODO: Implementar lógica para buscar usuário específico
    return null;
  }

  atualizarUsuario(id: string, usuario: Partial<Usuario>): boolean {
    // TODO: Implementar lógica de atualização
    return true;
  }

  deletarUsuario(id: string): boolean {
    // TODO: Implementar lógica de deleção
    return true;
  }
}
