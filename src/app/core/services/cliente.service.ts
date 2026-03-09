import { Injectable } from '@angular/core';

export interface Cliente {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  status?: 'Ativo' | 'Inativo';
}

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor() {}

  adicionarCliente(cliente: Cliente): boolean {
    // TODO: Implementar lógica de adição de cliente (integração com API)
    console.log('Cliente adicionado:', cliente);
    return true;
  }

  obterClientes(): Cliente[] {
    // TODO: Implementar lógica para buscar clientes da API
    return [];
  }

  obterClientePorId(id: string): Cliente | null {
    // TODO: Implementar lógica para buscar cliente específico
    return null;
  }

  atualizarCliente(id: string, cliente: Partial<Cliente>): boolean {
    // TODO: Implementar lógica de atualização
    return true;
  }

  deletarCliente(id: string): boolean {
    // TODO: Implementar lógica de deleção
    return true;
  }
}
