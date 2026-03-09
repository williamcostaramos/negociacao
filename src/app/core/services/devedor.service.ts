import { Injectable } from '@angular/core';

export interface Devedor {
  id?: string;
  nome: string;
  documento: string;
  valor: number;
  vencimento: string;
  status: 'Em atraso' | 'Negociando' | 'Quitado';
  observacoes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DevedorService {
  constructor() {}

  adicionarDevedor(devedor: Devedor): boolean {
    // TODO: Implementar lógica de adição de devedor (integração com API)
    console.log('Devedor adicionado:', devedor);
    return true;
  }

  obterDevedores(): Devedor[] {
    // TODO: Implementar lógica para buscar devedores da API
    return [];
  }

  obterDevedorPorId(id: string): Devedor | null {
    // TODO: Implementar lógica para buscar devedor específico
    return null;
  }

  atualizarDevedor(id: string, devedor: Partial<Devedor>): boolean {
    // TODO: Implementar lógica de atualização
    return true;
  }

  deletarDevedor(id: string): boolean {
    // TODO: Implementar lógica de deleção
    return true;
  }
}
