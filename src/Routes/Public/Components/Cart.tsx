import { Component } from 'react';

// Defina uma interface para o estado da classe
interface CartClassState {
  itens: any[]; // Substitua 'any' pelo tipo de dados correto dos itens
}

class CartClass extends Component<{}, CartClassState> {
    constructor(props: {}) {
      super(props);
      // Inicialize o estado com um array vazio
      this.state = {
        itens: [],
      };
    };

    // Função para adicionar um item ao estado
    adicionarItem = (novoItem: any) => {
        this.setState((prevState) => ({
        itens: [...prevState.itens, novoItem],
        }), () => {
        // O código dentro deste callback é executado após o estado ser atualizado.
        console.log('Aqui', this.state); // Isso irá imprimir o estado após a adição do novo item.
        });
    };

    // Você pode acessar o estado 'itens' diretamente dentro deste método
    getItens = () => {
        return this.state.itens;
    };
};

export default CartClass;

